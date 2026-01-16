import Phaser from "phaser"
import Player from "./Player"

export default class CircleTelegraph {
    graphics: Phaser.GameObjects.Graphics
    scene: Phaser.Scene
    x: number
    y: number
    radius: number

    constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
        this.scene = scene
        this.x = x
        this.y = y
        this.radius = radius

        this.graphics = scene.add.graphics()
        this.draw()
    }

    draw() {
        this.graphics.clear()
        this.graphics.lineStyle(2, 0xff0000, 1)
        this.graphics.strokeCircle(this.x, this.y, this.radius)
        this.graphics.fillStyle(0xff0000, 0.25)
        this.graphics.fillCircle(this.x, this.y, this.radius)
    }

    resolveAttack(player: Player) {
        const attackCircle = new Phaser.Geom.Circle(
            this.x,
            this.y,
            this.radius
        )
        const playerCircle = new Phaser.Geom.Circle(
            player.x,
            player.y,
            16
        )

        const hit = Phaser.Geom.Intersects.CircleToCircle(
            attackCircle,
            playerCircle
        )

        if (hit) {
            player.takeDamage(20)
        } 

        this.destroy()
    }

    destroy() {
        this.graphics.destroy()
    }
}