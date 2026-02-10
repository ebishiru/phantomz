import Phaser from "phaser"

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    maxHealth = 150
    health = 150
    speed = 0
    hurtRadius = 80
    chaseDistance = 80
    isCasting = false
    bossName!: Phaser.GameObjects.Text
    hurtBoxGraphics!: Phaser.GameObjects.Graphics

    config: any

    constructor(scene: Phaser.Scene, x: number, y: number, config: any) {
        super(scene, x, y, config.spriteKey)
        this.config = config

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(3)
        this.body?.setSize(16, 16)
        this.body?.setOffset(0, 0)
        this.setCollideWorldBounds(true)
        this.play("boss-idle")

        this.speed = config.speed
        this.hurtRadius = config.hurtRadius

        this.bossName = this.scene.add.text(150, 10, config.name, {
            font: "16px Roboto",
            color: "#ffffff",
        })

        this.hurtBoxGraphics = scene.add.graphics()
    }

    drawHurtBox() {
        if (!this.hurtBoxGraphics) return

        this.hurtBoxGraphics.clear()

        this.hurtBoxGraphics.fillStyle(0xAAAAAAa, 0.2)
        this.hurtBoxGraphics.fillCircle(this.x, this.y, this.hurtRadius)
        this.hurtBoxGraphics.lineStyle(2, 0xAAAAAA, 0.4)
        this.hurtBoxGraphics.strokeCircle(this.x, this.y, this.hurtRadius)
    }

    update(player: Phaser.GameObjects.Sprite) {
        this.drawHurtBox()

        if (!this.body) return

        const body = this.body as Phaser.Physics.Arcade.Body

        if (this.isCasting || this.speed <= 0 || this.health <= 0) {
            body.setVelocity(0, 0)
            return
        }

        const dist = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            player.x,
            player.y,
        )

        if (dist > this.chaseDistance) {
            this.scene.physics.moveToObject(this, player, this.speed)
        } else {
            body.setVelocity(0, 0)
        }
    }

    takeDamage(amount: number) {
        this.health = Math.max(this.health - amount, 0)

        if (amount >= 0) {
            this.setTint(0xff0000)
        } else {
            this.setTint(0x00ff00)
        }

        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })
    }

    destroyBoss() {
        if (this.hurtBoxGraphics) {
            this.hurtBoxGraphics.destroy()
        }
        if (this.bossName) {
            this.bossName.destroy()
        }
        this.destroy()
    }
}