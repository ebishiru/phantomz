import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss7MechC extends BossMechanic {

    config = {
        id: "teleport-clockwise-cones",
        name: "Requiem of Resonance",
        castTime: 1300,
        castDuration: 2500,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 450,
        width: 0,
    }

    coneAngle = Math.PI / 3

    currentAngle: number = 0
    
    rotationStep = Math.PI / 3
    totalExplosions = 6
    rotationInterval = 200

    onCastStart() {
        //Teleport to middle
        const bounds = this.scene.physics.world.bounds

        this.boss.body?.stop()

        this.scene.tweens.add({
            targets: this.boss,
            x: bounds.centerX,
            y: bounds.centerY,
            duration: 200,
            ease: "Sine.easeInOut",
            onComplete: () => {
                //Random angle
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

                this.scene.time.delayedCall(1100, () => {
                    container.destroy()
                })
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