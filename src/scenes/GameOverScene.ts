import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super("game-over")
    }

    create(data: { score: number }) {
        const { width, height } = this.scale

        // Dim Background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0)

        this.add.text(width/2, height/2 - 60, "SOUL LOST", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ff0000",
        }).setOrigin(0.5)

        this.add.text(width/2, height/2 + 20, `Final Score: ${data.score}`, {
            fontSize: "16px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)

        this.add.text(width/2, height/2 + 80, "Retry [ R ]", {
            fontSize: "20px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)

        const rKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        rKey?.on("down", () => this.restartGame())

        this.add.text(width/2, height/2 + 120, "Home [ Esc ]", {
            fontSize: "20px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)

        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        escKey?.on("down", () => this.goToTitle())
    }

    restartGame() {
        this.scene.stop("game-over")
        this.scene.stop("game")
        this.scene.start("game")
    }

    goToTitle() {
        this.scene.stop("game-over")
        this.scene.stop("game")
        this.scene.start("title")
    }
}