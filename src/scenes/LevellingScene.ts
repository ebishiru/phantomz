import Phaser from "phaser";
import GameScene from "./GameScene";
import Player from "../entities/Player";
import { skills } from "../data/skills";

export default class LevellingScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key
    player!: Player

    init(data: { player: Player }) {
        this.player = data.player
    }

    constructor() {
        super("level-up")
    }

    create() {
        const gameX = 50
        const gameY = 100
        const gameWidth = 700
        const gameHeight = 500

        const menuWidth = 500
        const menuHeight = 450

        const menuX = gameX + gameWidth / 2
        const menuY = gameY + gameHeight / 2

        //Dim Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.35).setOrigin(0)

        //Menu Box
        this.add.rectangle(menuX, menuY, menuWidth, menuHeight, 0x1e1e1e)
        .setStrokeStyle(2, 0xffffff)

        //Title (top)
        this.add.text(menuX, menuY - menuHeight / 2 + 40, "LEVEL UP", {
            fontSize: "24px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffffff"
        }).setOrigin(0.5)

        //Upgrade Options (mid)
        const options = this.generateOptions(this.player)
        const optionContainers: Phaser.GameObjects.Container[] = []
        let optionChosen = false

        options.push({
            title: "Skip",
            desc: "Gain no upgrades this level",
            iconKey: "skip-icon",
            apply: () => {}
        })

        const optionsStartY = menuY - menuHeight / 6 - 40
        const optionsSpacing = menuHeight / 8

        options.forEach((option, index) => {
            const y = optionsStartY + (index * optionsSpacing)

            const container = this.add.container(menuX, y)
            optionContainers.push(container)

            const iconKey = option.iconKey || "skip-icon" //Placeholder icon
            const icon = this.add.image(-menuWidth / 2 + 30, 0, iconKey)
            .setDisplaySize(32, 32)
            .setOrigin(0, 0.5)

            const text = this.add.text(
                -menuWidth / 2 + 70,
                0,
                `${option.title}\n${option.desc}`,
                {
                    fontSize: "16px",
                    fontFamily: `Georgia, serif`,
                    align: "left",
                    color: "#ffffff",
                    padding: { x: 0, y: 0},
                    wordWrap: { width: menuWidth - 100}
                }
            ).setOrigin(0, 0.5)
            
            const keyCode = this.add.text(
                menuWidth / 2 - 40,
                0,
                `[ ${index + 1} ]`,
                {
                    fontSize: "16px",
                    fontFamily: `Georgia, serif`,
                    color: "#ffffff",
                } 
            ).setOrigin(1, 0.5)

            container.add([icon, text, keyCode])

            container.setSize(menuWidth - 20, 50)
            container.setInteractive({ useHandCursor: true})

            container.on("pointerdown", () => {
                chooseOption(index)
            })
        })

        const chooseOption = (index: number) => {
            const option = options[index]
            const container = optionContainers[index]
            if (!option || !container) return

            if (optionChosen) return
            optionChosen = true

            this.tweens.add({
                targets: container,
                alpha: 0,
                duration: 50,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    option.apply()
                    this.scene.stop()
                    const gameScene = this.scene.get("game") as GameScene
                    this.player.skills.forEach(skill => skill.resume(gameScene.time.now))
                    this.scene.resume("game")
                    gameScene.updateSkillUIPositions()
                }
            })
                
        }

        const key1 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        const key2 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        const key3 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        const key4 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)

        key1?.on("down", () => chooseOption(0))
        key2?.on("down", () => chooseOption(1))
        key3?.on("down", () => chooseOption(2))
        key4?.on("down", () => chooseOption(3))

        //Skill Summary (bottom) 
        this.displaySummary(this.player, menuY + menuHeight / 2 - 120, menuWidth)
    }

    generateOptions(player: Player) {
        const unlockedCount = player.skills.length
        const options: {title: string, desc: string, iconKey?: string, apply: () => void}[] = [];

        skills.forEach(skill => {
            const skillObj = (player as any)[skill.key]

            if (!skillObj.enabled && unlockedCount < 4) {
                options.push({
                    title: `${skill.name} Unlock`,
                    desc: skill.desc,
                    iconKey: skill.iconKey,
                    apply: () => { player.unlockSkill(skillObj)}
                })
            } else if (skillObj.enabled) {
                const upgrade = skill.upgrades[Math.floor(Math.random() * skill.upgrades.length)]
                options.push({
                    title: `${skill.name} Upgrade`,
                    desc: upgrade.desc,
                    iconKey: skill.iconKey,
                    apply: () => upgrade.apply(player)
                })
            }
        })

        return Phaser.Utils.Array.Shuffle(options).slice(0, 3);
    }

    displaySummary(player: Player, y: number, menuWidth: number) {
        const { width } = this.scale
        let summary = "Your Skills:\n\n"

        if (player.slashSkill.enabled) {
            summary += `Slash: Dmg ${player.slashSkill.damage}, CD ${(player.slashSkill.cooldown / 1000).toFixed(2)}s, Rng ${player.slashSkill.range}\n`
        }

        if (player.arrowSkill.enabled) {
            summary += `Arrow: Dmg ${player.arrowSkill.damage}, CD ${(player.arrowSkill.cooldown / 1000).toFixed(2)}s\n`
        }

        if (player.pulseSkill.enabled) {
            summary += `Pulse: Dmg ${player.pulseSkill.damage}, CD ${(player.pulseSkill.cooldown / 1000).toFixed(2)}s, Rng ${player.pulseSkill.range}\n`
        }

        if (player.thrustSkill.enabled) {
            summary += `Thrust: Dmg ${player.thrustSkill.damage}, CD ${(player.thrustSkill.cooldown / 1000).toFixed(2)}s\n`
        }

        if (player.caltropsSkill.enabled) {
            summary += `Caltrops: Dmg ${player.caltropsSkill.damage}, CD ${(player.caltropsSkill.cooldown / 1000).toFixed(2)}s, Rng ${player.caltropsSkill.range}\n`
        }

        if (player.fireballSkill.enabled) {
            summary += `Fireball: Dmg ${player.fireballSkill.damage}, CD ${(player.fireballSkill.cooldown / 1000).toFixed(2)}s\n`
        }

        this.add.text(width/2, y, summary, {
            fontSize: "14px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            align: "left",
            wordWrap: { width: menuWidth - 40}
        }).setOrigin(0.5, 0)
    }
}