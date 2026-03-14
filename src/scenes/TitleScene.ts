import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";

export default class TitleScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("title")
    }

    create() {
        //Title Music
        playMusic(this, "titleMusic")

        //Main Title
        this.add.text(400, 200, `The Last  \n   Phantom Z`, {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Menu Text
        const startText =this.add.text(400, 500, "CLICK TO START", {
            fontSize: "24px",
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