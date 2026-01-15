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
        const dx = player.x - this.x
        const dy = player.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.radius) {
            player.takeDamage(20)
        } 

        this.destroy()
    }

    destroy() {
        this.graphics.destroy()
    }
}