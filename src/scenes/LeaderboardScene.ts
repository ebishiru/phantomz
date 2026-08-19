import Phaser from "phaser";
import LeaderboardManager from "../systems/LeaderboardManager";
import type { LeaderboardLevel } from "../systems/LeaderboardManager";

export default class LeaderboardScene extends Phaser.Scene {
    private leaderboardManager!: LeaderboardManager
    private leaderboardContainer!: Phaser.GameObjects.Container

    levels: LeaderboardLevel[] = ["cave", "snow", "tower"]
    chosenLevelTab: LeaderboardLevel = "cave"
    levelOutline!: Phaser.GameObjects.Rectangle
    buttons: Phaser.GameObjects.Text[] = []
    
    constructor() {
        super("leaderboard")
    }

    create() {
        this.leaderboardManager = LeaderboardManager.getInstance();

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const width = this.scale.width
        const backButtonX = width*7/8

        this.add.text(width/2, 50, "Hall of Fame", {
            fontSize: "32px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00"
        }).setOrigin(0.5)

        //Level select tabs
        this.createTabs();

        //Leaderboard
        this.showLeaderboard(this.chosenLevelTab);

        //Back button
        const backButtonBg = this.add.rectangle(backButtonX, 475, 200, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(backButtonX, 475, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }

    createTabs() {
        const { width, height } = this.scale

        this.levels.forEach((key, index) => {
            const button = this.add.text(
                width* 8/9,
                height/4 + (75*index),
                `${key}`.toUpperCase(),
                {
                    fontSize: "20px",
                    fontFamily: "Georgia, serif",
                    color: "#ffffff"
                }
            )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true})

            button.on("pointerup", () => {
                this.chosenLevelTab = key
                this.moveTabOutline(button)
                this.showLeaderboard(key)
            })

            this.buttons.push(button)
        })

        this.levelOutline = this.add.rectangle(
            this.buttons[0].x,
            this.buttons[0].y,
            125,
            75,
        )
        .setStrokeStyle(4, 0xffcc00)
        .setDepth(20)
    }

    private showLeaderboard(level: LeaderboardLevel): void {

        //Remove previous leaderboard
        if (this.leaderboardContainer) {
            this.leaderboardContainer.destroy()
        }

        const { width, height } = this.scale
        const containerX = width/2 - 60
        const containerY = height/2 + 20
        const containerWidth = 600
        const containerHeight = 400

        this.leaderboardContainer = this.add.container(containerX, containerY);

        const entries = this.leaderboardManager.getLeaderboard(level);

        //Background
        const leaderboardBG = this.add.rectangle(
            0,
            0,
            containerWidth,
            containerHeight,
            0x111111,
            0.9
        )

        this.leaderboardContainer.add(leaderboardBG)

        const topY = -200
        const startY = topY + 40

        //Score
        if (entries.length === 0) {

            const emptyText = this.add.text(
                0,
                0,
                "No heroes have claimed this record yet.",
                {
                    fontSize: "20px",
                    fontFamily: "Georgia, serif",
                    color: "#ffffff"
                }
            ).setOrigin(0.5);

            this.leaderboardContainer.add(emptyText)
        }

        entries.forEach((entry, index) => {
            const rank = index + 1

            const text = this.add.text(
                0,
                startY + index * 35,
                `${rank}.     ${entry.name}     ${entry.score}`,
                {
                    fontSize: "20px",
                    fontFamily: "Georgia, serif",
                    color: "#ffffff"
                }
            ).setOrigin(0.5)

            this.leaderboardContainer.add(text)
        })

    }

    moveTabOutline(button: Phaser.GameObjects.Text): void {
        this.tweens.add({
            targets: this.levelOutline,
            x: button.x,
            y: button.y,
            duration: 150,
            ease: "Power2",
        })
    }
}