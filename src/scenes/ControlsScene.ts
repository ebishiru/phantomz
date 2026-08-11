import Phaser from "phaser"
import { OptionsButton } from "../ui/OptionsButton";

export default class ControlScene extends Phaser.Scene {
    constructor() {
        super("controls");
    }

    create() {
        const width = this.scale.width;
        const centerX = width/2;

        //Options Button
        OptionsButton(this)

        //Controls Title
        this.add.text(centerX, 50, "Controls", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Controls Text
        this.add.text(centerX, 100,
            "Movement: Arrow Keys / Joystick\n" +
            "Skills: Keys 1-4 / Face Buttons\n",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
            }
        ).setOrigin(0.5, 0)

        //How to Play Title
        this.add.text(centerX, 200, "How to Play", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5, 0)

        //How to play text
        this.add.text(centerX, 250,
            "Use skills to damage bosses. Each skill has its own cooldown. \n" +
            "Avoid red telegraphs with the help of the mechanics' names. \n" +
            "Acquire new skills or passives whenever you level up. \n" +
            "New bosses are added every minute, with 10 unique bosses each stage. \n" +
            "Score is based on kills and survival time. Have fun!!\n",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
                align: "center",
            }
        ).setOrigin(0.5, 0)

        const backButtonBg = this.add.rectangle(centerX, 475, 220, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(centerX, 475, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }
}