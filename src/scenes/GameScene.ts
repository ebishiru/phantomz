// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"
import HealthBar from "../ui/HealthBar"
import ExpBar from "../ui/ExpBar"
import BossManager from "../managers/BossManager"
import SkillCooldown from "../ui/SkillCooldown"
import ExpOrb from "../entities/ExpOrb"

export default class GameScene extends Phaser.Scene {
    player!: Player
    healthBar!: HealthBar
    expBar!: ExpBar
    bossManager!: BossManager

    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    num4Key!: Phaser.Input.Keyboard.Key
    num8Key!: Phaser.Input.Keyboard.Key
    num6Key!: Phaser.Input.Keyboard.Key

    skillCooldownUIs!: SkillCooldown[]

    expOrbs!: ExpOrb[]

    constructor() {
        super("game")
    }

    preload() {
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("boss", "assets/boss1.png", {
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        // World Bounds
        this.physics.world.setBounds(25, 70, 750, 550)

        //Player animation
        if (!this.anims.exists("player-idle")) {
            this.anims.create({
                key: "player-idle",
                frames: this.anims.generateFrameNumbers("player", {
                    start: 0,
                    end: 1
                }),
                frameRate: 3,
                repeat: -1
            })
        }

        // Player Info
        this.player = new Player(this, 400, 550, "player", null)
        this.healthBar = new HealthBar(this, 300, 650, 200, 20, this.player, 0x006400)
        this.expBar = new ExpBar(this, 0, 685, 800, 15, this.player)

        //Boss animation
        this.anims.create({
            key: "boss-idle",
            frames: [{ key: "boss", frame: 0}],
            frameRate: 1,
            repeat: -1
        })

        this.anims.create({
            key: "boss-attack",
            frames: [{ key: "boss", frame: 1}],
            frameRate: 1,
            repeat: 0
        })

        //Boss Info
        this.bossManager = new BossManager(this, this.player)
        this.bossManager.spawnBoss()

        // Inputs
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        //Slash Skill
        this.num4Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)
        //Arrow Skill
        this.num8Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT)
        //Pulse Skill
        this.num6Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX)

        this.skillCooldownUIs = [
            new SkillCooldown(this, this.player.slashSkill, 550, 670),
            new SkillCooldown(this, this.player.arrowSkill, 600, 670),
            new SkillCooldown(this, this.player.pulseSkill, 650, 670),
        ]

        //Exp
        this.expOrbs = []
    }

    spawnExp(x: number, y: number) {
        const orbCount = 15
        const minRadius = 80
        const maxRadius = 120

        for (let i = 0; i < orbCount; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
            const distance = Phaser.Math.FloatBetween(minRadius, maxRadius)

            const spawnX = x + Math.cos(angle) * distance
            const spawnY = y + Math.sin(angle) * distance

            const orb = new ExpOrb(
                this,
                spawnX,
                spawnY,
                1
            )

            orb.setScale(0)

            this.tweens.add({
                targets: orb,
                x: spawnX,
                y: spawnY,
                scale: 0.5,
                duration: 800,
                ease: "Back.Out"
            })

            this.expOrbs.push(orb)
        }
    }

    update() {
        this.healthBar.draw()
        this.expBar.draw()
        if (this.bossManager.boss && this.bossManager.bossHealthBar) {
            this.bossManager.bossHealthBar.draw()
        }

        //Player Movement and Skills
        const dir = new Phaser.Math.Vector2(0, 0)
        if (this.aKey.isDown) dir.x -= 1 // A → left
        if (this.dKey.isDown) dir.x += 1 // D → right
        if (this.wKey.isDown) dir.y -= 1 // W → up
        if (this.sKey.isDown) dir.y += 1 // S → down
        dir.normalize()
        this.player.move(dir)

        this.player.update(this.time.now)

        this.skillCooldownUIs.forEach( ui => {
            ui.update(this.time.now)
        })

        //Boss Respawn
        if (this.bossManager.boss && this.bossManager.boss.health <= 0) {
            this.bossManager.spawnBoss()
        }

        //Exp
        this.expOrbs.forEach((orb, index) => {
            if (!orb.active) return

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                orb.x,
                orb.y,
            )

            if (distance < 20) {
                this.player.gainExp(orb.expValue)
                orb.destroy()
                this.expOrbs.splice(index, 1)
            }
        })

        this.expOrbs.forEach((orb) => {
            orb.update(this.player, this.time.now)
        })
    }
}
