import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class ExpandDonutFromBoss extends BossMechanic {

    config = {
        id: "expand-donut-boss",
        name: "Seismic Blossom",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 150,
    }

    circleTelegraph?: CircleTelegraph
    donutTelegraph?: DonutTelegraph

    onCastStart() {
        const x = this.boss.x
        const y = this.boss.y

        // Center Telegraph First
        this.scene.time.delayedCall(1400, () => {
            if (!this.boss) return
            
            this.circleTelegraph = new CircleTelegraph(
            this.scene,
            x,
            y,
            this.config.range
        )
        })
        
        // Center Telegraph Hit Check
        this.scene.time.delayedCall(1500, () => {
            if (!this.boss) return

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

        // Donut Telegraph Shows Next
        this.scene.time.delayedCall(2400, () => {
            if (!this.boss) return

            this.donutTelegraph = new DonutTelegraph(
                this.scene,
                x,
                y,
                this.config.range,
                this.config.range + this.config.width
            )
        })

        //Donut Aoe hit check
        this.scene.time.delayedCall(2500, () => {
            if (!this.boss) return

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