import Phaser from "phaser";
import Skill from "./Skill";

export default class SlashSkill extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "slash", "Slash", 25, 3000, 50)

        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    activate() {
        this.updateFacing()

        //Create graphics
        const g = this.scene.add.graphics()
        g.fillStyle(0x00ff00, 0.25)
        g.slice(
            this.player.x,
            this.player.y,
            this.range,
            this.facingAngle - Math.PI/2,
            this.facingAngle + Math.PI/2,
            false
        )
        g.fillPath()
        g.lineStyle(2, 0x00ff00, 1)
        g.strokeCircle(this.player.x, this.player.y, this.range)
        this.scene.time.delayedCall(150, () => g.destroy())

        //Check hit 
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const dx = boss.x - this.player.x
        const dy = boss.y - this.player.y
        const distance = Math.sqrt(dx*dx + dy*dy)

        if (distance > this.range + boss.hurtRadius) return

        const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facingAngle)
        if (Math.abs(diff) > Math.PI/2) return

        boss.takeDamage(this.damage)

    }
}