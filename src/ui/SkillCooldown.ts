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

        this.fg = scene.add.graphics()
    }

    update(time: number) {
        let ratio = (time - this.skill.lastUsed) / this.skill.cooldown
        ratio = Phaser.Math.Clamp(ratio, 0, 1)

        const top = this.y - this.size
        const fillHeight = this.size * ratio
        const fillY = top + (this.size - fillHeight)

        this.fg.clear()
        const fgRadius = ratio >= 1 ? this.radius : 0

        this.fg.fillStyle(ratio < 1 ? 0x888888 : 0x00ff00, 0.6)
        this.fg.fillRoundedRect( this.x - this.size / 2, fillY, this.size, fillHeight, fgRadius)
    }

    destroy() {
        this.bg.destroy()
        this.fg.destroy()
    }
}