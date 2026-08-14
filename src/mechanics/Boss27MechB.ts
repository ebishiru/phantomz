import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss27MechB extends BossMechanic {

    config = {
        id: "boss-teleport-circle-cone",
        name: "Blade Tempest",
        castTime: 1300,
        castDuration: 1800,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 175,
        width: 0,
    }

    coneAngle: number = Math.PI * 5 / 6
    coneDirection: number = 0

    onCastStart() {
        //Randomize cone direction
        this.coneDirection = Phaser.Math.FloatBetween(-Math.PI, Math.PI)

        //Move boss to player location
        this.scene.tweens.add({
            targets: this.boss,
            x: this.player.x,
            y: this.player.y,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                //Draw Circle Telegraph
                this.telegraph = new CircleTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.config.range
                )

                //Draw indicator
                this.indicator = new DirectionIndicator(
                    this.scene,
                    this.boss,
                    this.coneDirection,
                    15
                )
            }
        })
    }

    execute() {
        //Check circle hit
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraph?.destroy()
        this.telegraph = undefined

        this.scene.time.delayedCall(200, () => {
            this.indicator?.destroy()
            this.indicator = undefined

            //Draw cone telegraph
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.coneDirection,
                this.config.range * 3,
                this.coneAngle
            )

            this.scene.time.delayedCall(300, () => {
                //Check cone hit
                let hit = false

                const dist = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )
                if (dist <= this.config.range * 3 + this.player.hurtboxRadius) {

                    const angleToPlayer = Phaser.Math.Angle.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )

                    const angleDiff = Phaser.Math.Angle.Wrap(
                        angleToPlayer - this.coneDirection
                    )

                    if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                        hit = true
                    }
                }

                if (hit) {
                    this.player.takeDamage(this.config.damage)
                }

                this.telegraph?.destroy()
                this.telegraph = undefined
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.indicator?.destroy()
        this.indicator = undefined
    }
}