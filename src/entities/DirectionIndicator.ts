import Phaser from "phaser";
import Boss from "./Boss";

export default class DirectionIndicator {
    graphics: Phaser.GameObjects.Graphics
    destroyed = false
    x: number
    y: number
    angle: number
    size: number
    color: number

    constructor(
        scene: Phaser.Scene,
        boss: Boss,
        angle: number,
        size = 10,
        color = 0xff0000,
    ) {
        this.x = boss.x + Math.cos(angle) * boss.hurtRadius
        this.y = boss.y + Math.sin(angle) * boss.hurtRadius
        this.angle = angle
        this.size = size
        this.color = color

        this.graphics = scene.add.graphics()
        this.graphics.setDepth(1000)
        this.draw()
    }

    draw() {
        if (this.destroyed) return

        this.graphics.clear()
        this.graphics.fillStyle(this.color, 1)

        const h = this.size * Math.sqrt(3)/2
        const halfBase = this.size / 2

        const points = [
            { x: h / 2, y: 0 },
            { x: -h / 2, y: -halfBase },
            { x: -h / 2, y: halfBase },
        ]

        const rotated = points.map(p => ({
            x: p.x * Math.cos(this.angle) - p.y * Math.sin(this.angle),
            y: p.x * Math.sin(this.angle) + p.y * Math.cos(this.angle),
        }))

        // Draw triangle
        const geomPoints = rotated.map(p => new Phaser.Geom.Point(p.x + this.x, p.y + this.y))
        this.graphics.fillPoints(geomPoints, true)
        this.graphics.lineStyle(2, this.color, 1)
        this.graphics.strokePoints(geomPoints, true)
    }

    destroy() {
        this.graphics.destroy()
    }
}