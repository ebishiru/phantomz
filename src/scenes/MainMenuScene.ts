import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainmenu")
    }

    create() {

        const { width, height } = this.scale;

        const options = [
            { text: "Play", scene: "gamesetup"},
            { text: "Controls", scene: "controls"},
            { text: "Unlockables", scene: "unlocks"},
            { text: "Credits", scene: "credits"},    
        ]

        const buttonWidth = 200
        const buttonHeight = 50

        options.forEach((option, index) => {

            const y = height/2 + index * 80

            const bg = this.add.rectangle(width/2, y, buttonWidth, buttonHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setInteractive({ useHandCursor: true})

            this.add.text(width/2, y, option.text, {
                fontSize: "24px",
                color: "#ffffff"
            }).setOrigin(0.5)
            
            bg.on("pointerdown", () => {
                this.scene.start(option.scene)
            })
        })
    }
}