import Phaser from "phaser"
import Player from "./Player"

export default class LineTelegraph {
    graphics: Phaser.GameObjects.Graphics
    destroyed = false
    x: number
    y: number
    angle: number
    length: number
    width: number

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        angle: number, 
        length: number,
        width: number
    ) {
        this.x = x
        this.y = y
        this.angle = angle
        this.length = length
        this.width = width

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        if (this.destroyed) return

        this.graphics.clear()
        this.graphics.lineStyle(this.width, 0xff0000, 0.25)

        const endX = this.x + Math.cos(this.angle) * this.length
        const endY = this.y + Math.sin(this.angle) * this.length

        this.graphics.beginPath()
        this.graphics.moveTo(this.x, this.y)
        this.graphics.lineTo(endX, endY)
        this.graphics.strokePath()
    }

    destroy() {
        this.graphics.destroy()
    }
}