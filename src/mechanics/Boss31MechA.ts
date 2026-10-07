import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss31MechA extends BossMechanic {

    config = {
        id: "donut-expand-player",
        name: "Shocking Cry",
        castTime: 800,
        castDuration: 2400,
        cooldown: 2500,
        showCastBar: false,
        damage: 20,
        range: 80,
        width: 120,
    }

    onCastStart() {
        //Draw circle telegraph
        const centerX = this.player.x
        const centerY = this.player.y
        
        this.telegraph = new CircleTelegraph(
            this.scene,
            centerX,
            centerY,
            this.config.range,
        )

        this.scene.time.delayedCall(this.config.castTime, () => {
            //Check circle hit
            const hit = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                centerX,
                centerY,
            ) <= (this.config.range + this.player.hurtboxRadius)

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined

            //Draw first donut telegraph
            this.telegraph = new DonutTelegraph(
                this.scene,
                centerX,
                centerY,
                this.config.range,
                this.config.range + this.config.width,
            )

            this.scene.time.delayedCall(800, () => {
                this.telegraph?.destroy()
                this.telegraph = undefined

                //Check first donut hit
                if (!this.boss || this.boss.health <= 0 ||!this.active) return

                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    centerX,
                    centerY,
                )

                if (dist >= this.config.range - this.player.hurtboxRadius && dist <= (this.config.range + this.config.width + this.player.hurtboxRadius)) {
                    this.player.takeDamage(this.config.damage)
                }

                //Draw second donut telegraph
                this.telegraph = new DonutTelegraph(
                    this.scene,
                    centerX,
                    centerY,
                    this.config.range + this.config.width,
                    this.config.range + this.config.width * 2
                )

                this.scene.time.delayedCall(800, () => {
                    this.telegraph?.destroy()
                    this.telegraph = undefined

                    //Check second donut hit
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return
                
                    const dist = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        centerX,
                        centerY,
                    )
    
                    if (dist >= this.config.range + this.config.width - this.player.hurtboxRadius && dist <= (this.config.range + this.config.width*2 + this.player.hurtboxRadius)) {
                        this.player.takeDamage(this.config.damage)
                    }
                })
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}