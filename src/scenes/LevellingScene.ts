import Phaser from "phaser";
import GameScene from "./GameScene";
import Player from "../entities/Player";
import SkillSystem from "../systems/SkillSystem";
import { generateLevelOptions } from "../systems/generateLevelOptions";

export default class LevellingScene extends Phaser.Scene {
    player!: Player
    skillSystem!: SkillSystem

    menuX!: number
    menuY!: number
    menuWidth!: number
    menuHeight!: number

    options: any[] = []
    optionContainers: Phaser.GameObjects.Container[] = []
    optionChosen = false

    init(data: { player: Player, skillSystem: SkillSystem }) {
        this.player = data.player
        this.skillSystem = data.skillSystem

        if (this.registry.get("rerollCharges") === undefined) {
            this.registry.set("rerollCharges", 3)
        }
    }

    constructor() {
        super("level-up")
    }

    create() {
        const gameScene = this.scene.get("game") as GameScene;
        gameScene.skillSystem.pauseAll();

        this.createOverlay();
        this.createMenuBox();
        this.createOptions();
        this.bindKeys();
    }

    createOverlay() {
        this.menuWidth = this.scale.width * 0.75
        this.menuHeight = this.scale.height * 0.75

        this.menuX = this.scale.width / 2
        this.menuY = this.scale.height / 2

        //Dim Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.35).setOrigin(0)
    }

    createMenuBox() {
        //Menu Box
        this.add.rectangle(this.menuX, this.menuY, this.menuWidth, this.menuHeight, 0x1e1e1e)
        .setStrokeStyle(2, 0xffffff)

        //Title (top)
        this.add.text(this.menuX, this.menuY - this.menuHeight / 2 + 40, "LEVEL UP", {
            fontSize: "24px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00"
        }).setOrigin(0.5)
    }

    getRerollCharges(): number {
        return this.registry.get("rerollCharges") ?? 3
    }

    getRerollChargeLabel(): string {
        return `Reroll ${this.getRerollCharges()}/3`
    }

    setRerollCharges(value: number) {
        const nextValue = Phaser.Math.Clamp(value, 0, 3)
        this.registry.set("rerollCharges", nextValue)
    }

    useRerollCharge() {
        const nextValue = Math.max(0, this.getRerollCharges() - 1)
        this.setRerollCharges(nextValue)
        return nextValue
    }

    createOptions() {
        //Upgrade Options (mid)
        this.options = generateLevelOptions(this.skillSystem)
        // Add regenerate option as a 5th option (will appear to the right of Skip)
        this.options.push({
            title: "Reroll",
            desc: "Re-randomize options.",
            iconKey: "reroll-icon",
            type: "regenerate",
            apply: () => { this.regenerateOptions() }
        })
        this.optionContainers = []
        this.optionChosen = false

        const optionsStartY = this.menuY - this.menuHeight / 6 - 30
        const optionsSpacing = this.menuHeight / 5
        const buttonWidth = this.menuWidth - 80
        const buttonHeight = 60

        // Render first three options as full-width rows, then render the 4th row as two half-width buttons (Skip + Refresh)
        for (let index = 0; index < this.options.length; index++) {
            if (index <= 2) {
                const option = this.options[index]
                const y = optionsStartY + (index * optionsSpacing)

                const container = this.add.container(this.menuX, y)
                this.optionContainers.push(container)

                // Determine border color based on option type
                let strokeColor = 0x372e4d // default
                if (option.type === "newSkill") strokeColor = 0xffcc00
                else if (option.type === "skillUpgrade") strokeColor = 0xffffff
                else if (option.type === "newPassive") strokeColor = 0xffcc00
                else if (option.type === "passiveUpgrade") strokeColor = 0xffffff

                const buttonBG = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x222222)
                    .setStrokeStyle(3, strokeColor)
                    .setOrigin(0.5)
                    .setInteractive({ useHandCursor: true})
                container.add(buttonBG)

                buttonBG.on("pointerdown", () => this.chooseOption(index))

                const iconKey = option.iconKey || "skip-icon" //Placeholder icon
                const icon = this.add.image(-buttonWidth / 2 + 30, 0, iconKey)
                    .setDisplaySize(32, 32)
                    .setOrigin(0, 0.5)

                const text = this.add.text(
                    -buttonWidth / 2 + 70,
                    0,
                    `${option.title}\n${option.desc}`,
                    {
                        fontSize: "16px",
                        fontFamily: `Georgia, serif`,
                        align: "left",
                        color: "#ffffff",
                        padding: { x: 0, y: 0},
                        wordWrap: { width: buttonWidth - 120}
                    }
                ).setOrigin(0, 0.5)
                
                const keyCode = this.add.text(
                    buttonWidth / 2 - 20,
                    0,
                    `[ ${index + 1} ]`,
                    {
                        fontSize: "16px",
                        fontFamily: `Georgia, serif`,
                        color: "#ffffff",
                    } 
                ).setOrigin(1, 0.5)

                container.add([icon, text, keyCode])
            } else if (index === 3) {
                // Split row: left = option 4 (Skip), right = option 5 (Refresh)
                const leftOption = this.options[3]
                const rightOption = this.options[4]
                const y = optionsStartY + (index * optionsSpacing)

                const gap = 10
                const halfWidth = (buttonWidth - gap) / 2

                const leftCenterX = -buttonWidth / 2 + halfWidth / 2
                const rightCenterX = -buttonWidth / 2 + halfWidth + gap + halfWidth / 2

                const leftContainer = this.add.container(this.menuX + leftCenterX, y)
                this.optionContainers.push(leftContainer)

                const leftBG = this.add.rectangle(0, 0, halfWidth, buttonHeight, 0x222222)
                    .setStrokeStyle(3, 0x372e4d)
                    .setOrigin(0.5)
                    .setInteractive({ useHandCursor: true })
                leftContainer.add(leftBG)
                leftBG.on("pointerdown", () => this.chooseOption(3))

                const leftIcon = this.add.image(-halfWidth / 2 + 20, 0, leftOption.iconKey || "skip-icon")
                    .setDisplaySize(32, 32)
                    .setOrigin(0, 0.5)

                const leftText = this.add.text(
                    -halfWidth / 2 + 60,
                    0,
                    `${leftOption.title}\n${leftOption.desc}`,
                    {
                        fontSize: "16px",
                        fontFamily: `Georgia, serif`,
                        align: "left",
                        color: "#ffffff",
                        wordWrap: { width: halfWidth - 80 }
                    }
                ).setOrigin(0, 0.5)

                const leftKey = this.add.text(halfWidth / 2 - 10, 0, `[ 4 ]`, { fontSize: "16px", fontFamily: `Georgia, serif`, color: "#ffffff"}).setOrigin(1, 0.5)

                leftContainer.add([leftIcon, leftText, leftKey])

                const rerollAvailable = this.getRerollCharges() > 0
                const rightContainer = this.add.container(this.menuX + rightCenterX, y)
                this.optionContainers.push(rightContainer)

                const rightBG = this.add.rectangle(0, 0, halfWidth, buttonHeight, 0x222222)
                    .setStrokeStyle(3, 0x372e4d)
                    .setOrigin(0.5)
                    .setInteractive({ useHandCursor: rerollAvailable })
                rightContainer.add(rightBG)

                if (rerollAvailable) {
                    rightBG.on("pointerdown", () => this.chooseOption(4))
                } else {
                    rightBG.setFillStyle(0x1a1a1a)
                    rightContainer.setAlpha(0.65)
                }

                const rightIcon = this.add.image(-halfWidth / 2 + 20, 0, rightOption.iconKey || "reroll-icon")
                    .setDisplaySize(32, 32)
                    .setOrigin(0, 0.5)

                const rightText = this.add.text(
                    -halfWidth / 2 + 60,
                    0,
                    `${rightOption.title}: ${this.getRerollCharges()}/3\n${rerollAvailable ? rightOption.desc : "No charges left."}`,
                    {
                        fontSize: "16px",
                        fontFamily: `Georgia, serif`,
                        align: "left",
                        color: "#ffffff",
                        wordWrap: { width: halfWidth - 80 }
                    }
                ).setOrigin(0, 0.5)

                const rightKey = this.add.text(halfWidth / 2 - 10, 0, `[ 5 ]`, { fontSize: "16px", fontFamily: `Georgia, serif`, color: "#ffffff"}).setOrigin(1, 0.5)

                rightContainer.add([rightIcon, rightText, rightKey])

                // We've rendered options 3 and 4 in this row; break the loop
                break
            }
        }
    }

    regenerateOptions() {
        // Destroy existing option containers
        this.optionContainers.forEach(c => c.destroy())
        this.optionContainers = []
        // Recreate options
        this.createOptions()
    }

    chooseOption(index: number) {
        if (this.optionChosen) return;

        const option = this.options[index];
        const container = this.optionContainers[index];
        if (!option || !container) return;

        if (option.type === "regenerate" && this.getRerollCharges() <= 0) {
            return;
        }

        this.optionChosen = true;

        this.tweens.add({
            targets: container,
            alpha: 0,
            duration: 50,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                if (option.type === "regenerate") {
                    this.useRerollCharge()
                    option.apply();
                    this.regenerateOptions();
                    return;
                }

                option.apply();

                // Resume skills naturally
                const gameScene = this.scene.get("game") as GameScene;
                gameScene.skillSystem.resumeAll();

                // Refresh UI
                gameScene.uiSystem.createSkillUI();
                gameScene.uiSystem.createPassiveUI();

                this.scene.stop();
                this.scene.resume("game");
            }
        });
    }

    bindKeys() {
        const key1 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        const key2 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        const key3 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        const key4 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
        const key5 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)

        key1?.on("down", () => this.chooseOption(0))
        key2?.on("down", () => this.chooseOption(1))
        key3?.on("down", () => this.chooseOption(2))
        key4?.on("down", () => this.chooseOption(3))
        key5?.on("down", () => this.chooseOption(4))
    }
}