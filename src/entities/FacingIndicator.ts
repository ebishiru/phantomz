import Phaser from "phaser";
import Player from "./Player";

export default class FacingIndicator {
    graphics: Phaser.GameObjects.Graphics
    player: Player
    x: number = 0
    y: number = 0
    angle: number = 0
    distance = 25
    size = 8
    color = 0xeffae6

    constructor(
        scene: Phaser.Scene,
        player: Player,
    ) {
        this.player = player

        this.graphics = scene.add.graphics()
        this.graphics.setDepth(20)
        this.graphics.setAlpha(0.5)

        this.update()
    }

    update() {
        const dir = this.player.facing.clone().normalize()
        this.angle = Math.atan2(dir.y, dir.x)
        this.x = this.player.x + Math.cos(this.angle) * (this.player.hurtboxRadius + this.distance)
        this.y = this.player.y + Math.sin(this.angle) * (this.player.hurtboxRadius + this.distance)

        this.draw()
    }

    draw() {
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