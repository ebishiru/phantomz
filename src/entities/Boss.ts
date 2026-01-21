import Phaser from "phaser"

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    maxHealth = 100
    health = 100
    speed = 0
    bossName!: Phaser.GameObjects.Text
    hurtRadius = 80
    hurtBoxGraphics!: Phaser.GameObjects.Graphics

    constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
        super(scene, x, y, "")

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setSize(96, 96)
        this.setTint(0xff0000)
        this.setCollideWorldBounds(true)

        this.bossName = this.scene.add.text(150, 10, name, {
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
        this.health -= amount
        this.health = Math.max(this.health, 0)
        console.log(`Boss HP: ${this.health}`)
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