import Phaser from "phaser"
import Player from "./Player"

export default class CircleTelegraph {
    graphics: Phaser.GameObjects.Graphics
    destroyed = false
    x: number
    y: number
    radius: number

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        this.x = x
        this.y = y
        this.radius = radius

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        if (this.destroyed) return

        this.graphics.clear()
        this.graphics.lineStyle(2, 0xff0000, 1)
        this.graphics.strokeCircle(this.x, this.y, this.radius)
        this.graphics.fillStyle(0xff0000, 0.25)
        this.graphics.fillCircle(this.x, this.y, this.radius)
    }

    destroy() {
        this.graphics.destroy()
    }
}