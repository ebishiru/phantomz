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
        this.displaySummary();
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
            color: "#ffffff"
        }).setOrigin(0.5)
    }

    createOptions() {
        //Upgrade Options (mid)
        this.options = generateLevelOptions(this.skillSystem)
        this.optionContainers = []
        this.optionChosen = false

        const optionsStartY = this.menuY - this.menuHeight / 6 - 40
        const optionsSpacing = this.menuHeight / 7
        const buttonWidth = this.menuWidth - 80
        const buttonHeight = 60

        this.options.forEach((option, index) => {
            const y = optionsStartY + (index * optionsSpacing)

            const container = this.add.container(this.menuX, y)
            this.optionContainers.push(container)

            // Determine border color based on option type
            let strokeColor = 0x372e4d // default
            if (option.type === "newSkill") strokeColor = 0xb56d7f
            else if (option.type === "skillUpgrade") strokeColor = 0xf0b38d
            else if (option.type === "newPassive") strokeColor = 0xa4ebcc
            else if (option.type === "passiveUpgrade") strokeColor = 0x65aed6

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
                buttonWidth / 2 - 35,
                0,
                `[ ${index + 1} ]`,
                {
                    fontSize: "16px",
                    fontFamily: `Georgia, serif`,
                    color: "#ffffff",
                } 
            ).setOrigin(1, 0.5)

            container.add([icon, text, keyCode])
        })
    }

    chooseOption(index: number) {
        if (this.optionChosen) return;

        const option = this.options[index];
        const container = this.optionContainers[index];
        if (!option || !container) return;

        this.optionChosen = true;

        this.tweens.add({
            targets: container,
            alpha: 0,
            duration: 50,
            yoyo: true,
            repeat: 2,
            onComplete: () => {
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

        key1?.on("down", () => this.chooseOption(0))
        key2?.on("down", () => this.chooseOption(1))
        key3?.on("down", () => this.chooseOption(2))
        key4?.on("down", () => this.chooseOption(3))
    }

    displaySummary() {
        const y = this.menuY + this.menuHeight / 2 - 120
        const { width } = this.scale

        let summary = "Your Skills:\n\n"

        const gameScene = this.scene.get("game") as GameScene

        gameScene.skillSystem.skills.forEach((skill: any) => {
            if (!skill.enabled) return

            const stats: string[] = []

        if (skill.damage !== undefined) {
            stats.push(`Dmg: ${skill.getDamage().toFixed(0)}`)
        }

        if (skill.cooldown !== undefined) {
            stats.push(`CD: ${(skill.getCooldown() / 1000).toFixed(2)}`)
        }

        if (skill.range !== undefined && skill.range > 0) {
            stats.push(`Rng: ${skill.getRange().toFixed(0)}`)
        }

        if (skill.healingValue !== undefined && skill.healingValue > 0) {
            stats.push(`Heal: ${skill.healingValue}`)
        }

            summary += `${skill.name}: ${stats.join(", ")}\n`
        })

        this.add.text(width/2, y, summary, {
            fontSize: "14px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            align: "left",
            wordWrap: { width: this.menuWidth - 40}
        }).setOrigin(0.5, 0)
    }
}