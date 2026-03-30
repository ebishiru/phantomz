import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss8MechA extends BossMechanic {

    config = {
        id: "suck-expand-donut-boss",
        name: "Forced Cataclysm Blossom",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2000,
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

        //Pull the player to boss
        this.scene.tweens.add({
            targets: this.player,
            x: this.boss.x,
            y: this.boss.y,
            duration: 300,
            ease: "Sine.easeInOut"
        })

        // Center Telegraph First
        this.scene.time.delayedCall(this.config.castTime - 100, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            
            this.circleTelegraph = new CircleTelegraph(
            this.scene,
            x,
            y,
            this.config.range
        )
        })
        
        // Center Telegraph Hit Check
        this.scene.time.delayedCall(this.config.castTime, () => {
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

        // Donut Telegraph Shows Next
        this.scene.time.delayedCall(this.config.castDuration - 100, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.donutTelegraph = new DonutTelegraph(
                this.scene,
                x,
                y,
                this.config.range,
                this.config.range + this.config.width
            )
        })

        //Donut Aoe hit check
        this.scene.time.delayedCall(this.config.castDuration, () => {
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