import Phaser from "phaser";

export default class UnlockablesScene extends Phaser.Scene {
    constructor() {
        super("unlocks");
    }

    create() {
        const width = this.scale.width;
        const centerX = width/2;

        this.add.text(centerX, 50, "Unlockables", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

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