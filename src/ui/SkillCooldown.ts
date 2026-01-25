import Phaser from "phaser";
import Skill from "../skills/Skill";

export default class SkillCooldown {
    scene: Phaser.Scene
    skill: Skill
    x: number
    y: number
    size: number
    radius: number

    bg: Phaser.GameObjects.Graphics | Phaser.GameObjects.Image
    fg: Phaser.GameObjects.Graphics

    loadingBorder: Phaser.GameObjects.Image
    readyBorder: Phaser.GameObjects.Image

    constructor(
        scene: Phaser.Scene,
        skill: Skill,
        x: number,
        y: number,
        bgKey: string | null = null,
        size = 32,
        radius = 6,
    ) {
        this.scene = scene
        this.skill = skill
        this.x = x
        this.y = y
        this.size = size
        this.radius = radius

        if (bgKey) {
            this.bg = scene.add.image(x, y - size / 2, bgKey);
            this.bg.setDisplaySize(size, size) 
        } else {
            this.bg = scene.add.graphics()
            this.bg.fillStyle(0x444444, 1)
            this.bg.fillRoundedRect(x - size/2, y - size, size, size, radius)
        }

        this.loadingBorder = scene.add.image(x, y - size / 2, "loading-border")
        this.loadingBorder.setDisplaySize(size + 2, size + 2)

        this.readyBorder = scene.add.image(x, y - size / 2, "ready-border")
        this.readyBorder.setDisplaySize(size + 2, size + 2)

        this.readyBorder.setVisible(false)

        this.fg = scene.add.graphics()

        this.bg.setDepth(1)
        this.loadingBorder.setDepth(2)
        this.fg.setDepth(3)
        this.readyBorder.setDepth(4)

    }

    update(time: number) {
        if (!this.scene.scene.isActive()) return

        let remaining = this.skill.remainingCooldown(time)
        let ratio = 1 - remaining / this.skill.cooldown
        ratio = Phaser.Math.Clamp(ratio, 0, 1)

        const top = this.y - this.size
        const fillHeight = this.size * ratio
        const fillY = top + (this.size - fillHeight)

        this.fg.clear()

        if (ratio < 1) {
            //loading state
            this.loadingBorder.setVisible(true)
            this.readyBorder.setVisible(false)

            this.fg.fillStyle(0xffffff, 0.3)
            this.fg.fillRect(this.x - this.size / 2, fillY, this.size, fillHeight)
        } else {
            //ready state
            this.loadingBorder.setVisible(false)
            this.readyBorder.setVisible(true)
        }
    }

    destroy() {
        this.bg.destroy()
        this.fg.destroy()
        this.loadingBorder.destroy()
        this.readyBorder.destroy()
    }
}