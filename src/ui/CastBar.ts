import Phaser from "phaser";

export default class CastBar {
    scene: Phaser.Scene
    bg: Phaser.GameObjects.Rectangle
    fill: Phaser.GameObjects.Rectangle

    width = 100
    height = 8

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene

        this.bg = scene.add.rectangle( x, y, this.width, this.height, 0x000000, 0.6)
            .setOrigin(0.5)
            .setStrokeStyle(1, 0xffffff)
        this.fill = scene.add.rectangle( x - this.width / 2, y, 0, this.height, 0xff0000).setOrigin(0, 0.5)
    }

    start(duration: number) {
        this.fill.width = 0

        this.scene.tweens.add({
            targets: this.fill,
            width: this.width,
            duration,
            ease: "Linear"
        })
    }

    destroy() {
        this.bg.destroy()
        this.fill.destroy()
    }

    setPosition(x: number, y: number) {
        this.bg.setPosition(x, y)
        this.fill.setPosition(x - this.width / 2, y)
    }
}