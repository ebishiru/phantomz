import Phaser from "phaser"

export default class HealthBar {
    scene: Phaser.Scene
    bar: Phaser.GameObjects.Graphics
    x: number
    y: number
    width: number
    height: number
    player: any
    color: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        player: any,
        color: number
    ) {
        this.scene = scene
        this.player = player
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color

        this.bar = scene.add.graphics()
        this.draw()
    }

    draw() {
        this.bar.clear()

        this.bar.fillStyle(0x000000, 0.6)
        this.bar.fillRect(this.x, this.y, this.width, this.height)

        const healthPercent = this.player.health / this.player.maxHealth

        this.bar.fillStyle(this.color, 1)
        this.bar.fillRect(this.x, this.y, this.width * healthPercent, this.height)
    }
} 