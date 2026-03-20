import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super("credits");
    }

    create() {
        const width = this.scale.width;
        const centerX = width/2;

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
    }
}