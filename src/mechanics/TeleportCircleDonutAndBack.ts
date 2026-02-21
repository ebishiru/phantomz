import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class TeleportCircleDonutAndBack extends BossMechanic {

    config = {
        id: "teleport-circle-donut-player",
        name: "Judgment of the Rift",
        castTime: 1500,
        castDuration: 2800,
        cooldown: 2800,
        showCastBar: true,
        damage: 20,
        range: 120,
        width: 0,
    }

    donutOuterRadius = this.config.range + 200
    lineWidth = 75

    angleBack: number = 0
    distanceBack: number = 0
    telegraphA?: CircleTelegraph
    telegraphB?: DonutTelegraph
    telegraphC?: LineTelegraph

    onCastStart() {
        const startX = this.boss.x
        const startY = this.boss.y
        const leapX = this.player.x
        const leapY = this.player.y

        //Spawn circle telegraph
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            this.telegraphA = new CircleTelegraph(
                this.scene,
                leapX,
                leapY,
                this.config.range
            )
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            this.scene.tweens.add({
                targets: this.boss,
                x: leapX,
                y: leapY,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    //Check circle telegraph hit
                    const dist = Phaser.Math.Distance.Between(
                        leapX,
                        leapY,
                        this.player.x,
                        this.player.y,
                    )

                    if (dist <= this.config.range + this.player.hurtboxRadius) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.telegraphA?.destroy()
                    this.telegraphA = undefined

                    //Spawn donut telegraph
                    this.telegraphB = new DonutTelegraph(
                        this.scene,
                        leapX,
                        leapY,
                        this.config.range,
                        this.donutOuterRadius
                    )
                }
            })

        })

        this.scene.time.delayedCall((this.config.castTime + 1000), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            //Check donut telegraph hit
            const dist = Phaser.Math.Distance.Between(
                leapX,
                leapY,
                this.player.x,
                this.player.y,
            )

            if (dist >= this.config.range - this.player.hurtboxRadius &&
                dist <= this.donutOuterRadius + this.player.hurtboxRadius) 
                {
                this.player.takeDamage(this.config.damage)
            }
            
            this.telegraphB?.destroy()
            this.telegraphB = undefined
        })

        this.scene.time.delayedCall((this.config.castTime + 1000), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            //Spawn and Check hit of rectangle telegraph and move boss
            this.angleBack = Phaser.Math.Angle.Between(
                leapX,
                leapY,
                startX,
                startY,
            )

            this.distanceBack = Phaser.Math.Distance.Between(
                leapX,
                leapY,
                startX,
                startY,
            )

            this.telegraphC = new LineTelegraph(
                this.scene,
                leapX,
                leapY,
                this.angleBack,
                this.distanceBack,
                this.lineWidth
            )

            this.scene.tweens.add({
                targets: this.boss,
                x: startX,
                y: startY,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    //Check hit of line telegraph
                    const startX = leapX   // dash start
                    const startY = leapY
                    const endX = this.boss.x   // dash end
                    const endY = this.boss.y

                    const px = this.player.x
                    const py = this.player.y
                    const pr = this.player.hurtboxRadius

                    const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY)
                    const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1)
                    const closestX = startX + t * (endX - startX)
                    const closestY = startY + t * (endY - startY)
                    const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY)

                    if (distanceToLine <= pr + this.lineWidth / 2) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.telegraphC?.destroy()
                    this.telegraphC = undefined
                }
            })
        })
    }
}