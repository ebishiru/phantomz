import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss25MechA extends BossMechanic {

    config = {
        id: "circles-random-enhanced",
        name: "Hellish Chase",
        castTime: 2600,
        castDuration: 2600,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 130,
        width: 0,
    }

    telegraphs: CircleTelegraph[] = []

    onCastStart() {
        const timings = [800, 1400, 2000, 2600]
        const telegraphDuration = 1000

        timings.forEach((time, index) => {
            const spawnTime = time - telegraphDuration
            
            this.scene.time.delayedCall(spawnTime, () => {
                if (!this.boss || this.boss.health <= 0 ||!this.active) return

                //First Meteor and last Meteor on player
                let x = this.player.x
                let y = this.player.y

                //Others randomly near player
                if (index !== 0 && index !== 3) {
                    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
                    const distance = Phaser.Math.Between(20, 100)

                    x += Math.cos(angle) * distance
                    y += Math.sin(angle) * distance
                }

                const telegraph = new CircleTelegraph(
                    this.scene,
                    x,
                    y,
                    this.config.range
                )

                this.telegraphs.push(telegraph)

                //Boss jumps to location
                this.scene.time.delayedCall(telegraphDuration - 300, () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return

                    this.scene.tweens.add({
                        targets: this.boss,
                        x: x,
                        y: y,
                        duration: 300,
                        ease: "Back.Out",
                        onComplete: () => {
                            //Hit Check
                            const hit = Phaser.Math.Distance.Between(
                                this.player.x,
                                this.player.y,
                                telegraph.x,
                                telegraph.y
                            ) <= (this.config.range + this.player.hurtboxRadius)

                            if (hit) {
                                this.player.takeDamage(this.config.damage)
                            }

                            telegraph?.destroy()
                        }

                    })
                })
            })
        })
    }

    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }
}