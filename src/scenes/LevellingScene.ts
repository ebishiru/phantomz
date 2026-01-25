import Phaser from "phaser";
import Player from "../entities/Player";
import { upgrades } from "../data/upgrades";

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
        const { width, height } = this.scale

        const menuWidth = 500
        const menuHeight = 450
        const menuX = width / 2
        const menuY = height / 2

        //Dim Background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.35).setOrigin(0)

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
        const optionsStartY = menuY - menuHeight / 6 - 20
        const optionsSpacing = menuHeight / 6

        options.forEach((option, index) => {
            const y = optionsStartY + (index * optionsSpacing)
            const text = this.add.text(
                menuX,
                y,
                `${option.title}\n${option.desc}`,
                {
                    fontSize: "16px",
                    fontFamily: `"Old English Text MT", Georgia, serif`,
                    align: "center",
                    backgroundColor: "#333333",
                    color: "#ffffff",
                    padding: { x: 14, y: 10},
                    wordWrap: { width: menuWidth - 40}
                }
            ).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

            text.on("pointerdown", () => {
                option.apply()
                this.scene.stop()
                this.scene.resume("game")
            })
        })

        //Skill Summary (bottom) 
        this.displaySummary(this.player, menuY + menuHeight / 2 - 120, menuWidth)
    }

    generateOptions(player: Player) {
        const options = []

        //Slash options
        if (!player.slashSkill.enabled) {
            options.push({
                title: "Slash Unlock",
                desc: "Attack in a frontal arc",
                apply: () => { player.slashSkill.enabled = true }
            })
        }
        const slashUpgrade = upgrades.slash[Math.floor(Math.random() * upgrades.slash.length)]
        options.push({
            title: "Slash Upgrade",
            desc: slashUpgrade.desc,
            apply: () => slashUpgrade.apply(player)
        })

        //Arrow options
        if(!player.arrowSkill.enabled) {
            options.push({
                title: "Arrow Unlock",
                desc: "Fire a guaranteed missile",
                apply: () => { player.arrowSkill.enabled = true }
            })
        } else {
            const arrowUpgrade = upgrades.arrow[Math.floor(Math.random() * upgrades.arrow.length)]
            options.push({
                title: "Arrow Upgrade",
                desc: arrowUpgrade.desc,
                apply: () => arrowUpgrade.apply(player)
            })
        }

        //Pulse options
        if (!player.pulseSkill.enabled) {
            options.push({
                title: "Pulse Unlock",
                desc: "Unleash an energy pulse repeatedly",
                apply: () => { player.pulseSkill.enabled = true}
            }) 
        } else {
            const pulseUpgrade = upgrades.pulse[Math.floor(Math.random() * upgrades.pulse.length)]
            options.push({
                title: "Pulse Upgrade",
                desc: pulseUpgrade.desc,
                apply: () => pulseUpgrade.apply(player)
            })
        }

        return Phaser.Utils.Array.Shuffle(options).slice(0, 3)
    }

    displaySummary(player: Player, y: number, menuWidth: number) {
        const { width } = this.scale
        let summary = "Your Skills:\n\n"

        if (player.slashSkill.enabled) {
            summary += `Slash: Dmg ${player.slashSkill.damage}, CD ${player.slashSkill.cooldown / 1000}s, Rng ${player.slashSkill.range}\n`
        }

        if (player.arrowSkill.enabled) {
            summary += `Arrow: Dmg ${player.arrowSkill.damage}, CD ${player.arrowSkill.cooldown / 1000}s\n`
        }

        if (player.pulseSkill.enabled) {
            summary += `Pulse: Dmg ${player.pulseSkill.damage}, CD ${player.pulseSkill.cooldown / 1000}s, Rng ${player.pulseSkill.range}\n`
        }

        this.add.text(width/2, y, summary, {
            fontSize: "14px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffffff",
            align: "left",
            wordWrap: { width: menuWidth - 40}
        }).setOrigin(0.5, 0)
    }
}