import Phaser from "phaser";

export default class LevellingScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("level-up")
    }

    create() {
        const { width, height } = this.scale

        //Dim Background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.35)
        .setOrigin(0)

        //Menu Box
        this.add.rectangle(width/2, height/2, 350, 440, 0x1e1e1e)
        .setStrokeStyle(2, 0xffffff)

        this.add.text(width/2, height/2 - 180, "LEVEL UP", {
            fontSize: "24px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.5)

        const confirm = this.add.text(width/2, height/2 + 180, "OK", {
            fontSize: "18px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: {x: 16, y: 8}
        }).setOrigin(0.5)

        const confirmLevelUp = () => {
            this.scene.stop()
            this.scene.resume("game")
        }

        this.enterKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        this.enterKey.on("down", confirmLevelUp)
    }
}