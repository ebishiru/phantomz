import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss15MechA extends BossMechanic {

    config = {
        id: "teleport-boss-player-expand-ring",
        name: "Oathbreaker's Descent",
        castTime: 1200,
        castDuration: 2300,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 90,
        width: 120,
    }

    circleTelegraph?: CircleTelegraph
    donutTelegraph?: DonutTelegraph

    onCastStart() {
        const endX = this.player.x
        const endY = this.player.y

        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            
            this.circleTelegraph = new CircleTelegraph(
                this.scene,
                endX,
                endY,
                this.config.range
            )
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            this.scene.tweens.add({
                targets: this.boss,
                x: endX,
                y: endY,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    //Check hit
                    const dist = Phaser.Math.Distance.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )

                    if (dist <= this.config.range + this.player.hurtboxRadius) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.circleTelegraph?.destroy()
                    this.circleTelegraph = undefined
                }
            })
        })

        this.scene.time.delayedCall((this.config.castDuration - 300), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.donutTelegraph = new DonutTelegraph(
                this.scene,
                endX,
                endY,
                this.config.range,
                this.config.range + this.config.width
            )
        })

        this.scene.time.delayedCall(this.config.castDuration, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            //Check donut hit
            const dist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                endX,
                endY,
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

    destroy() {
        this.circleTelegraph?.destroy()
        this.donutTelegraph?.destroy()
        this.circleTelegraph = undefined
        this.donutTelegraph = undefined
    }
}