import Phaser from "phaser";
import Player from "../entities/Player";

export default class ExpBar {
    scene: Phaser.Scene
    bar: Phaser.GameObjects.Graphics
    x: number
    y: number
    width: number
    height: number
    player: Player

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        player: Player,
    ) {
        this.scene = scene
        this.player = player
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        
        this.bar = scene.add.graphics()

        this.draw()
    }

    draw() {
        this.bar.clear()

        this.bar.fillStyle(0x222222, 0.6)
        this.bar.fillRect(this.x, this.y, this.width, this.height)

        const progress = Phaser.Math.Clamp(this.player.exp / this.player.expToNextLevel, 0, 1)

        this.bar.fillStyle(0xFFD700, 1)
        this.bar.fillRect(this.x, this.y, this.width * progress, this.height)
    }

    destroy() {
        this.bar.destroy()
    }
}