import Phaser from "phaser"
import Skill from "./Skill"

export default class PulseSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "pulse", "Pulse", 6, 6000, 50)
        this.iconKey = "pulse-icon"
        this.player = player
    }

    activate() {
        //Create container at player's location
        const container = this.scene.add.container(this.player.x, this.player.y)

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
        
        //VFX
        const pulseVFX = this.scene.add.sprite(container.x, container.y, "pulse-vfx")
        pulseVFX.setOrigin(0.5, 0.5)
        pulseVFX.setAlpha(1)
        pulseVFX.setScale(0)
        pulseVFX.setDepth(10)
        container.add(pulseVFX)

        this.scene.tweens.add({
            targets: pulseVFX,
            scale: this.getRange() / 8,
            alpha: 0.5,
            duration: 400,
            ease: "Sine.easeOut",
            onComplete: () => pulseVFX.destroy()
        })

        //Check hit
        const hitBoss = () => {
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackCircle = new Phaser.Geom.Circle(
                this.player.x,
                this.player.y,
                this.getRange()
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
                boss.takeDamage(this.getDamage())
            }

        }

        //hit once immediately, then every 0.5s
        hitBoss()
        this.scene.time.addEvent({
            delay: 500, repeat: 4, callback: hitBoss
        })
    }
}