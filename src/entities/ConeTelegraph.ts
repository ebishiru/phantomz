import Phaser from "phaser";

export default class ConeTelegraph {
    graphics: Phaser.GameObjects.Graphics
    destroyed = false
    x: number
    y: number
    angle: number
    radius: number
    coneAngle: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        angle: number,
        radius: number,
        coneAngle: number,
    ) {
        this.x = x,
        this.y = y,
        this.angle = angle
        this.radius = radius
        this.coneAngle = coneAngle

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        if (this.destroyed) return
        
        this.graphics.clear()

        this.graphics.fillStyle(0xff0000, 0.25)
        this.graphics.beginPath()

        const startAngle = this.angle - this.coneAngle / 2
        const endAngle = this.angle + this.coneAngle / 2

        this.graphics.slice(
            this.x,
            this.y,
            this.radius,
            startAngle,
            endAngle
        )

        this.graphics.lineTo(this.x, this.y)
        this.graphics.closePath()
        this.graphics.fillPath()

        this.graphics.lineStyle(2, 0xff0000, 0.6)
        this.graphics.strokePath()
    }

    setAngle(angle: number) {
        this.angle = angle
        this.draw()
    }

    destroy() {
        this.graphics.destroy()
    }
}