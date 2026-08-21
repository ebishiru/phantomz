import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss17MechA extends BossMechanic {

    config = {
        id: "triple-cone-stay-boss-player",
        name: "Putrid Trijectory",
        castTime: 1500,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI / 3
    telegraphs: ConeTelegraph[] = []

    onCastStart() {
        const bounds = this.scene.physics.world.bounds

        this.scene.tweens.add({
            targets: this.boss,
            x: bounds.centerX,
            y: bounds.centerY,
            duration: 200,
            ease: "Sine.easeInOut",
            onComplete: () => {
                const angleToPlayer = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y,
                )
                const offsets = [-Math.PI * 2 / 3, 0, Math.PI * 2 / 3]

                //Create first 3 conal telegraphs
                this.telegraphs = offsets.map(offset => {
                    return new ConeTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        angleToPlayer + offset,
                        this.config.range,
                        this.coneAngle
                    )
                })

                this.scene.time.delayedCall(1300, () => {
                    //First 3 cones hit
                    this.hitCheck()
                    this.telegraphs.forEach(telegraph => telegraph?.destroy())
                    this.telegraphs = []

                    const rotatedOffset = this.coneAngle

                    this.telegraphs = offsets.map(offset => {
                        return new ConeTelegraph(
                            this.scene,
                            this.boss.x,
                            this.boss.y,
                            angleToPlayer + offset + rotatedOffset,
                            this.config.range,
                            this.coneAngle
                        )
                    })

                    this.scene.time.delayedCall(800, () => {
                        //Second 3 cones hit
                        this.hitCheck()
                        this.telegraphs.forEach(telegraph => telegraph?.destroy())
                        this.telegraphs = []
                    })
                })
            }
        })
    }

    hitCheck() {
        let hit = false

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {

            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y
            )

            for (const telegraph of this.telegraphs) {
                const angleDiff = Phaser.Math.Angle.Wrap(
                    angleToPlayer - telegraph.angle
                )

                if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                    hit = true
                    break
                }
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraphs?.forEach(telegraph => telegraph?.destroy())
        this.telegraphs = []
    }
}