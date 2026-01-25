import Phaser from "phaser";
import Skill from "./Skill";

export default class CaltopsSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "caltrops", "Caltrops", 20, 7000, 40)

        this.player = player
    }

    activate() {
        const g = this.scene.add.graphics()

        const originX = this.player.x
        const originY = this.player.y

        //Check hit
        const hitBoss = () => {

            //Create graphics
            g.lineStyle(2, 0x00ff00, 1)
            g.strokeCircle(originX, originY, this.range)
            g.fillStyle(0x00ff00, 0.25)
            g.fillCircle(originX, originY, this.range)

            this.scene.tweens.add({
                targets: g,
                alpha: { from: 1, to: 0},
                duration: 300,
                ease: 'Sine.easeOut'
            })

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

        this.scene.time.delayedCall(3000, () => g.destroy())
    }
}