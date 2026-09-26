import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss23MechB extends BossMechanic {

    config = {
        id: "teleport-spin-cone-quadrant",
        name: "360 Clockwork Sweep",
        castTime: 1300,
        castDuration: 2300,
        cooldown: 3000,
        showCastBar: true,
        damage: 15,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI / 2

    currentAngle: number = 0

    rotationStep = Math.PI / 2
    totalExplosions = 4
    rotationInterval = 250

    onCastStart() {
        //Teleport to middle
        const bounds = this.scene.physics.world.bounds

        this.scene.tweens.add({
            targets: this.boss,
            x: bounds.centerX,
            y: bounds.centerY,
            duration: 200,
            ease: "Sine.easeInOut",
            onComplete: () => {
                //Randomize angle
                this.currentAngle = Phaser.Math.FloatBetween(-Math.PI, Math.PI)

                //First telegraph
                this.telegraph = new ConeTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.currentAngle,
                    this.config.range,
                    this.coneAngle
                )

                //Clockwise icon
                const container = this.scene.add.container(this.boss.x, this.boss.y)

                const follow = () => {
                    container.x = this.boss.x
                    container.y = this.boss.y
                }

                this.scene.events.on("update", follow)

                const clockwiseIcon = this.scene.add.sprite(0, -40, "clockwise-icon")

                clockwiseIcon.setOrigin(0.5, 0.5)
                clockwiseIcon.setScale(1.5)
                clockwiseIcon.setDepth(20)
                container.add(clockwiseIcon)

                this.scene.time.delayedCall(this.config.castTime - 200, () => container.destroy())
            }
        })
    }

    execute() {
        let explosions = 0

        const explode = () => {
            if (!this.active || !this.boss) return

            this.telegraph?.destroy()
            this.telegraph = undefined

            this.checkHit(this.currentAngle)

            explosions++
            if (explosions >= this.totalExplosions) return

            this.currentAngle = Phaser.Math.Angle.Wrap(this.currentAngle + this.rotationStep)

            //Draw next telegraph
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.currentAngle,
                this.config.range,
                this.coneAngle
            )

            this.scene.time.delayedCall(this.rotationInterval, explode)
        }

        explode()
    }

    checkHit = (coneAngle: number) => {
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        if (dist > this.config.range + this.player.hurtboxRadius) return

        const angleToPlayer = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        const diff = Phaser.Math.Angle.Wrap(
            angleToPlayer - coneAngle
        )

        if (Math.abs(diff) <= this.coneAngle / 2) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}