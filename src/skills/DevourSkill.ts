import Phaser from "phaser";
import Skill from "./Skill";

export default class DevourSkill extends Skill {
    player: any
    facingAngle: number = 0
    healingValue: number = 2

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "devour", "Devour", 20, 6000, 40)
        this.iconKey = "devour-icon"
        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    buffHeal(amount: number) {
        this.healingValue += amount
    }

    activate() {
        this.updateFacing()

        const startAngle = this.facingAngle - Math.PI / 3
        const endAngle = this.facingAngle + Math.PI /3

        //Create graphics
        // const g = this.scene.add.graphics()
        // g.fillStyle(0x00ff00, 0.25)
        // g.beginPath()
        // g.moveTo(this.player.x, this.player.y)
        // g.arc(this.player.x, this.player.y, this.range, startAngle, endAngle)
        // g.closePath()
        // g.fillPath()

        // g.lineStyle(2, 0x00ff00, 1)
        // g.beginPath()
        // g.moveTo(this.player.x, this.player.y)
        // g.arc(this.player.x, this.player.y, this.range, startAngle, endAngle)
        // g.closePath()
        // g.strokePath()

        // this.scene.time.delayedCall(150, () => g.destroy())

        //VFX
        const offsetDistance = this.range * 0.75
        
        const vfxX = this.player.x + Math.cos(this.facingAngle) * offsetDistance
        const vfxY = this.player.y + Math.sin(this.facingAngle) * offsetDistance

        const devourVFX = this.scene.add.sprite(vfxX, vfxY, "devour-vfx")

        devourVFX.setRotation(this.facingAngle)
        devourVFX.setAlpha(1)
        devourVFX.setScale(2.5)
        devourVFX.setDepth(10)

        this.scene.tweens.add({
            targets: devourVFX,
            alpha: 0.5,
            duration: 150,
            onComplete: () => devourVFX.destroy()
        })

        //Check hit
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const dx = boss.x - this.player.x
        const dy = boss.y - this.player.y
        const distance = Math.sqrt(dx*dx + dy*dy)

        if (distance > this.range + boss.hurtRadius) return

        const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facingAngle)

        if (Math.abs(diff) > Math.PI/3) return

        boss.takeDamage(this.damage)
        this.player.takeDamage(-this.healingValue)

    }
}