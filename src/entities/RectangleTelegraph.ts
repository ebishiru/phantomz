import Phaser from "phaser";

export default class RectangleTelegraph {
    graphics: Phaser.GameObjects.Graphics
    destroyed = false
    x: number
    y: number
    width: number
    height: number

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        if (this.destroyed) return

        this.graphics.clear()
        this.graphics.lineStyle(2, 0xff0000, 1)
        this.graphics.strokeRect(this.x, this.y, this.width, this.height)
        this.graphics.fillStyle(0xff0000, 0.25)
        this.graphics.fillRect(this.x, this.y, this.width, this.height)
    }

    destroy() {
        this.graphics.destroy()
    }
}