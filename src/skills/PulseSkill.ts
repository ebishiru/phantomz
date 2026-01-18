import Phaser from "phaser"
import Skill from "./Skill"

export default class PulseSkill extends Skill {
    player: any
    boss: any
    range: number

    constructor(scene: Phaser.Scene, player: any, boss: any, range: number, cooldown: number) {
        super(scene, cooldown)
        this.player = player
        this.boss = boss
        this.range = range
    }

    activate() {
        //Create container at player's location
        const container = this.scene.add.container(this.player.x, this.player.y)

        //Graphics inside location
        const g = this.scene.add.graphics()
        g.lineStyle(2, 0x00ff00, 1)
        g.strokeCircle(0, 0, this.range)
        g.fillStyle(0x00ff00, 0.25)
        g.fillCircle(0, 0, this.range)
        g.alpha = 0

        container.add(g)

        //Make container follow player
        const follow = () => {
            container.x = this.player.x
            container.y = this.player.y
        }
        this.scene.events.on('update', follow)

        this.scene.time.delayedCall(500 * 6, () => {
            container.destroy()
            this.scene.events.off('update', follow)
        })
        
        //Check hit
        const hitBoss = () => {
            const attackCircle = new Phaser.Geom.Circle(
                this.player.x,
                this.player.y,
                this.range
            )
            const bossCircle = new Phaser.Geom.Circle(
                this.boss.x,
                this.boss.y,
                this.boss.hurtRadius
            )
            const hit = Phaser.Geom.Intersects.CircleToCircle(
                attackCircle, bossCircle
            )
            if (hit) {
                this.boss.takeDamage(10)
            }

            this.scene.tweens.add({
                targets: g,
                alpha: { from: 0, to: 1},
                duration: 100,
                yoyo: true,
                ease: 'Sine.easeInOut'
            })
        }

        //hit once immediately, then every 0.5s
        hitBoss()
        this.scene.time.addEvent({
            delay: 500, repeat: 5, callback: hitBoss
        })
    }
}