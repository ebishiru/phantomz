import Phaser from "phaser";
import GoogleLeaderboardManager from "../systems/GoogleLeaderboardManager";
import type { LeaderboardLevel } from "../systems/GoogleLeaderboardManager";

export default class LeaderboardScene extends Phaser.Scene {
    private googleLeaderboard = GoogleLeaderboardManager.getInstance();

    levels: LeaderboardLevel[] = ["cave", "snow", "tower"]
    chosenLevelTab: LeaderboardLevel = "cave"
    levelOutline!: Phaser.GameObjects.Rectangle
    buttons: Phaser.GameObjects.Text[] = []

    private playerScoreText!: Phaser.GameObjects.Text
    
    constructor() {
        super("leaderboard")
    }

    create() {
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const { width, height } = this.scale;
        const centerX = width/2
        const centerY = height/2

        this.add.text(width/2, 50, "Hall of Fame", {
            fontSize: "32px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00"
        }).setOrigin(0.5)

        //Level select tabs
        this.createTabs();

        //Player Score
        this.playerScoreText = this.add.text(
            centerX,
            centerY,
            "Personal High Score: ???",
            {
                fontSize: "20px",
                fontFamily: "Georgia, serif",
                color: "#ffcc00"
            }
        ).setOrigin(0.5);

        // Google leaderboard button
        this.createGoogleLeaderboardButton(centerX, height * 0.65);

        //Load Initial Score
        this.showLeaderboard("cave");

        //Back button
        const backButtonBg = this.add.rectangle(centerX, 475, 200, 60, 0x222222)
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

    createTabs() {
        const { width, height } = this.scale

        const spacing = 180;
        const centerX = width / 2;
        const centerY = height * 0.3;

        this.levels.forEach((key, index) => {
            const x = centerX + (index - 1) * spacing;

            const button = this.add.text(
                x,
                centerY,
                key.toUpperCase(),
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

    private async showLeaderboard(level: LeaderboardLevel): Promise<void> {
        const score = await this.googleLeaderboard.getUserScore(level);

        if (score === null) {
            this.playerScoreText.setText("Personal High Score: ???");
            return;
        }

        this.playerScoreText.setText(
            `Personal High Score: ${score.toLocaleString()}`
        )
    }

    createGoogleLeaderboardButton(x: number, y: number) {
        const buttonBG = this.add.rectangle(x, y, 280, 60, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

        this.add.text(x, y, "VIEW LEADERBOARD",
            {
                fontSize: "20px",
                fontFamily: "Georgia, serif",
                color: "#ffffff"
            }
        ).setOrigin(0.5)

        buttonBG.on("pointerup", async () => {
            await this.googleLeaderboard.showLeaderboard(this.chosenLevelTab);
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