import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import tips from "../data/tips";
import SaveManager from "../systems/SaveManager";
import { skills } from "../data/skills";
import { passives } from "../data/passives";
import GoogleLeaderboardManager from "../systems/GoogleLeaderboardManager";
import type { LeaderboardLevel } from "../systems/GoogleLeaderboardManager";
import AdManager from "../systems/AdManager";

export default class GameOverScene extends Phaser.Scene {
    saveManager!: SaveManager;
    private googleLeaderboard = GoogleLeaderboardManager.getInstance();
    private showingReviveAd = false
    currentLevel: LeaderboardLevel = "cave"
    selectedCharacter: string = "player1"
    selectedSkillKey: string = "slash"
    pendingSaveData: { score: number, bossesKilled: number, bossKills: { [key: string]: number }, level?: string } | null = null
    reviveButtonBG?: Phaser.GameObjects.Rectangle
    reviveUsed: boolean = false
    gameOverObjects: Phaser.GameObjects.GameObject[] = []

    private pendingGameOverAction: "retry" | "mainmenu" | null = null
    private showingUnlockPopup = false

    constructor() {
        super("game-over")
    }

    create(data: { score: number, bossesKilled: number, bossKills: { [key: string]: number }, level?: string, characterKey?: string, startingSkill?: string, reason?: string }) {
        this.currentLevel = (data.level as LeaderboardLevel) || "cave"
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
        // this.gameOverObjects.push(dimBackground)

        // Track revive usage for this run (persisted in registry)
        this.reviveUsed = !!this.registry.get("reviveUsed")

        this.createGameOverText(centerX, centerY - 150, data?.reason);
        this.createScore(centerX, centerY - 80, data.score);
        this.createHiScore(centerX, centerY - 40, data.score, data.level);
        this.createBossKillInfo(centerX, centerY, data.bossesKilled, data.bossKills);
        this.createButtons(centerX, centerY + 170);
        this.createTipBox();
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

        this.createButton(centerX - spacing/2, centerY, buttonWidth, buttonHeight, "Retry", () => this.handleGameOverAction("retry"))
        this.createButton(centerX + spacing/2, centerY, buttonWidth, buttonHeight, "Main Menu", () => this.handleGameOverAction("mainmenu"))
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

    createTipBox() {
        const tipWidth = 220;
        const tipHeight = 60;
        const tipX = this.scale.width / 6
        const tipY = this.scale.height / 2 + 100

        const tipBG = this.add.rectangle(tipX, tipY, tipWidth, tipHeight, 0x222222)
            .setStrokeStyle(3, 0x65aed6)
            .setOrigin(0.5)
        this.gameOverObjects.push(tipBG)
        
        const randomTip = Phaser.Utils.Array.GetRandom(tips)

        const tipText = this.add.text(tipX, tipY, randomTip, {
            fontSize: "16px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            align: "center",
        }).setOrigin(0.5)

        this.gameOverObjects.push(tipText)
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

            this.watchAdToRevive()
        })
    }

    async watchAdToRevive() {
        if (this.showingReviveAd) return
        if (this.reviveUsed) return

        this.showingReviveAd = true

        //Keep game and audio paused
        this.sound.pauseAll()

        try {
            const rewarded = await AdManager.showReviveAd()
            if (!rewarded) {
                //Ad failed
                this.sound.resumeAll()
                return
            }

            this.createResumeButton()
        } finally {
            this.showingReviveAd = false
        }
    }

    createResumeButton() {
        // Hide the entire Game Over UI while the revive countdown plays
        this.hideGameOverUI()

        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        const resumeButton = this.add.rectangle(centerX, centerY, 260, 80, 0x222222)
            .setStrokeStyle(3, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({ useHandcursor: true})
            .setDepth(2000)

        const resumeText = this.add.text(centerX, centerY, "Tap to Reawaken", {
            fontSize: "20px",
            fontFamily: "Georgia, serif",
            color: "#ffffff"
        })
            .setOrigin(0.5)
            .setDepth(2001)

        resumeButton.on("pointerdown", () => {
            //Window flickers
            this.tweens.add({
                targets: [resumeButton, resumeText],
                alpha: 0,
                duration: 50,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    resumeButton.disableInteractive()
                    resumeButton.destroy()
                    resumeText.destroy()

                    this.startRevive()
                }
            })
        })
    }

    startRevive() {
    // Reenable mobile controls if applicable
        this.showMobileControls()
        this.handleReviveCountdown()
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

        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        // Resume the game scene (it was paused on death)
        const gameScene = this.scene.get("game") as any
        if (!gameScene) return

        playMusic(this, `${this.currentLevel}Music`)

        // Create countdown text overlay
        const countdownText = this.add.text(centerX, centerY, "3", {
            fontSize: "120px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(1000)

        // Sequence 3,2,1
        this.time.delayedCall(1000, () => {
            this.sound.resumeAll()
            countdownText.setText("2")
        })

        this.time.delayedCall(2000, () => {
            countdownText.setText("1")
        })

        this.time.delayedCall(3000, () => {
            countdownText.destroy()
            // Resume game time
            this.scene.resume("game")
            gameScene.reviveInvulnerability()
            // Close game-over scene
            this.scene.stop("game-over")
        })
    }

    showMobileControls() {
        const mobileControlsEnabled = this.registry.get("mobileControlsEnabled") ?? false;

        if (!mobileControlsEnabled) return;

        const controlsEl = document.getElementById("mobile-controls") as HTMLDivElement | null;
        if (controlsEl) controlsEl.style.display = "block";
    }

    createKeyboardShortcuts() {
        const rKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        rKey?.on("down", () => this.handleGameOverAction("retry"))

        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        escKey?.on("down", () => this.handleGameOverAction("mainmenu"))
    }

    async handleGameOverAction(action: "retry" | "mainmenu") {
        if (this.showingUnlockPopup) return
        if (!this.pendingSaveData) return

        this.pendingGameOverAction = action

        const newUnlocks = await this.commitSave()

        if (newUnlocks && newUnlocks.length > 0) {
            this.showNewUnlockPopup(newUnlocks)
        } else {
            this.continueAfterUnlocks()
        }
    }

    showNewUnlockPopup(newUnlocks: string[]) {
        this.showingUnlockPopup = true

        const centerX = this.scale.width / 2
        const centerY = this.scale.height / 2

        //Hide existing Game Over UI
        this.hideGameOverUI()

        const popupWidth = 500
        const popupHeight = 350

        const popupBG = this.add.rectangle(
            centerX,
            centerY,
            popupWidth,
            popupHeight,
            0x222222
        )
            .setStrokeStyle(3, 0xffffff)
            .setDepth(3000)

        const title = this.add.text(centerX, centerY - 130, "NEW UNLOCKS!",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#ffcc00"
            }
        )
            .setOrigin(0.5)
            .setDepth(3001)

        const unlockTexts: Phaser.GameObjects.GameObject[] = []

        const startY = centerY - 70
        const spacing = 40

        newUnlocks.forEach((key, index) => {
            const skill = skills.find(skill => skill.key === key)
            const passive = passives.find(passive => passive.key === key)
            const unlockable = skill ?? passive

            if (!unlockable) return

            const y = startY + index * spacing
            const icon = this.add.image(centerX - 100, y, unlockable.iconKey)
                .setScale(2)
                .setDepth(3001)

            const name = this.add.text(centerX - 60, y, unlockable.name,
                {
                    fontSize: "18px",
                    fontFamily: "Georgia, serif",
                    color: "#ffffff"
                }
            )
                .setOrigin(0, 0.5)
                .setDepth(3001)

            unlockTexts.push(icon, name)
        })

        const continueButton = this.add.rectangle(
            centerX,
            centerY + 120,
            220,
            55,
            0x222222
        )
            .setStrokeStyle(3, 0xffcc00)
            .setInteractive({ useHandCursor: true })
            .setDepth(3001)

        const continueText = this.add.text(
            centerX,
            centerY + 120,
            "Continue",
            {
                fontSize: "20px",
                fontFamily: "Georgia, serif",
                color: "#ffffff"
            }
        )
            .setOrigin(0.5)
            .setDepth(3002)

        continueButton.once("pointerdown", () => {
            continueButton.disableInteractive()

            popupBG.destroy()
            title.destroy()
            continueButton.destroy()
            continueText.destroy()

            unlockTexts.forEach(obj => obj.destroy())

            this.showingUnlockPopup = false

            this.continueAfterUnlocks()
        })
    }

    continueAfterUnlocks() {
        const action = this.pendingGameOverAction

        this.pendingGameOverAction = null

        if (action === "retry") {
            this.restartGame()
        } else if (action === "mainmenu") {
            this.goToTitle()
        }
    }

    async restartGame() {
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

    async goToTitle() {
        this.scene.stop("game-over")
        this.scene.stop("level-up")
        this.scene.stop("game")
        this.registry.set("reviveUsed", false)
        this.registry.set("halfTime", false);
        this.scene.start("mainmenu")
    }

    async commitSave() {
        if (!this.pendingSaveData) return

        const { score, bossKills, level } = this.pendingSaveData

        //Save to local
        this.saveManager.updateScore(score, level)
        for (const bossKey in bossKills) {
            const count = bossKills[bossKey]
            this.saveManager.addBossKill(bossKey, count)
        }

        //Check for newly unlocked skill/passives
        const newUnlocks = this.saveManager.revealNewUnlocks()

        //Upload to Google Leaderboard
        await this.googleLeaderboard.submitScore(this.currentLevel, score);

        // Clear pending after committing
        this.pendingSaveData = null

        return newUnlocks
    }
}