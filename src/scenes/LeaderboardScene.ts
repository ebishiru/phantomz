import Phaser from "phaser";
import GoogleLeaderboardManager from "../systems/GoogleLeaderboardManager";
import type { LeaderboardEntry, LeaderboardLevel } from "../systems/GoogleLeaderboardManager";
import SaveManager from "../systems/SaveManager";

export default class LeaderboardScene extends Phaser.Scene {
    private googleLeaderboard = GoogleLeaderboardManager.getInstance();
    private saveManager!: SaveManager;

    levels: LeaderboardLevel[] = ["cave", "snow", "tower"]
    chosenLevelTab: LeaderboardLevel = "cave"
    levelOutline!: Phaser.GameObjects.Rectangle
    buttons: Phaser.GameObjects.Text[] = []

    private playerScoreText!: Phaser.GameObjects.Text
    private topScoresHeader!: Phaser.GameObjects.Text
    private topScoresText!: Phaser.GameObjects.Text
    
    constructor() {
        super("leaderboard")
    }

    create() {
        this.saveManager = new SaveManager();

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const { width, height } = this.scale;
        const centerX = width/2

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
            390,
            "Personal High Score: ???",
            {
                fontSize: "18px",
                fontFamily: "Georgia, serif",
                color: "#ffcc00"
            }
        ).setOrigin(0.5);

        this.topScoresHeader = this.add.text(
            centerX,
            150,
            "RANK      NAME                         SCORE",
            {
                fontSize: "16px",
                fontFamily: "monospace",
                color: "#ffcc00"
            }
        ).setOrigin(0.5, 0);

        this.topScoresText = this.add.text(
            centerX,
            175,
            "Loading scores...",
            {
                fontSize: "16px",
                fontFamily: "monospace",
                color: "#ffffff",
                align: "center",
                lineSpacing: 3
            }
        ).setOrigin(0.5, 0);

        // Google leaderboard button
        this.createGoogleLeaderboardButton(centerX - 155, height * 0.86);

        //Load Initial Score
        this.showLeaderboard("cave");

        //Back button
        const backButtonBg = this.add.rectangle(centerX + 155, height * 0.86, 200, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(centerX + 155, height * 0.86, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }

    createTabs() {
        const { width, height } = this.scale

        const spacing = 180;
        const centerX = width / 2;
        const centerY = height * 0.2;

        this.levels.forEach((key, index) => {
            const x = centerX + (index - 1) * spacing;

            const button = this.add.text(
                x,
                centerY,
                key.toUpperCase(),
                {
                    fontSize: "16px",
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
            120,
            60,
        )
        .setStrokeStyle(4, 0xffcc00)
        .setDepth(20)
    }

    private async showLeaderboard(level: LeaderboardLevel): Promise<void> {
        this.topScoresHeader.setText("RANK      NAME                         SCORE");
        this.topScoresText.setText("Loading scores...");

        const [topScores] = await Promise.all([
            this.googleLeaderboard.getTopScores(level)
        ]);

        const score = this.saveManager.getHiScore(level);
        this.playerScoreText.setText(
            `Personal High Score: ${score.toLocaleString()}`
        )

        this.topScoresText.setText(this.formatTopScores(topScores));
    }

    private formatTopScores(scores: LeaderboardEntry[]): string {
        if (scores.length === 0) {
            return "No scores available";
        }

        return scores
            .map((entry) => {
                const rank = String(entry.rank).padStart(4, " ");
                const name = entry.name.slice(0, 24).padEnd(24, " ");
                const score = entry.score.toLocaleString().padStart(12, " ");
                return `${rank}    ${name}${score}`;
            })
            .join("\n");
    }

    createGoogleLeaderboardButton(x: number, y: number) {
        const buttonBG = this.add.rectangle(x, y, 280, 60, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

        this.add.text(x, y, "View Full Leaderboard",
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