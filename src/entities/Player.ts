import Phaser from "phaser"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 200

    constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "")

    // Add to scene and enable physics
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Make it a visible square
    this.setSize(32, 32)
    this.setTint(0x00ff00)
    this.setCollideWorldBounds(true)
    }

    move(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.speed, dir.y * this.speed)
    }
}
