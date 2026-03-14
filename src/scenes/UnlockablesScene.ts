import Phaser from "phaser";

export default class UnlockablesScene extends Phaser.Scene {
    constructor() {
        super("unlocks");
    }

    create() {

        //Back button
        const backButtonBg = this.add.rectangle(400, 600, 220, 60, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(400, 600, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }
}