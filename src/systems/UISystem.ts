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
    levelText: Phaser.GameObjects.Text

    skillCooldownUIs: SkillCooldown[] = []
    passiveUIs: PassiveIcon[] = []

    constructor(scene: Phaser.Scene, player: Player, skillSystem: SkillSystem) {
        this.scene = scene
        this.player = player
        this.skillSystem = skillSystem

        this.healthBar = new HealthBar(scene, 300, 650, 200, 20, player, 0x006400)
        this.expBar = new ExpBar(scene, 0, 685, 800, 15, player)

        this.levelText = scene.add.text(400, 630, `Level ${player.level}`, {
            fontSize: "12px",
            fontFamily: "Georgia",
            color: "#ffffff"
        }).setOrigin(0.5)

        this.createSkillUI()
    }

    createSkillUI() {
        this.skillCooldownUIs.forEach(ui => ui.destroy())
        this.skillCooldownUIs = []

        this.skillSystem.skills.forEach((skill, index) => {
            const x = 550 + (index * 50)
            const y = 650

            this.skillCooldownUIs.push(
                new SkillCooldown(this.scene, skill, x, y, skill.iconKey)
            )
        })
    }

    createPassiveUI() {
        this.passiveUIs.forEach(ui => ui.destroy())
        this.passiveUIs = []

        const startX = 300 - this.skillSystem.passives.length * 50
        const skillSize = 32
        const y = 650 - skillSize / 2

        this.skillSystem.passives.forEach((passive, index) => {
            const x = startX + index * 50

            this.passiveUIs.push(
                new PassiveIcon(this.scene, passive, x, y, passive.iconKey)
            )
        })
    }

    update() {
        this.healthBar.draw()
        this.expBar.draw()
        this.levelText.setText(`Level ${this.player.level}`)

        this.skillCooldownUIs.forEach(ui => ui.update())
        this.passiveUIs.forEach(ui => ui.update())
    }

}