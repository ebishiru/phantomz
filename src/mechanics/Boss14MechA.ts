import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss14MechA extends BossMechanic {

    config = {
        id: "front-cone-boss",
        name: "Claw Swipe",
        castTime: 1400,
        castDuration: 1400,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 350,
        width: 0,
    }

    coneAngle = Math.PI

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            angle,
        )

        //Draw telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                angle,
                this.config.range,
                this.coneAngle
            )

            this.indicator?.destroy()
            this.indicator = undefined
        })
    }

    execute() {
        //Check hit
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

        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.indicator?.destroy()
        this.indicator = undefined
    }
}