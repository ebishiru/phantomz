import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import { setupEscapeMenu } from "../systems/setupEscapeMenu";
import { OptionsButton } from "../ui/OptionsButton";
import { LeaderboardButton } from "../ui/LeaderboardButton";
import { SupportButton } from "../ui/SupportButton";
import AdManager from "../systems/AdManager";

export default class MainMenuScene extends Phaser.Scene {
    private showingRerollAd = false
    refreshChargesText!: Phaser.GameObjects.Text
    constructor() {
        super("mainmenu")
    }

    create() {
        if (this.registry.get("nextRunRerollCharges") === undefined) {
            this.registry.set("nextRunRerollCharges", 2)
        }

        //Title Music
        playMusic(this, "titleMusic")
        
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        //Options Button
        setupEscapeMenu(this)
        this.add.text(920, 68, "Options",
            {
                fontSize: "10px",
                fontFamily: "Georgia, serif",
                color: "#ffffff",
            }
        )
            .setOrigin(0.5)

        OptionsButton(this)

        //Leaderboard Button
        this.add.text(920, 150, "Hall of Fame",
            {
                fontSize: "10px",
                fontFamily: "Georgia, serif",
                color: "#ffffff",
            }
        )
            .setOrigin(0.5)
        
        LeaderboardButton(this)
        
        //Support Button
        this.add.text(920, 230, "Support Me",
            {
                fontSize: "10px",
                fontFamily: "Georgia, serif",
                color: "#ffffff",
            }
        )
            .setOrigin(0.5)

        SupportButton(this)

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

        //Reroll Button
        const refreshButtonWidth = 260
        const refreshButtonHeight = 80
        const refreshButtonX = 150
        const refreshButtonY = 480
        const refreshButton = this.add.rectangle(refreshButtonX, refreshButtonY, refreshButtonWidth, refreshButtonHeight, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setInteractive({ useHandCursor: true })

        this.add.text(refreshButtonX, refreshButtonY - 18, "DOUBLE REROLLS", {
            fontSize: "18px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.7, 0.5)

        this.add.text(refreshButtonX, refreshButtonY + 3, "Tap to Watch Ads", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.7, 0.5)

        this.refreshChargesText = this.add.text(refreshButtonX, refreshButtonY + 21, "", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#65aed6"
        }).setOrigin(0.7, 0.5)

        this.add.image(refreshButtonX + 85, refreshButtonY + 3, "reroll-icon")
        .setOrigin(0.5)
        .setScale(2.5)

        this.updateRefreshUI()

        refreshButton.on("pointerdown", () => {
            this.watchAdForReroll()
        })
    }

    updateRefreshUI()  {
        const charges = this.registry.get("nextRunRerollCharges") ?? 2
        this.refreshChargesText.setText(`Next Run: ${charges}/4 rerolls`)
    }

    async watchAdForReroll() {
        if (this.showingRerollAd) return
        
        this.showingRerollAd = true

        //Keep audio paused
        this.sound.pauseAll()

        try {
            const rewarded = await AdManager.showRerollAd()
            if (!rewarded) {
                //Ad failed
                this.sound.resumeAll()
                return
            }

            this.sound.resumeAll()
            this.registry.set("nextRunRerollCharges", 4)
            this.updateRefreshUI()
        } finally {
            this.showingRerollAd = false
        }
    }
}