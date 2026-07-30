import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import SaveManager from "../systems/SaveManager";

export default class GameOverScene extends Phaser.Scene {
    saveManager!: SaveManager;
    currentLevel: string = "cave"
    selectedCharacter: string = "player1"
    selectedSkillKey: string = "slash"

    constructor() {
        super("game-over")
    }

    create(data: { score: number, bossesKilled: number, bossKills: { [key: string]: number }, level?: string, characterKey?: string, startingSkill?: string }) {
        this.currentLevel = data.level || "cave"
        this.selectedCharacter = data.characterKey || "player1"
        this.selectedSkillKey = data.startingSkill || "slash"
        // Create SaveManager in create to ensure fresh data
        this.saveManager = new SaveManager();
        
        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        //Play Game Over music
        playMusic(this, "gameOverMusic")

        // Ensure mobile controls DOM is hidden immediately on game over
        const controlsEl = document.getElementById("mobile-controls") as HTMLDivElement | null;
        if (controlsEl) controlsEl.style.display = "none";

        // Dim Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0)

        this.createGameOverText(centerX, centerY - 150);
        this.createScore(centerX, centerY - 80, data.score);
        this.createHiScore(centerX, centerY - 40, data.score, data.level);
        this.createBossKillInfo(centerX, centerY, data.bossesKilled, data.bossKills);
        this.createButtons(centerX, centerY + 170);
        this.createKeyboardShortcuts();

        //Update Save Data
        this.saveManager.updateScore(data.score, data.level)
        for (const bossKey in data.bossKills) {
            const count = data.bossKills[bossKey]
            this.saveManager.addBossKill(bossKey, count)
        }
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

    createHiScore(x: number, y:number, score: number, level?: string) {
        const currentHiScore = this.saveManager.getHiScore(level);
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

    createBossKillInfo(x: number, y: number, bossesKilled: number,bossKills: { [key: string]: number }) {
        this.add.text(x, y, `Bosses Defeated: ${bossesKilled}`, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)

        let startY = y + 40

        const maxPerRow = 5
        const spacingX = 60
        const spacingY = 60

        const keys = Object.keys(bossKills)

        keys.forEach((bossKey, index) => {
            const count = bossKills[bossKey]

            const row = Math.floor(index / maxPerRow)
            const col = index % maxPerRow

            const totalInRow = Math.min(maxPerRow, keys.length - row * maxPerRow)
            const rowWidth = (totalInRow - 1) * spacingX

            const startX = x - rowWidth / 2

            const iconX = startX + col * spacingX
            const iconY = startY + row * spacingY

            this.add.image(iconX, iconY, bossKey)
            .setFrame(0)
            .setScale(2)
            .setOrigin(0.5)

            this.add.text(iconX, iconY + 20, `x${count}`, {
                fontSize: "16px",
                fontFamily: `Georgia, serif`,
                color: "#ffffff"
            }).setOrigin(0.5) 
        })
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
        this.scene.stop("level-up")
        this.scene.stop("game")
        this.scene.start("game", {
            characterKey: this.selectedCharacter,
            startingSkill: this.selectedSkillKey,
            level: this.currentLevel,
        })
    }

    goToTitle() {
        this.scene.stop("game-over")
        this.scene.stop("level-up")
        this.scene.stop("game")
        this.scene.start("mainmenu")
    }
}