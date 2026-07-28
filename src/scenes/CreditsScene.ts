import Phaser from "phaser";
import SaveManager from "../systems/SaveManager";

export default class CreditsScene extends Phaser.Scene {
    saveManager!: SaveManager;

    constructor() {
        super("credits");
    }

    create() {
        this.saveManager = new SaveManager();

        const width = this.scale.width;
        const centerX = width/2;

        this.add.text(centerX, 50, "Credits", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        this.add.text(centerX, 150,
            "Game Design and Programming: \n" +
            "Kevin Lo\n\n" +
            "Art: \n" +
            "Kevin Lo\n\n" +
            "Music: \n" +
            "xDeviruchi\n\n",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
                align: "center",
            }
        ).setOrigin(0.5, 0)

        //Back button
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

        //Save Reset Button
        const resetButtonBg = this.add.rectangle(100, 70, 160, 50, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        resetButtonBg.on("pointerdown", () => {
            this.resetSaveData();
        })

        this.add.text(100, 70, "RESET SAVE", {
            fontSize: "20px",
            fontFamily: `Georgia, serif`,
            color: "#ff0000",
        }).setOrigin(0.5)
    }

    resetSaveData() {
            this.saveManager.reset()
            this.scene.start("mainmenu");
    }
}