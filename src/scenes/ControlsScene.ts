import Phaser from "phaser"

export default class ControlScene extends Phaser.Scene {
    constructor() {
        super("controls");
    }

    create() {
        
        //Controls Title
        this.add.text(400, 100, "Controls", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Controls Text
        this.add.text(400, 210,
            "Movement: Arrow Keys / WASD / Joystick\n" +
            "Skill 1: Q / Green \n" +
            "Skill 2: E / Blue \n" +
            "Skill 3: R / Red \n" +
            "Skill 4: F / Yellow \n",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
            }
        ).setOrigin(0.5)

        //How to Play Title
        this.add.text(400, 340, "How to Play", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //How to play text
        this.add.text(400, 440,
            "Kill enemies to get or level up skills. \n" +
            "Grey circle around boss is its hurtbox. \n" +
            "New bosses are added every minute. \n" +
            "Score is based on kills and survival time. \n" +
            "Have fun!",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
                align: "center",
            }
        ).setOrigin(0.5)

        const backButtonBg = this.add.rectangle(400, 600, 220, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("title"))

        this.add.text(400, 600, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }
}