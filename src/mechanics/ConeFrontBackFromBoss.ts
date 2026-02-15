import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class ConeFrontBackFromBoss extends BossMechanic {

    config = {
        id: "cone-front-back-boss",
        name: "Reverberating Pulse",
        castTime: 1500,
        castDuration: 1500,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 450,
        width: 0,
    }

    castAngle: number = 0
    coneAngle = Math.PI / 2

    telegraphFront?: ConeTelegraph
    telegraphBack?: ConeTelegraph

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )
        this.castAngle = angle

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            angle,
        )

        this.telegraphTimer = this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.indicator?.destroy()
            this.indicator = undefined
        })

        //Draw telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraphFront = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                angle,
                this.config.range,
                this.coneAngle,
            )
            this.telegraphBack = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                (angle + Math.PI),
                this.config.range,
                this.coneAngle,
            )
        })
    }

    execute() {
        //Check Hit
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
                this.player.y,
            )

            const frontDiff = Phaser.Math.Angle.Wrap(angleToPlayer - this.castAngle)
            const backDiff = Phaser.Math.Angle.Wrap(angleToPlayer - (this.castAngle + Math.PI))

            if (Math.abs(frontDiff) <= this.coneAngle / 2 || Math.abs(backDiff) <= this.coneAngle / 2) {
                hit = true
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraphFront?.destroy()
        this.telegraphBack?.destroy()
        this.telegraphFront = undefined
        this.telegraphBack = undefined
    }

    destroy() {
        this.indicator?.destroy()
        this.indicator = undefined
        this.telegraphTimer?.remove(false)
        this.telegraphTimer = undefined
        this.telegraphFront?.destroy()
        this.telegraphBack?.destroy()
        this.telegraphFront = undefined
        this.telegraphBack = undefined
    }
}