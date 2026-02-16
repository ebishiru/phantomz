import Phaser from "phaser";
import Skill from "./Skill";

export default class SlashSkill extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "slash", "Slash", 25, 3000, 50)
        this.iconKey = "slash-icon"
        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    activate() {
        this.updateFacing()

        // const startAngle = this.facingAngle - Math.PI / 2
        // const endAngle   = this.facingAngle + Math.PI / 2

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
        const startVFXAngle = this.facingAngle - Math.PI / 2
        const endVFXAngle = startVFXAngle + Math.PI

        this.scene.time.delayedCall(16, () => {
            const slashVFX = this.scene.add.sprite(this.player.x, this.player.y, "slash-vfx")

            slashVFX.setOrigin(0, 0.5);
            slashVFX.setScale(this.range / 16)
            slashVFX.setDepth(10)
            slashVFX.setRotation(startVFXAngle)

            this.scene.tweens.add({
                targets: { t: 0 },
                t: 1,
                duration: 150,
                ease: "Sine-easeOut",
                onUpdate: (_: any, target: any) => {
                    //Rotate based on completion percentage
                    const rot = Phaser.Math.Linear(startVFXAngle, endVFXAngle, target.t)
                    slashVFX.setRotation(rot)

                    //VFX follows player
                    slashVFX.x = this.player.x
                    slashVFX.y = this.player.y
                },
                onComplete: () => slashVFX.destroy()
            })
        })

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