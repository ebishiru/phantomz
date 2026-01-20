import Phaser from "phaser"

export default class HealthBar {
    scene: Phaser.Scene
    bar: Phaser.GameObjects.Graphics
    text!: Phaser.GameObjects.Text
    x: number
    y: number
    width: number
    height: number
    entity: any
    color: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        entity: any,
        color: number
    ) {
        this.scene = scene
        this.entity = entity
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color

        this.bar = scene.add.graphics()

        this.text = scene.add.text(
            x + width / 2,
            y + height / 2,
            `${this.entity.health} / ${this.entity.maxHealth}`,
            {
                font: "14px Arial",
                color: "#ffffff"
            }
        ).setOrigin(0.5, 0.5)

        this.draw()
    }

    draw() {
        if (!this.bar || !this.entity) return
        if (this.entity.health <= 0) return
        this.bar.clear()

        this.bar.fillStyle(0x000000, 0.6)
        this.bar.fillRect(this.x, this.y, this.width, this.height)

        const healthPercent = this.entity.health / this.entity.maxHealth

        this.bar.fillStyle(this.color, 0.7)
        this.bar.fillRect(this.x, this.y, this.width * healthPercent, this.height)

        this.text.setText(`${this.entity.health} / ${this.entity.maxHealth}`)
    }

    destroy() {
        this.bar.destroy()
        this.text.destroy()
    }
} 