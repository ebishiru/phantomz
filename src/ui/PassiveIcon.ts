import Phaser from "phaser";

export default class PassiveIcon {
    scene: Phaser.Scene
    icon: Phaser.GameObjects.Image
    levelText: Phaser.GameObjects.Text
    readyBorder: Phaser.GameObjects.Image

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

        this.readyBorder = scene.add.image(x, y, "ready-border");
        this.readyBorder.setDisplaySize(36, 36); // slightly bigger than icon
        this.readyBorder.setDepth(4);

        this.levelText = scene.add.text(
            x + 12,
            y + 12,
            `${passive.level}`,
            {
                fontSize: "12px",
                color: "#ffd700"
            }
        ).setOrigin(0.5)
    }

    update() {
        this.levelText.setText(`${this.passive.level}`)
    }

    destroy() {
        this.icon.destroy()
        this.levelText.destroy()
        this.readyBorder.destroy()
    }
}