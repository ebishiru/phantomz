import Phaser from "phaser";

export default class DonutTelegraph {
    graphics: Phaser.GameObjects.Graphics
    x: number
    y: number
    innerRadius: number
    outerRadius: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        innerRadius: number,
        outerRadius: number,
    ) {
        this.x = x,
        this.y = y,
        this.innerRadius = innerRadius,
        this.outerRadius = outerRadius

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        this.graphics.clear()

        this.graphics.fillStyle(0xff0000, 0.25)
        this.graphics.beginPath()
        this.graphics.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2)
        this.graphics.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2)
        this.graphics.closePath()
        this.graphics.fillPath()

        this.graphics.lineStyle(2, 0xff0000, 1)
        this.graphics.strokeCircle(this.x, this.y, this.outerRadius)
        this.graphics.strokeCircle(this.x, this.y, this.innerRadius)
    }

    destroy() {
        this.graphics.destroy()
    }
}