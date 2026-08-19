import Phaser from "phaser";

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super("leaderboard")
    }

    create() {
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const width = this.scale.width
        const centerX = width/2

        this.add.text(width/2, 50, "Hall of Fame", {
            fontSize: "32px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00"
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