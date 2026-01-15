// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"
import HealthBar from "../ui/HealthBar"
import Boss from "../entities/Boss"
import CircleTelegraph from "../entities/CircleTelegraph"

export default class GameScene extends Phaser.Scene {
    player!: Player
    healthBar!: HealthBar
    boss!: Boss
    bossHealthBar!: HealthBar
    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key
    num5Key!: Phaser.Input.Keyboard.Key
    attackReadyIcon!: Phaser.GameObjects.Text
    attackOnCooldown: boolean = false
    attackCooldownTime: number = 3

    spawnCircleTelegraphOnPlayer() {
        const t = new CircleTelegraph(
            this,
            this.player.x,
            this.player.y,
            80
        )

        //Attack after delay
        this.time.delayedCall(1200, () => {
            this.resolveAttack(t)
        })
    }

    resolveAttack(t: CircleTelegraph) {
        const dx = this.player.x - t.x
        const dy = this.player.y - t.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < t.radius) {
            this.player.takeDamage(20)
            console.log("Player HIT!")
        } else {
            console.log("Player DODGED!")
        }

        t.destroy()
    }

    constructor() {
        super("game")
    }

    create() {
        // Player Info
        this.player = new Player(this, 400, 550)
        this.healthBar = new HealthBar(this, 300, 20, 200, 20, this.player, 0x00ff00)

        // Boss Info
        this.boss = new Boss(this, 400, 350)
        this.bossHealthBar = new HealthBar(this, 300, 40, 200, 20, this.boss, 0xff0000)

        // Inputs
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.num5Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE)
        this.attackOnCooldown = false
        this.attackReadyIcon = this.add.text(400, 625, "!", {
            font: "32px Arial",
            color: "#00FF00"
        })

        this.input.keyboard!.on("keydown-SPACE", () => {
            this.spawnCircleTelegraphOnPlayer()
        })

        // Optional: add some text
        this.add.text(10, 10, "Use WASD to move", {
        font: "16px Arial",
        color: "#ffffff",
        })
    }

    update() {
        this.healthBar.draw()
        this.bossHealthBar.draw()

        const dir = new Phaser.Math.Vector2(0, 0)

        if (this.aKey.isDown) dir.x -= 1 // A → left
        if (this.dKey.isDown) dir.x += 1 // D → right
        if (this.wKey.isDown) dir.y -= 1 // W → up
        if (this.sKey.isDown) dir.y += 1 // S → down

        dir.normalize()
        this.player.move(dir)

        //Player Attack
        if (Phaser.Input.Keyboard.JustDown(this.num5Key) && !this.attackOnCooldown) {
            this.boss.takeDamage(50)
            this.attackOnCooldown = true
            let countdown = this.attackCooldownTime

            this.attackReadyIcon.setText((countdown.toString()))
            this.attackReadyIcon.setColor("#888888")

            this.time.addEvent({
                delay: 1000,
                repeat: this.attackCooldownTime - 1,
                callback: () => {
                    countdown--
                    if (countdown > 0) {
                        this.attackReadyIcon.setText(countdown.toString())
                    } else {
                        this.attackReadyIcon.setText("!")
                        this.attackReadyIcon.setColor("#00ff00")
                        this.attackOnCooldown = false
                    }
                }
            })
        }
    }
}
