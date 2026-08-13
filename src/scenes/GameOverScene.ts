import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import SaveManager from "../systems/SaveManager";

export default class GameOverScene extends Phaser.Scene {
    saveManager!: SaveManager;
    currentLevel: string = "cave"
    selectedCharacter: string = "player1"
    selectedSkillKey: string = "slash"
    pendingSaveData: { score: number, bossesKilled: number, bossKills: { [key: string]: number }, level?: string } | null = null
    reviveButtonBG?: Phaser.GameObjects.Rectangle
    reviveUsed: boolean = false
    gameOverObjects: Phaser.GameObjects.GameObject[] = []

    constructor() {
        super("game-over")
    }

    create(data: { score: number, bossesKilled: number, bossKills: { [key: string]: number }, level?: string, characterKey?: string, startingSkill?: string, reason?: string }) {
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
        const dimBackground = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0)
        this.gameOverObjects.push(dimBackground)

        // Track revive usage for this run (persisted in registry)
        this.reviveUsed = !!this.registry.get("reviveUsed")

        this.createGameOverText(centerX, centerY - 150, data?.reason);
        this.createScore(centerX, centerY - 80, data.score);
        this.createHiScore(centerX, centerY - 40, data.score, data.level);
        this.createBossKillInfo(centerX, centerY, data.bossesKilled, data.bossKills);
        this.createButtons(centerX, centerY + 170);
        this.createRefreshButton();
        this.createReviveButton();
        this.createKeyboardShortcuts();

        // Store pending save data but DO NOT commit yet so revive won't double-add scores
        this.pendingSaveData = {
            score: data.score,
            bossesKilled: data.bossesKilled,
            bossKills: data.bossKills,
            level: data.level,
        }
    }

    createGameOverText(x: number, y: number, reason?: string) {
        const text = reason === "time" ? "TIME OVER" : "SOUL LOST"
        const gameOverText = this.add.text(x, y, text, {
            fontSize: "48px",
            fontFamily: `Georgia, serif`,
            color: "#ff0000",
        }).setOrigin(0.5)
        this.gameOverObjects.push(gameOverText)
    }

    createScore(x: number, y: number, score: number) {
        const scoreText = this.add.text(x, y, `Final Score: ${score}`, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffffff",
        }).setOrigin(0.5)
        this.gameOverObjects.push(scoreText)
    }

    createHiScore(x: number, y:number, score: number, level?: string) {
        const currentHiScore = this.saveManager.getHiScore(level);
        let highscoreText = `Hi-Score: ${currentHiScore}`
        if (score > currentHiScore) {
            highscoreText = `Hi-Score: ${score} NEW BEST!!`
        }

        const hiScoreText = this.add.text(x, y, highscoreText, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            backgroundColor: "#222222",
            color: "#ffcc00",
        }).setOrigin(0.5)
        this.gameOverObjects.push(hiScoreText)
    }

    createBossKillInfo(x: number, y: number, bossesKilled: number,bossKills: { [key: string]: number }) {
        const bossCountText = this.add.text(x, y, `Bosses Defeated: ${bossesKilled}`, {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
        this.gameOverObjects.push(bossCountText)

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

            const bossIcon = this.add.image(iconX, iconY, bossKey)
            .setFrame(0)
            .setScale(2)
            .setOrigin(0.5)
            this.gameOverObjects.push(bossIcon)

            const bossCountLabel = this.add.text(iconX, iconY + 20, `x${count}`, {
                fontSize: "16px",
                fontFamily: "Georgia, serif",
                color: "#ffffff"
            }).setOrigin(0.5)
            this.gameOverObjects.push(bossCountLabel)
        })
    }

    createButtons(centerX: number, centerY: number) {
        const spacing = 240;
        const buttonWidth = 220;
        const buttonHeight = 60;

        this.createButton(centerX - spacing/2, centerY, buttonWidth, buttonHeight, "Retry", () => this.restartGame())
        this.createButton(centerX + spacing/2, centerY, buttonWidth, buttonHeight, "Main Menu", () => this.goToTitle())
    }

    createButton(x: number, y: number, width: number, height: number, text: string, callback: () => void) {
        const buttonBG = this.add.rectangle(x, y, width, height, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

        const buttonText = this.add.text(x, y, text, {
            fontSize: "24px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        }).setOrigin(0.5)
        this.gameOverObjects.push(buttonBG, buttonText)

        buttonBG.on("pointerdown", () => {
            callback();
        })
    }

    createRefreshButton() {
        const refreshButtonWidth = 220;
        const refreshButtonHeight = 60;
        const refreshButtonX = this.scale.width / 6
        const refreshButtonY = this.scale.height / 2 + 100

        const refreshButtonBG = this.add.rectangle(refreshButtonX, refreshButtonY, refreshButtonWidth, refreshButtonHeight, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});
        this.gameOverObjects.push(refreshButtonBG)
        

        const refreshLabel = this.add.text(refreshButtonX, refreshButtonY - refreshButtonHeight/4 + 5, `Refresh Rerolls`, {
            fontSize: "20px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        }).setOrigin(0.5)
        this.gameOverObjects.push(refreshLabel)

        const refreshChargesText = this.add.text(refreshButtonX, refreshButtonY + refreshButtonHeight/4 - 5, "", {
            fontSize: "18px",
            fontFamily: "Georgia, serif",
            color: "#65aed6",
        }).setOrigin(0.5)
        this.gameOverObjects.push(refreshChargesText)

        const updateRefreshUI = () => {
            const charges = this.registry.get("rerollCharges") ?? 3
            refreshChargesText.setText(`Charges: ${charges}/3`)
        }

        updateRefreshUI()

        refreshButtonBG.on("pointerdown", () => {
            this.registry.set("rerollCharges", 3)
            updateRefreshUI()
        })
    }

    createReviveButton() {
        const reviveButtonWidth = 220;
        const reviveButtonHeight = 60;
        const reviveButtonX = this.scale.width * 5/6;
        const reviveButtonY = this.scale.height / 2 + 100;
        this.reviveButtonBG = this.add.rectangle(reviveButtonX, reviveButtonY, reviveButtonWidth, reviveButtonHeight, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true});

        this.gameOverObjects.push(this.reviveButtonBG)

        const reviveLabel = this.add.text(reviveButtonX, reviveButtonY - reviveButtonHeight/4 + 5, "Revive", {
            fontSize: "20px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        }).setOrigin(0.5)
        this.gameOverObjects.push(reviveLabel)

        const subText = this.add.text(reviveButtonX, reviveButtonY + reviveButtonHeight/4 - 5, "Watch Ad", {
            fontSize: "18px",
            fontFamily: "Georgia, serif",
            color: "#65aed6",
        }).setOrigin(0.5)
        this.gameOverObjects.push(subText)

        // If revive already used this run or time is over 10mins, disable the button
        const halfTimeOver = this.registry.get("halfTime");

        if (this.reviveUsed || halfTimeOver) {
            this.reviveButtonBG.disableInteractive()
            this.reviveButtonBG.setStrokeStyle(3, 0x555555)
            subText.setText("Unavailable")
            subText.setColor("#777777")
            return
        }

        this.reviveButtonBG.on("pointerdown", () => {
            // Guard
            if (this.reviveUsed) return
            this.handleReviveCountdown()
        })
    }

    hideGameOverUI() {
        this.gameOverObjects.forEach((obj) => {
            if ("setVisible" in obj) {
                (obj as any).setVisible(false)
            }
        })
    }

    handleReviveCountdown() {
        // Mark as used for this run
        this.reviveUsed = true
        this.registry.set("reviveUsed", true)

        // Disable revive button UI
        if (this.reviveButtonBG) {
            this.reviveButtonBG.disableInteractive()
            this.reviveButtonBG.setStrokeStyle(3, 0x555555)
        }

        // Hide the entire Game Over UI while the revive countdown plays
        this.hideGameOverUI()

        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        // Resume the game scene (it was paused on death)
        const gameScene = this.scene.get("game") as any
        if (!gameScene) return

        // Set player HP to 25 and make invulnerable + white for countdown
        const player = gameScene.player as any
        if (player) {
            player.health = 25
            player.setTintFill ? player.setTintFill(0xffffff) : player.setTint(0xffffff)
            player.isInvulnerable = true
        }

        this.scene.resume("game")
        playMusic(this, `${this.currentLevel}Music`)

        // Create countdown text overlay
        const countdownText = this.add.text(centerX, centerY, "3", {
            fontSize: "120px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(1000)

        // Sequence 3 -> 2 -> 1
        this.time.delayedCall(1000, () => {
            countdownText.setText("2")
        })

        this.time.delayedCall(2000, () => {
            countdownText.setText("1")
        })

        this.time.delayedCall(3000, () => {
            countdownText.destroy()
            // Restore player visuals and vulnerability
            if (player) {
                player.clearTint()
                player.isInvulnerable = false
            }
            // Close game-over scene
            this.scene.stop("game-over")
        })
    }

    createKeyboardShortcuts() {
        const rKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        rKey?.on("down", () => this.restartGame())

        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey?.on("down", () => this.goToTitle())
    }

    restartGame() {
        this.commitSave()
        this.scene.stop("game-over")
        this.scene.stop("level-up")
        this.scene.stop("game")

        this.reviveUsed = false
        this.registry.set("reviveUsed", false)
        this.registry.set("halfTime", false);

        this.scene.start("game", {
            characterKey: this.selectedCharacter,
            startingSkill: this.selectedSkillKey,
            level: this.currentLevel,
        })
    }

    goToTitle() {
        this.commitSave()
        this.scene.stop("game-over")
        this.scene.stop("level-up")
        this.scene.stop("game")
        this.registry.set("reviveUsed", false)
        this.registry.set("halfTime", false);
        this.scene.start("mainmenu")
    }

    commitSave() {
        if (!this.pendingSaveData) return

        const { score, bossKills, level } = this.pendingSaveData
        this.saveManager.updateScore(score, level)
        for (const bossKey in bossKills) {
            const count = bossKills[bossKey]
            this.saveManager.addBossKill(bossKey, count)
        }

        // Clear pending after committing
        this.pendingSaveData = null
    }
}