import Phaser from "phaser";
import { setupEscapeMenu } from "../systems/setupEscapeMenu";
import { OptionsButton } from "../ui/OptionsButton";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainmenu")
    }

    create() {

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        //Options Button
        setupEscapeMenu(this)
        OptionsButton(this)

        const { width, height } = this.scale;

        const options = [
            { text: "PLAY", scene: "gamesetup"},
            { text: "CONTROLS", scene: "controls"},
            { text: "UNLOCKABLES", scene: "unlocks"},
            { text: "CREDITS", scene: "credits"},    
        ]

        const buttonWidth = 260
        const buttonHeight = 70

        options.forEach((option, index) => {

            const y = height/2 + index * 80

            const bg = this.add.rectangle(width/2, y, buttonWidth, buttonHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setInteractive({ useHandCursor: true})

            this.add.text(width/2, y, option.text, {
                fontSize: "24px",
                fontFamily: `Georgia, serif`,
                color: "#ffffff"
            }).setOrigin(0.5)
            
            bg.on("pointerdown", () => {
                this.scene.start(option.scene)
            })
        })
    }
}