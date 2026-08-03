import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss23MechB extends BossMechanic {

    config = {
        id: "teleport-spin-cone-quadrant",
        name: "360 Extermination",
        castTime: 1300,
        castDuration: 2500,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI / 2

    currentAngle: number = 0

    rotationStep = Math.PI / 2
    totalExplosions = 4
    rotationInterval = 300
    rotationDirection: string = "Clockwork"

    onCastStart() {
        //Randomize clockwise or counterclockwise
        const directions = ["Clockwork", "Reverse"]
        this.rotationDirection = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `360 ${this.rotationDirection} Extermination`

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

            if (this.rotationDirection === "Clockwork") {
                this.currentAngle = Phaser.Math.Angle.Wrap(this.currentAngle + this.rotationStep)
            } else if (this.rotationDirection === "Reverse") {
                this.currentAngle = Phaser.Math.Angle.Wrap(this.currentAngle - this.rotationStep)
            }

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