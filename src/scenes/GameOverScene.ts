import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import ScoreManager from "../systems/ScoreManager";

export default class GameOverScene extends Phaser.Scene {
    scoreManager: ScoreManager;
    constructor() {
        super("game-over")
        this.scoreManager = new ScoreManager();
    }

    create(data: { score: number }) {
        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        //Play Game Over music
        playMusic(this, "gameOverMusic")

        // Dim Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0)

        this.createGameOverText(centerX, centerY - 80);
        this.createScore(centerX, centerY - 20, data.score);
        this.createHiScore(centerX, centerY + 20, data.score);
        this.createButtons(centerX, centerY + 80);
        this.createKeyboardShortcuts();

        this.scoreManager.updateScore(data.score)
    }

    createGameOverText(x: number, y: number) {
            this.add.text(x, y, "SOUL LOST", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ff0000",
        }).setOrigin(0.5)
    }

    createScore(x: number, y: number, score: number) {
        this.add.text(x, y, `Final Score: ${score}`, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)
    }

    createHiScore(x: number, y:number, score: number) {
        const currentHiScore = this.scoreManager.getHiScore();
        let highscoreText = `Hi-Score: ${currentHiScore}`
        if (score > currentHiScore) {
            highscoreText = `Hi-Score: ${score} NEW BEST!!`
        }

        this.add.text(x, y, highscoreText, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffcc00",
        }).setOrigin(0.5)
    }

    createButtons(centerX: number, centerY: number) {
        const spacing = 240;
        const buttonWidth = 220;
        const buttonHeight = 60;

        this.createButton(centerX - spacing/2, centerY, buttonWidth, buttonHeight, "Retry [R]", () => this.restartGame())
        this.createButton(centerX + spacing/2, centerY, buttonWidth, buttonHeight, "Home [ESC]", () => this.goToTitle())
    }

    createButton(x: number, y: number, width: number, height: number, text: string, callback: () => void) {
        const buttonBG = this.add.rectangle(x, y, width, height, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

        this.add.text(x, y, text, {
            fontSize: "24px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        }).setOrigin(0.5)

        buttonBG.on("pointerdown", () => {
            callback();
        })
    }

    createKeyboardShortcuts() {
        const rKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        rKey?.on("down", () => this.restartGame())

        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey?.on("down", () => this.goToTitle())
    }

    restartGame() {
        this.scene.stop("game-over")
        this.scene.get("game").scene.restart()
    }

    goToTitle() {
        this.scene.stop("game-over")
        this.scene.stop("game")
        this.scene.start("mainmenu")
    }
}