import Phaser from "phaser";
import Player from "../entities/Player";
import SkillSystem from "./SkillSystem";
import HealthBar from "../ui/HealthBar";
import ExpBar from "../ui/ExpBar";
import SkillCooldown from "../ui/SkillCooldown";
import PassiveIcon from "../ui/PassiveIcon";

export default class UISystem {
    scene: Phaser.Scene
    player: Player
    skillSystem!: SkillSystem

    healthBar: HealthBar
    expBar: ExpBar
    playerName: Phaser.GameObjects.Text
    levelText: Phaser.GameObjects.Text

    skillCooldownUIs: SkillCooldown[] = []
    passiveUIs: PassiveIcon[] = []

    constructor(scene: Phaser.Scene, player: Player, skillSystem: SkillSystem) {
        this.scene = scene
        this.player = player
        this.skillSystem = skillSystem

        this.healthBar = new HealthBar(scene, 155, 40, 300, 15, player, 0x006400)
        this.expBar = new ExpBar(scene, 0, 535, 960, 5, player)

        this.playerName = scene.add.text(50, 47, `The Phantom:`, {
            fontSize: "16px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        }).setOrigin(0.5)

        this.levelText = scene.add.text(480, 500, `LEVEL\n${player.level}`, {
            fontSize: "16px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
            align: "center",
        }).setOrigin(0.5)

        this.createSkillUI()
    }

    createSkillUI() {
        this.skillCooldownUIs.forEach(ui => ui.destroy())
        this.skillCooldownUIs = []

        this.skillSystem.skills.forEach((skill, index) => {
            const x = 560 + (index * 70)
            const y = 530

            this.skillCooldownUIs.push(
                new SkillCooldown(this.scene, skill, x, y, skill.iconKey)
            )
        })
    }

    createPassiveUI() {
        this.passiveUIs.forEach(ui => ui.destroy())
        this.passiveUIs = []

        const fixedStartX = 400
        const spacing = 70
        const y = 530

        this.skillSystem.passives.forEach((passive, index) => {
            const x = fixedStartX - index * spacing

            this.passiveUIs.push(
                new PassiveIcon(this.scene, passive, x, y, passive.iconKey)
            )
        })
    }

    update() {
        this.healthBar.draw()
        this.expBar.draw()
        this.levelText.setText(`LEVEL\n${this.player.level}`)

        this.skillCooldownUIs.forEach(ui => ui.update())
        this.passiveUIs.forEach(ui => ui.update())
    }

}