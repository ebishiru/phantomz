import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("game-over")
    }

    create(data: { score: number }) {
        const gameX = 50
        const gameY = 100
        const gameWidth = 700
        const gameHeight = 500

        const centerX = gameX + gameWidth / 2
        const centerY = gameY + gameHeight / 2

        // Dim Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0)

        this.add.text(centerX, centerY - 60, "SOUL LOST", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ff0000",
        }).setOrigin(0.5)

        this.add.text(centerX, centerY + 20, `Final Score: ${data.score}`, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)

        const retryText = this.add.text(centerX, centerY + 80, "Retry [ R ]", {
            fontSize: "20px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})

        retryText.on("pointerdown", () => this.restartGame())

        const rKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        rKey?.on("down", () => this.restartGame())

        const homeText = this.add.text(centerX, centerY + 120, "Home [ Esc ]", {
            fontSize: "20px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5).setInteractive({ useHandCursor: true})

        homeText.on("pointerdown", () => this.goToTitle())

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
        this.scene.start("title")
    }
}