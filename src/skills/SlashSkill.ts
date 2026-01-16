import Phaser from "phaser";
import Skill from "./Skill";

export default class SlashSkill extends Skill {
    player: any
    boss: any
    range: number
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any, boss: any, range: number, cooldown: number) {
        super(scene, cooldown)
        this.player = player
        this.boss = boss
        this.range = range
    }

    updateFacing() {
        const vel = this.player.body.velocity
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
        if (speed > 0) {
            this.facingAngle = Math.atan2(vel.y, vel.x)
        }
    }

    activate() {
        this.updateFacing()

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
        const dx = this.boss.x - this.player.x
        const dy = this.boss.y - this.player.y
        const distance = Math.sqrt(dx*dx + dy*dy)

        if (distance > this.range + this.boss.hurtRadius) return

        const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facingAngle)
        if (Math.abs(diff) > Math.PI/2) return

        this.boss.takeDamage(25)

    }
}