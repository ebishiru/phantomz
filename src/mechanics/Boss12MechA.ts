import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss12MechA extends BossMechanic {

    config = {
        id: "cone-stay-boss-player",
        name: "Projectile Vomit",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 200,
        width: 0,
    }

    coneAngle = Math.PI / 2
    damageTimer: Phaser.Time.TimerEvent | undefined

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Draw Telegraph
        this.telegraph = new ConeTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range,
            this.coneAngle
        )

        //Hit check every second
        this.scene.time.delayedCall(1000, () => {
            this.damageTimer?.destroy()

            this.damageTimer = this.scene.time.addEvent({
                delay: 250,
                loop: true,
                callback: () => this.hitCheck()
            })
        })

        this.scene.time.delayedCall(2000, () => {
            this.telegraph?.destroy()
            this.damageTimer?.destroy()
        })
    }

    hitCheck() {
        let hit = false

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )
        if (dist <= this.config.range + this.player.hurtboxRadius) {

            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.telegraph.angle
            )

            if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                hit = true
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.damageTimer?.destroy()
    }
}