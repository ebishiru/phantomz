import Phaser from "phaser"
import GameScene from "../scenes/GameScene"
import { showFloatingDamage } from "../systems/DamageTextSystem"
import FacingIndicator from "./FacingIndicator"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 300
    maxHealth = 100
    health = 100
    exp = 0
    level = 1
    expToNextLevel = 10
    hurtboxRadius = 3
    isWarded = false
    isInvulnerable = false

    //Passive effects:
    statModifiers = {
        flatDamage: 0,
        damageMultiplier: 1,
        cooldownMultiplier: 1,
        aoeMultiplier: 1,
        speedMultiplier: 1,
        damageReductionFlat: 0,
        executionerLevel: 0,
        echoChance: 0, 
        gourmetLevel: 0,
        desperationLevel: 0,
    }

    skills: any[] = []
    passives: { key: string, level: number }[] = []

    desperationVFX?: Phaser.GameObjects.Sprite
    desperationTween?: Phaser.Tweens.Tween

    facing!: Phaser.Math.Vector2
    facingIndicator!: FacingIndicator

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(2)

        this.body?.setSize(16, 16)
        this.body?.setOffset(0, 0)

        this.setCollideWorldBounds(true)
        
        //Default Facing down
        this.facing = new Phaser.Math.Vector2(0, 1)

        //Facing indicator
        this.facingIndicator = new FacingIndicator(scene, this)

        //Idle animation
        this.anims.play(`${this.texture.key}-idle`, true)

        // Desperation follow VFX
        this.desperationVFX = this.scene.add.sprite(this.x, this.y, "desperation-vfx")
            .setOrigin(0.5, 0.5)
            .setScale(2)
            .setDepth(this.y - 1)
            .setVisible(false)
            .setAlpha(1)

        this.desperationTween = this.scene.tweens.add({
            targets: this.desperationVFX,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        })
        this.desperationTween.pause()
    }

    private getReflectedDamage(amount: number) {
        const mods = this.statModifiers
        let reflectedAmount = (amount * 2 + mods.flatDamage) * mods.damageMultiplier

        const boss = (this.scene as any).bossManager?.boss
        if (boss && mods.executionerLevel > 0) {
            const threshold = 0.25 + (mods.executionerLevel - 1) * 0.05
            if (boss.health / boss.maxHealth <= threshold) {
                reflectedAmount *= 1.25
            }
        }

        if (Math.random() < mods.echoChance) {
            reflectedAmount *= 2
        }

        return Math.max(1, Math.round(reflectedAmount))
    }

    takeDamage(amount: number) {

        //Ward Skill
        if (this.isWarded) {
            const boss = (this.scene as any).bossManager?.boss;

            //Reflect damage back to boss and heal player
            if (boss) {
                boss.takeDamage(this.getReflectedDamage(amount))
            }
            this.heal(5);
            return
        }

        //Invulnerability
        if (this.isInvulnerable) return;

        //Passive
        amount -= this.statModifiers.damageReductionFlat
        amount = Math.max(1, amount)

        this.health -= amount
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth)

        showFloatingDamage(this.scene, this.x, this.y - 20, amount, "#b56d7f")

        this.setTint(0xff0000)

        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })

        if (this.health <= 0) {
            this.die()
        }
    }

    getDesperationThreshold() {
        const level = this.statModifiers.desperationLevel || 0
        return 0.15 + level * 0.05
    }

    isDesperationActive() {
        if (this.statModifiers.desperationLevel <= 0) return false
        return this.health / this.maxHealth <= this.getDesperationThreshold()
    }

    updateDesperationVFX() {
        const active = this.isDesperationActive()

        if (!this.desperationVFX) return

        if (active) {
            this.desperationVFX
                .setVisible(true)
                .setPosition(this.x, this.y)
                .setDepth(this.y - 1)

            this.desperationTween?.resume()
        } else {
            this.desperationTween?.pause()
            this.desperationVFX
                .setVisible(false)
                .setAlpha(1)
        }
    }

    getCurrentSpeed() {
        const multiplier = this.statModifiers.speedMultiplier || 1
        return this.speed * multiplier * (this.isDesperationActive() ? 1.2 : 1)
    }

    heal(amount: number) {
        if (this.health >= this.maxHealth) return

        this.health += amount
        this.health = Math.min(this.health, this.maxHealth)

        showFloatingDamage(this.scene, this.x, this.y - 20, amount, "#70b56d")

        this.setTint(0x00ff00)

        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })
    }

    move(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.getCurrentSpeed(), dir.y * this.getCurrentSpeed())

        if(dir.lengthSq() > 0) {
            this.facing.copy(dir).normalize()
        }
    }

    update() {
        //empty
    }

    gainExp(amount: number) {
        this.exp += amount

        while(this.exp >= this.expToNextLevel) {
            const gameScene = this.scene.scene.get("game") as GameScene;
            this.levelUp()
            
            gameScene.skillSystem.pauseAll()

            this.scene.scene.pause("game")
            this.scene.scene.launch("level-up", { player: this, skillSystem: gameScene.skillSystem})

            break
        }
    }

    levelUp() {
        this.exp -= this.expToNextLevel
        this.level++
        this.expToNextLevel = Math.round(10 + 4.8 * (this.level - 1))
        //Old Formula:
        //this.expToNextLevel += 8 + this.level * 4 
    }
    
    die() {
        this.setVelocity(0, 0),
        this.anims.stop()

        const gameScene = this.scene.scene.get("game") as any
        const bossManager = gameScene.bossManager
        const level = gameScene.level || "cave-texture"

        const score = bossManager.globalTimerSeconds + bossManager.bossesKilled * 60

        this.scene.scene.pause("game")
        this.scene.scene.launch("game-over", { 
            score,
            bossesKilled: bossManager.bossesKilled,
            bossKills: bossManager.bossKillsThisRun,
            level,
            characterKey: gameScene.selectedCharacter,
            startingSkill: gameScene.selectedSkillKey,
        })
    }
}
