import Phaser from "phaser";

export default class PassiveIcon {
    scene: Phaser.Scene
    icon: Phaser.GameObjects.Image
    levelText: Phaser.GameObjects.Text
    readyBorder: Phaser.GameObjects.Image
    size: number

    passive: any

    constructor(
        scene: Phaser.Scene,
        passive: any,
        x: number,
        y: number,
        iconKey: string,
        size = 56
    ) {
        this.scene = scene
        this.passive = passive
        this.size = size

        this.icon = scene.add.image(x, y - size / 2, iconKey)
        this.icon.setDisplaySize(size, size)

        this.readyBorder = scene.add.image(x, y - size / 2, "ready-border");
        this.readyBorder.setDisplaySize(size + 2, size + 2); // slightly bigger than icon
        this.readyBorder.setDepth(4);

        this.levelText = scene.add.text(
            x + size / 4,
            y - size / 4,
            `${passive.level}`,
            {
                fontSize: "24px",
                fontStyle: "bold",
                color: "#ffd700",
                stroke: "#000000",
                strokeThickness: 3,
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