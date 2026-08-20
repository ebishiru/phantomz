import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import { setupEscapeMenu } from "../systems/setupEscapeMenu";
import { OptionsButton } from "../ui/OptionsButton";
import { LeaderboardButton } from "../ui/LeaderboardButton";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("mainmenu")
    }

    create() {
        if (this.registry.get("rerollCharges") === undefined) {
            this.registry.set("rerollCharges", 3)
        }

        //Title Music
        playMusic(this, "titleMusic")
        
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        //Options Button
        setupEscapeMenu(this)
        OptionsButton(this)
        
        //Leaderboard Button
        LeaderboardButton(this)
        
        const { width, height } = this.scale;

        //Title Text
        this.add.text(width/3 - 10, 150, `The Last  \n   Phantom Z`, {
            fontSize: "60px",
            fontFamily: `Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Add Main Menu Art
        this.anims.create({
            key: "menu-idle",
            frames: this.anims.generateFrameNumbers("main-menu-art", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.add.sprite(width/3 - 10, 325, "main-menu-art")
        .setScale(5)
        .setOrigin(0.5)
        .play("menu-idle")

        //Main Menu buttons
        const options = [
            { text: "PLAY", scene: "levelselect"},
            { text: "CONTROLS", scene: "controls"},
            { text: "UNLOCKABLES", scene: "unlocks"},
            { text: "CREDITS", scene: "credits"},    
        ]

        const buttonWidth = 260
        const buttonHeight = 70

        options.forEach((option, index) => {

            const y = height/4 + index * 100

            const bg = this.add.rectangle(width * 2 / 3 + 50, y, buttonWidth, buttonHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setInteractive({ useHandCursor: true})

            this.add.text(width * 2 / 3 + 50, y, option.text, {
                fontSize: "24px",
                fontFamily: `Georgia, serif`,
                color: "#ffffff"
            }).setOrigin(0.5)
            
            bg.on("pointerdown", () => {
                this.scene.start(option.scene)
            })
        })

        const refreshButtonWidth = 260
        const refreshButtonHeight = 80
        const refreshButtonX = 150
        const refreshButtonY = 480
        const refreshButton = this.add.rectangle(refreshButtonX, refreshButtonY, refreshButtonWidth, refreshButtonHeight, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setInteractive({ useHandCursor: true })

        this.add.text(refreshButtonX, refreshButtonY - 20, "GET REROLLS", {
            fontSize: "18px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.5)

        this.add.text(refreshButtonX, refreshButtonY + 3, "Watch Ads", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.5)

        const refreshChargesText = this.add.text(refreshButtonX, refreshButtonY + 21, "", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#65aed6"
        }).setOrigin(0.5)

        const updateRefreshUI = () => {
            const charges = this.registry.get("rerollCharges") ?? 3
            refreshChargesText.setText(`Charges: ${charges}/3`)
        }

        updateRefreshUI()

        refreshButton.on("pointerdown", () => {
            this.registry.set("rerollCharges", 3)
            updateRefreshUI()
        })
    }
}