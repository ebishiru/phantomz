import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class DoubleDonutFromBoss extends BossMechanic {

    config = {
        id: "double-donut-boss",
        name: "Tail Split",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 100,
    }

    donutA?: DonutTelegraph
    donutB?: DonutTelegraph

    minRange = 20
    maxRange = 40
    spacing = 150

    innerA: number = 0
    innerB: number = 0

    onCastStart() {
        const x = this.boss.x
        const y = this.boss.y

        this.innerA = Phaser.Math.Between(this.minRange, this.maxRange)
        this.innerB = this.innerA + this.spacing

        //Draw Telegraph
        this.donutA = new DonutTelegraph(
            this.scene,
            x,
            y,
            this.innerA,
            this.innerA + this.config.width
        )

        this.donutB = new DonutTelegraph(
            this.scene,
            x,
            y,
            this.innerB,
            this.innerB + this.config.width
        )

        //Hit Check
        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            const dist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                x,
                y,
            )

            if ((dist >= this.innerA - this.player.hurtboxRadius &&
                dist <= this.innerA + this.config.width + this.player.hurtboxRadius) ||
                (dist >= this.innerB - this.player.hurtboxRadius &&
                dist <= this.innerB + this.config.width + this.player.hurtboxRadius)
            ) {
                this.player.takeDamage(this.config.damage)
            }

            this.donutA?.destroy()
            this.donutB?.destroy()
        })
    }

    execute() {
        this.donutA?.destroy()
        this.donutB?.destroy()
        this.donutA = undefined
        this.donutB = undefined
    }
    
    destroy() {
        this.donutA?.destroy()
        this.donutB?.destroy()
        this.donutA = undefined
        this.donutB = undefined
    }
}