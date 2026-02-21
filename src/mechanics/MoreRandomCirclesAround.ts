import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class MoreRandomCirclesAround extends BossMechanic {

    config = {
        id: "more-circles-random",
        name: "Grand Meteor",
        castTime: 2600,
        castDuration: 2600,
        cooldown: 4000,
        showCastBar: false,
        damage: 20,
        range: 100,
        width: 0,
    }

    onCastStart() {
        const timings = [800, 1150, 1500, 1850, 2200, 2550, 2900]
        const telegraphDuration = 1000

        timings.forEach((time, index) => {
            const spawnTime = time - telegraphDuration

            this.scene.time.delayedCall(spawnTime, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                // First Meteor on player
                let x = this.player.x
                let y = this.player.y

                // Other meteors near player
                if (index !== 0) {
                    const angle = Phaser.Math.FloatBetween( 0, Math.PI * 2)
                    const distance = Phaser.Math.Between(40, 100)

                    x += Math.cos(angle) * distance
                    y += Math.sin(angle) * distance
                }

                const telegraph = new CircleTelegraph(
                    this.scene,
                    x,
                    y,
                    this.config.range
                )

                this.scene.time.delayedCall(telegraphDuration, () => {
                    if (!this.boss || this.boss.health <= 0 || !this.active) {
                        telegraph.destroy()
                        return
                    }

                    const hit = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        telegraph.x,
                        telegraph.y
                    ) <= (this.config.range + this.player.hurtboxRadius)

                    if (hit) {
                        this.player.takeDamage(this.config.damage)
                    }

                    telegraph.destroy()
                })
            })
        })
    }

    destroy() {
        this.active = false
    }
}