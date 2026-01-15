import Phaser from "phaser"

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    maxHealth = 500
    health = 500
    speed = 0

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "")

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setSize(128, 128)
        this.setTint(0xff0000)
        this.setCollideWorldBounds(true)
    }

    takeDamage(amount: number) {
        this.health -= amount
        this.health = Math.max(this.health, 0)
        console.log(`Boss HP: ${this.health}`)
    }
}