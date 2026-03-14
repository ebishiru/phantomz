import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("title")
    }

    create() {
        const { width, height } = this.scale;

        //Menu Text
        const startText = this.add.text(width/2, height/2, "CLICK TO START", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: `#ffffff`,
        }).setOrigin(0.5)

        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
        })

        this.input.once("pointerdown", () => {
            this.scene.start("mainmenu")
        })

        this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        this.enterKey.once("down", () => {
            this.scene.start("mainmenu")
        })
    }
}