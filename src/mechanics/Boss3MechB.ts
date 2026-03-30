import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss3MechB extends BossMechanic {

    config = {
        id: "shrink-donut-boss",
        name: "Seismic Regression",
        castTime: 1500,
        castDuration: 2500,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 130,
    }

    circleTelegraph?: CircleTelegraph
    donutTelegraph?: DonutTelegraph

    onCastStart() {
        const x = this.boss.x
        const y = this.boss.y

        // Donut Telegraph First,
        this.scene.time.delayedCall(1000, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            
            this.donutTelegraph = new DonutTelegraph(
                this.scene,
                x,
                y,
                this.config.range,
                this.config.range + this.config.width
            )
        })

        //Donut Telegraph Hit Check
        this.scene.time.delayedCall(1500, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            const dist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                x,
                y,
            )

            if (dist >= this.config.range - this.player.hurtboxRadius &&
                dist <= this.config.range + this.config.width + this.player.hurtboxRadius
            ) {
                this.player.takeDamage(this.config.damage)
            }

            this.donutTelegraph?.destroy()
            this.donutTelegraph = undefined
        })

        // Center Telegraph Next
        this.scene.time.delayedCall(2000, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            
            this.circleTelegraph = new CircleTelegraph(
            this.scene,
            x,
            y,
            this.config.range
        )
        })

        // Center Telegraph Hit Check
        this.scene.time.delayedCall(2500, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            const dist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                x,
                y,
            )

            if (dist <= this.config.range + this.player.hurtboxRadius) {
                this.player.takeDamage(this.config.damage)
            }
            
            this.circleTelegraph?.destroy()
            this.circleTelegraph = undefined
        })
    }

    execute() {
        this.circleTelegraph?.destroy()
        this.donutTelegraph?.destroy()

        this.circleTelegraph = undefined
        this.donutTelegraph = undefined
    }

    destroy() {
        this.circleTelegraph?.destroy()
        this.donutTelegraph?.destroy()

        this.circleTelegraph = undefined
        this.donutTelegraph = undefined

        super.destroy?.()
    }
}