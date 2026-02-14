import Phaser from "phaser";
import Skill from "./Skill";

export default class CaltopsSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "caltrops", "Caltrops", 15, 7000, 40)
        this.iconKey = "caltrops-icon"
        this.player = player
    }

    activate() {
        const g = this.scene.add.graphics()

        const originX = this.player.x
        const originY = this.player.y

        const hitBoss = () => {

            //Create graphics
            // g.lineStyle(2, 0x00ff00, 1)
            // g.strokeCircle(originX, originY, this.range)
            // g.fillStyle(0x00ff00, 0.25)
            // g.fillCircle(originX, originY, this.range)

            // this.scene.tweens.add({
            //     targets: g,
            //     alpha: { from: 1, to: 0},
            //     duration: 300,
            //     ease: 'Sine.easeOut'
            // })

            //VFX
            const caltropsVFX = this.scene.add.sprite(originX, originY, "caltrops-vfx")
            caltropsVFX.setOrigin(0.5, 0.5)
            caltropsVFX.setAlpha(0.75)
            caltropsVFX.setScale(5)
            caltropsVFX.setDepth(10)
            
            this.scene.tweens.add({
                targets: caltropsVFX,
                alpha: 0,
                duration: 250,
                ease: "Sine.easeOut",
                onComplete: () => caltropsVFX.destroy()
            })

            //Check hit
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackCircle = new Phaser.Geom.Circle(
                originX,
                originY,
                this.range
            )
            const bossCircle = new Phaser.Geom.Circle(
                boss.x,
                boss.y,
                boss.hurtRadius
            )
            const hit = Phaser.Geom.Intersects.CircleToCircle(
                attackCircle, bossCircle
            )
            if (hit) {
                boss.takeDamage(this.damage)
            }

        }

        //hit once immediately, then every 1s
        hitBoss()
        this.scene.time.addEvent({
            delay: 1000, repeat: 1, callback: hitBoss
        })

        // this.scene.time.delayedCall(3000, () => g.destroy())
    }
}