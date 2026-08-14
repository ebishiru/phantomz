import Phaser from "phaser";
import { skills } from "../data/skills";
import { passives } from "../data/passives";
import SaveManager from "../systems/SaveManager";

export default class UnlockablesScene extends Phaser.Scene {
    
    unlockables: { 
        key: string,
        name: string,
        iconKey: string,
        desc: string,
        unlock?: {
            type: string,
            value: any,
            text: string,
            }
        }[] = [...skills, ...passives]

    saveManager!: SaveManager
    selectedUnlockable: string = "slash"
    unlockableOutline!: Phaser.GameObjects.Rectangle
    visibleIcons: Phaser.GameObjects.Image[] = []
    selectedInfoName!: Phaser.GameObjects.Text
    selectedInfoDesc!: Phaser.GameObjects.Text
    upArrowBg!: Phaser.GameObjects.Rectangle
    downArrowBg!: Phaser.GameObjects.Rectangle
    rowOffset: number = 0
    iconsPerRow: number = 5
    maxVisibleRows: number = 3

    constructor() {
        super("unlocks");
    }

    create() {
        // Reset state when the scene is entered again
        this.visibleIcons = []
        this.rowOffset = 0
        this.selectedUnlockable = "slash"

        // Reload SaveManager from localStorage every time we enter this scene
        this.saveManager = new SaveManager()

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const width = this.scale.width;
        const centerX = width / 2;

        this.add.text(centerX, 50, "Unlockables", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        const startX = 150
        const startY = 120
        const spacingX = 150
        const spacingY = 120
        const visibleCount = this.iconsPerRow * this.maxVisibleRows

        // Create icon placeholders for visible unlockables only
        for (let slot = 0; slot < visibleCount; slot++) {
            const col = slot % this.iconsPerRow
            const row = Math.floor(slot / this.iconsPerRow)
            const x = startX + col * spacingX
            const y = startY + row * spacingY

            const unlockIcon = this.add.image(x, y, "")
                .setOrigin(0.5)
                .setScale(3)
                .setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                    const unlockable = unlockIcon.getData("unlockable") as typeof this.unlockables[number]
                    if (!unlockable) {
                        return
                    }
                    this.selectedUnlockable = unlockable.key
                    this.updateUnlockableOutline(unlockIcon)
                    this.updateSelectedInfo()
                })
                .setVisible(false)

            this.visibleIcons.push(unlockIcon)
        }

        this.renderUnlockablePage()

        // Unlockable chosen outline
        const initialIcon = this.visibleIcons.find(icon => icon.visible) ?? this.visibleIcons[0]
        this.unlockableOutline = this.add.rectangle(
            initialIcon.x,
            initialIcon.y,
            100,
            100,
        )
        .setStrokeStyle(4, 0xffcc00)
        .setDepth(20)

        // Scroll arrows on the right side
        const arrowX = width - 80
        const arrowButtonWidth = 70
        const arrowButtonHeight = 70
        const upArrowY = startY + 40
        const downArrowY = startY + (this.maxVisibleRows - 1) * spacingY + 40

        this.upArrowBg = this.add.rectangle(arrowX, upArrowY, arrowButtonWidth, arrowButtonHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scrollUnlockables(-1))

        this.add.text(arrowX, upArrowY, "⇧", {
            fontSize: "36px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)

        this.downArrowBg = this.add.rectangle(arrowX, downArrowY, arrowButtonWidth, arrowButtonHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scrollUnlockables(1))

        this.add.text(arrowX, downArrowY, "⇩", {
            fontSize: "36px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)

        // Selected unlockable info box to the left of Home
        const infoBoxWidth = 380
        const infoBoxHeight = 100
        const infoBoxX = centerX - 150
        const infoBoxY = 475

        this.add.rectangle(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)

        this.selectedInfoName = this.add.text(infoBoxX, infoBoxY - 35, "", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            wordWrap: { width: infoBoxWidth - 24 },
        }).setOrigin(0.5, 0)

        this.selectedInfoDesc = this.add.text(infoBoxX, infoBoxY - 10, "", {
            fontSize: "18px",
            fontFamily: `Georgia, serif`,
            color: "#cccccc",
            align: "center",
            wordWrap: { width: infoBoxWidth - 24 },
        }).setOrigin(0.5, 0)

        this.updateSelectedInfo()

        this.add.rectangle(centerX + 190, 475, 220, 60, 0x222222)
            .setStrokeStyle(3, 0xffcc00)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(centerX + 190, 475, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)

        this.updateScrollArrows(this.upArrowBg, this.downArrowBg)
    }

    renderUnlockablePage() {
        const startIndex = this.rowOffset * this.iconsPerRow
        let firstVisibleIcon: Phaser.GameObjects.Image | undefined = undefined

        for (let slotIndex = 0; slotIndex < this.visibleIcons.length; slotIndex++) {
            const icon = this.visibleIcons[slotIndex]
            const unlockable = this.unlockables[startIndex + slotIndex]
            if (unlockable) {
                const unlocked = this.isUnlockableUnlocked(unlockable)
                icon.setTexture(unlockable.iconKey)
                    .setData("unlockable", unlockable)
                    .setVisible(true)
                    .setAlpha(unlocked ? 1 : 0.5)

                if (unlocked) {
                    icon.clearTint()
                } else {
                    icon.setTint(0x999999)
                }

                if (!firstVisibleIcon) {
                    firstVisibleIcon = icon
                }
            } else {
                icon.setVisible(false)
                icon.setData("unlockable", undefined)
            }
        }

        const selectedIcon = this.visibleIcons.find(icon => {
            const unlockable = icon.getData("unlockable") as typeof this.unlockables[number]
            return unlockable && unlockable.key === this.selectedUnlockable
        })

        if (!selectedIcon && firstVisibleIcon) {
            const unlockable = firstVisibleIcon.getData("unlockable") as typeof this.unlockables[number]
            if (unlockable) {
                this.selectedUnlockable = unlockable.key
            }
        }

        if (selectedIcon && this.unlockableOutline) {
            this.updateUnlockableOutline(selectedIcon)
        } else if (firstVisibleIcon && this.unlockableOutline) {
            this.unlockableOutline.setPosition(firstVisibleIcon.x, firstVisibleIcon.y)
        }
    }

    scrollUnlockables(direction: number) {
        const maxRowOffset = Math.max(0, Math.ceil(this.unlockables.length / this.iconsPerRow) - this.maxVisibleRows)
        this.rowOffset = Phaser.Math.Clamp(this.rowOffset + direction, 0, maxRowOffset)
        this.renderUnlockablePage()
        this.updateSelectedInfo()
        this.updateScrollArrows(this.upArrowBg, this.downArrowBg)
    }

    updateSelectedInfo() {
        const selected = this.unlockables.find(item => item.key === this.selectedUnlockable)
            ?? this.unlockables.find(item => item.key === "slash")
            ?? this.unlockables[0]

        const unlocked = this.isUnlockableUnlocked(selected)
        this.selectedInfoName.setText(selected.name)
        this.selectedInfoDesc.setText(unlocked ? selected.desc : selected.unlock?.text ?? selected.desc)
    }

    isUnlockableUnlocked(unlockable: typeof this.unlockables[number]) {
        if (!unlockable.unlock) {
            return true
        }

        if (this.saveManager.isSkillUnlocked(unlockable.key)) {
            return true
        }

        const unlock = unlockable.unlock
        if (unlock.type === "caveTotalScore") {
            return this.saveManager.getTotalScore() >= Number(unlock.value)
        }

        if (unlock.type === "snowTotalScore") {
            return this.saveManager.getTotalScore("snow") >= Number(unlock.value)
        }

        if (unlock.type === "towerTotalScore") {
            return this.saveManager.getTotalScore("tower") >= Number(unlock.value)
        }

        if (unlock.type === "bossKills") {
            const req = unlock.value
            if (typeof req === "object") {
                for (const bossKey in req) {
                    if (this.saveManager.getBossKills(bossKey) < Number((req as any)[bossKey])) {
                        return false
                    }
                }
                return true
            }
            return false
        }

        return false
    }

    updateScrollArrows(upArrowBg: Phaser.GameObjects.Rectangle, downArrowBg: Phaser.GameObjects.Rectangle) {
        const maxRowOffset = Math.max(0, Math.ceil(this.unlockables.length / this.iconsPerRow) - this.maxVisibleRows)
        upArrowBg.setAlpha(this.rowOffset <= 0 ? 0.4 : 1)
        downArrowBg.setAlpha(this.rowOffset >= maxRowOffset ? 0.4 : 1)
    }

    updateUnlockableOutline(unlockable: Phaser.GameObjects.Image) {
        this.tweens.add({
            targets: this.unlockableOutline,
            x: unlockable.x,
            y: unlockable.y,
            duration: 150,
            ease: "Power2"
        })
    }
}
