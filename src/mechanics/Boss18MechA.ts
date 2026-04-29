import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss18MechA extends BossMechanic {

    config = {
        id: "donut-room-circle-safe",
        name: "Sanctuary Circle",
        castTime: 1500,
        castDuration: 1500,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 600,
        width: 0,
    }

    innerRadius = 40
    outerRadius = 600

    onCastStart(){
        //Randomize center point
        const { width, height } = this.scene.scale

        const centerX = Phaser.Math.Between(width * 0.25, width * 0.75)
        const centerY = Phaser.Math.Between(height * 0.25, height * 0.75)

        //Draw initial telegraph
        this.telegraph = new DonutTelegraph(
            this.scene,
            centerX,
            centerY,
            this.innerRadius,
            this.innerRadius * 2,
        )

        this.scene.time.delayedCall(this.config.castTime - 300, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            this.telegraph?.destroy()
            this.telegraph = new DonutTelegraph(
                this.scene,
                centerX,
                centerY,
                this.innerRadius,
                this.outerRadius,
            )
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            //Check hit
            const hit = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                centerX,
                centerY,
            ) >= (this.innerRadius - this.player.hurtboxRadius)

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}