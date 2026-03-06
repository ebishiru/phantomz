import Phaser from "phaser";

export default class PassiveIcon {
    scene: Phaser.Scene
    icon: Phaser.GameObjects.Image
    levelText: Phaser.GameObjects.Text

    passive: any

    constructor(
        scene: Phaser.Scene,
        passive: any,
        x: number,
        y: number,
        iconKey: string
    ) {
        this.scene = scene
        this.passive = passive

        this.icon = scene.add.image(x, y, iconKey)
        this.icon.setDisplaySize(32, 32)

        this.levelText = scene.add.text(
            x + 10,
            y + 8,
            `${passive.level}`,
            {
                fontSize: "12px",
                color: "#ffffff"
            }
        ).setOrigin(0.5)
    }

    update() {
        this.levelText.setText(`${this.passive.level}`)
    }

    destroy() {
        this.icon.destroy()
        this.levelText.destroy()
    }
}