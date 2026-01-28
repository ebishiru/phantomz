import Phaser from "phaser"

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    maxHealth = 100
    health = 100
    speed = 0
    hurtRadius = 80
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
        this.hurtBoxGraphics.fillStyle(0xAAAAAAa, 0.2)
        this.hurtBoxGraphics.fillCircle(this.x, this.y, this.hurtRadius)
        this.hurtBoxGraphics.lineStyle(2, 0xAAAAAA, 0.4)
        this.hurtBoxGraphics.strokeCircle(this.x, this.y, this.hurtRadius)
    }

    takeDamage(amount: number) {
        this.health = Math.max(this.health - amount, 0)
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