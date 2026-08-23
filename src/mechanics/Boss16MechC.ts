import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss16MechC extends BossMechanic {

    config = {
        id: "teleport-circle-donut-alternate",
        name: "Apex Rejuvenation",
        castTime: 1300,
        castDuration: 2900,
        cooldown: 2900,
        showCastBar: false,
        damage: 20,
        range: 100,
        width: 80,
    }

    donutTelegraphs: DonutTelegraph[] = []

    onCastStart() {
        //Boss jumps to center
        const bounds = this.scene.physics.world.bounds

        this.scene.tweens.add({
            targets: this.boss,
            x: bounds.x + bounds.width/2,
            y: bounds.y + bounds.height/2,
            duration: 200,
            ease: "Power2",
            onComplete: () => {
                //Draw Circle telegraph
                this.telegraph = new CircleTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.config.range
                )

                //Draw middle Donut telegraph
                const midDonut = new DonutTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.config.range + this.config.width,
                    this.config.range + this.config.width * 2
                )
                this.donutTelegraphs.push(midDonut)

                this.scene.time.delayedCall(800, () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return

                    this.boss.heal(this.config.damage/4)

                    let hit = false

                    const dist = Phaser.Math.Distance.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y,
                    )
                    
                    //Check hit for circle and mid donut
                    if (this.circleHitCheck(dist, this.telegraph.radius)) {
                        hit = true
                    }
                    else if (this.donutTelegraphs.some(t => this.donutHitCheck(dist, t.innerRadius, t.outerRadius))) {
                        hit = true
                    }

                    if (hit) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.telegraph?.destroy()
                    this.telegraph = undefined
                    this.donutTelegraphs.forEach(t => t.destroy())
                    this.donutTelegraphs = []

                    //Draw inner & outer donut telegraphs
                    const innerDonut = new DonutTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        this.config.range,
                        this.config.range + this.config.width
                    )
                    this.donutTelegraphs.push(innerDonut)

                    const outerDonut = new DonutTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        this.config.range + this.config.width * 2,
                        this.config.range + this.config.width * 3,
                    )
                    this.donutTelegraphs.push(outerDonut)

                    this.scene.time.delayedCall(800, () => {
                        if (!this.boss || this.boss.health <= 0 ||!this.active) return

                        let hit = false

                        const dist = Phaser.Math.Distance.Between(
                            this.boss.x,
                            this.boss.y,
                            this.player.x,
                            this.player.y,
                        )

                        //Check hit for donuts
                        if (this.donutTelegraphs.some(t => this.donutHitCheck(dist, t.innerRadius, t.outerRadius))) {
                            hit = true
                        }
                        
                        if (hit) {
                            this.player.takeDamage(this.config.damage)
                        }
                        
                        this.donutTelegraphs.forEach(t => t.destroy())
                        this.donutTelegraphs = []

                        //Draw initial circle and mid donut telegraphs again
                        this.telegraph = new CircleTelegraph(
                            this.scene,
                            this.boss.x,
                            this.boss.y,
                            this.config.range
                        )

                        const midDonut = new DonutTelegraph(
                            this.scene,
                            this.boss.x,
                            this.boss.y,
                            this.config.range + this.config.width,
                            this.config.range + this.config.width * 2
                        )
                        this.donutTelegraphs.push(midDonut)

                        this.scene.time.delayedCall(800, () => {
                            if (!this.boss || this.boss.health <= 0 ||!this.active) return

                            //Final hit check again
                            let hit = false

                            const dist = Phaser.Math.Distance.Between(
                                this.boss.x,
                                this.boss.y,
                                this.player.x,
                                this.player.y,
                            )

                            if (this.circleHitCheck(dist, this.telegraph.radius)) {
                                hit = true
                            }
                            else if (this.donutTelegraphs.some(t => this.donutHitCheck(dist, t.innerRadius, t.outerRadius))) {
                                hit = true
                            }

                            if (hit) {
                                this.player.takeDamage(this.config.damage)
                            }

                            this.telegraph?.destroy()
                            this.telegraph = undefined
                            this.donutTelegraphs.forEach(t => t.destroy())
                            this.donutTelegraphs = []
                        })
                    })
                })
            }
        })
    }

    circleHitCheck(dist: number, radius: number) {
        return (dist <= (radius + this.player.hurtboxRadius))
    }

    donutHitCheck(dist: number, innerRadius: number, outerRadius: number) {
        return (dist >= innerRadius - this.player.hurtboxRadius &&
            dist <= outerRadius + this.player.hurtboxRadius
        )
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.donutTelegraphs.forEach(t => t.destroy())
        this.donutTelegraphs = []
    }

}