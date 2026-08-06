import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss26MechB extends BossMechanic {

    config = {
        id: "line-dash-boss-circle-donut",
        name: "Hellpound",
        castTime: 1000,
        castDuration: 2700,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 110,
        width: 110,
    }

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        //Draw Line Telegraph
        this.telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            dist,
            this.config.width
        )
    }

    execute() {
        //Check line hit
        const angle = this.telegraph.angle
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = startX + Math.cos(angle) * this.config.range
        const endY = startY + Math.sin(angle) * this.config.range

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
        const closestX = startX + t * (endX - startX);
        const closestY = startY + t * (endY - startY);

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);

        if (distanceToLine <= pr + this.config.width / 2) {
            this.player.takeDamage(this.config.damage);
        }

        this.telegraph?.destroy()
        this.telegraph = undefined

        //Boss moves to player location
        this.scene.tweens.add({
            targets: this.boss,
            x: this.player.x,
            y: this.player.y,
            duration: 300,
            onComplete: () => {
                //Draw Circle Telegraph
                this.telegraph = new CircleTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.config.range
                )

                //Check circle hit after delay
                this.scene.time.delayedCall((700), () => {
                    const dist = Phaser.Math.Distance.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )

                    if (dist <= (this.config.range + this.player.hurtboxRadius)) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.telegraph?.destroy()
                    this.telegraph = undefined

                    //Draw Donut Telegraph
                    this.telegraph = new DonutTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        this.config.range,
                        this.config.range + this.config.width + 20
                    )

                    //Check donut hit after another delay
                    this.scene.time.delayedCall(700, () => {

                        const donutDist = Phaser.Math.Distance.Between(
                            this.boss.x,
                            this.boss.y,
                            this.player.x,
                            this.player.y
                        )

                        if (donutDist >= this.config.range - this.player.hurtboxRadius &&
                            donutDist <= this.config.range + this.config.width + 20 + this.player.hurtboxRadius
                        ) {
                            this.player.takeDamage(this.config.damage)
                        }

                        this.telegraph?.destroy()
                        this.telegraph = undefined

                    })
                })
            }
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}