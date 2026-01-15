import Phaser from "phaser"
import Player from "./Player"

export default class LineTelegraph extends Phaser.GameObjects.Graphics {
    startX: number
    startY: number
    angle: number
    length: number
    width: number

    constructor(
        scene: Phaser.Scene,
        startX: number,
        startY: number,
        angle: number,
        length: number,
        width: number
    ) {
        super(scene)
        this.startX = startX
        this.startY = startY
        this.angle = angle
        this.length = length
        this.width = width

        scene.add.existing(this)
        this.draw()
    }

    draw() {
        this.clear()
        this.lineStyle(this.width, 0xff0000, 0.6)

        const endX = this.startX + Math.cos(this.angle) * this.length
        const endY = this.startY + Math.sin(this.angle) * this.length

        this.beginPath()
        this.moveTo(this.startX, this.startY)
        this.lineTo(endX, endY)
        this.strokePath()
    }

    resolveAttack(player: Player) {
        const hit = Phaser.Geom.Intersects.LineToCircle(
            new Phaser.Geom.Line(
                this.startX,
                this.startY,
                this.startX + Math.cos(this.angle) * this.length,
                this.startY + Math.sin(this.angle) * this.length
            ),
            new Phaser.Geom.Circle(player.x, player.y, 16)
        )

        if (hit) {
            player.takeDamage(20)
            console.log("Player HIT by line!")
        } else {
            console.log("Player DODGED line!")
        }

        this.destroy()
    }
}