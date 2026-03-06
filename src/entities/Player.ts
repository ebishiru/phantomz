import Phaser from "phaser"
import GameScene from "../scenes/GameScene"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 300
    maxHealth = 100
    health = 100
    exp = 0
    level = 1
    expToNextLevel = 10
    hurtboxRadius = 4

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
    }

    skills: any[] = []
    passives: { key: string, level: number }[] = []

    facing!: Phaser.Math.Vector2

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

        //Idle animation
        this.anims.play(`${this.texture.key}-idle`, true)
    }

    takeDamage(amount: number) {
        //Passive
        amount -= this.statModifiers.damageReductionFlat
        amount = Math.max(1, amount)

        this.health -= amount
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth)

        this.setTint(0xff0000)

        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })

        if (this.health <= 0) {
            this.die()
        }
    }

    heal(amount: number) {
        if (this.health >= this.maxHealth) return

        this.health += amount
        this.health = Math.min(this.health, this.maxHealth)

        this.setTint(0x00ff00)

        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })
    }

    move(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.speed, dir.y * this.speed)

        if(dir.lengthSq() > 0) {
            this.facing.copy(dir).normalize()
        }
    }

    update() {
        //empty
    }

    gainExp(amount: number) {
        this.exp += amount

        if(this.exp >= this.expToNextLevel) {
            const gameScene = this.scene.scene.get("game") as GameScene;
            this.levelUp()
            
            gameScene.skillSystem.pauseAll(this.scene.time.now)

            this.scene.scene.pause("game")
            this.scene.scene.launch("level-up", { player: this, skillSystem: gameScene.skillSystem})
        }
    }

    levelUp() {
        this.exp -= this.expToNextLevel
        this.level++
        this.expToNextLevel += 8 + this.level * 4
    }
    
    die() {
        this.setVelocity(0, 0),
        this.anims.stop()

        const gameScene = this.scene.scene.get("game") as any
        const bossManager = gameScene.bossManager

        const score = bossManager.globalTimerSeconds + bossManager.bossesKilled * 60

        this.scene.scene.pause("game")
        this.scene.scene.launch("game-over", { score })
    }
}
