import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss29MechB extends BossMechanic {

    config = {
        id: "half-room-wide-vertical-teleport-cone",
        name: "Life and Death",
        castTime: 1200,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 500,
        width: 0,
    }

    coneAngle: number = Math.PI / 6

    onCastStart() {
        //Randomize sides
        const sides = ["Left", "Right"]
        const side = Phaser.Utils.Array.GetRandom(sides)

        const bounds = this.scene.physics.world.bounds
        let startingX = bounds.x

        if (side === "Left") {
            this.config.name = "Death and Life"
        } else if (side === "Right") {
            this.config.name = "Life and Death"
            startingX += bounds.width / 2
        }

        //Draw Rectangle telegraph
        this.scene.time.delayedCall(this.config.castTime - 500, () => {
            this.telegraph = new RectangleTelegraph(
                this.scene,
                startingX,
                bounds.y,
                bounds.width / 2,
                bounds.height
            )
        })

        //Boss teleports to death side
        this.scene.time.delayedCall(this.config.castTime - 300, () => {
            let jumpX = bounds.x
            const jumpY = bounds.y + bounds.height / 2
            if (side === "Left") {
                jumpX = bounds.x + bounds.width / 4
            } else if (side === "Right") {
                jumpX = bounds.x + bounds.width * 3/4
            }
            this.scene.tweens.add({
                targets: this.boss,
                x: jumpX,
                y: jumpY,
                duration: 300,
                ease: "ease-in-out",
                onComplete: () => {
                    //Rectangle Hit Check
                    const { x: rx, y: ry, width: rw, height: rh } = this.telegraph
                    const px = this.player.x
                    const py = this.player.y
                    const pr = this.player.hurtboxRadius

                    // Find closest point on rectangle to player
                    let closestX = px
                    if (px < rx) closestX = rx
                    else if (px > rx + rw) closestX = rx + rw

                    let closestY = py
                    if (py < ry) closestY = ry
                    else if (py > ry + rh) closestY = ry + rh

                    const dx = px - closestX
                    const dy = py - closestY

                    if (dx * dx + dy * dy <= pr * pr) {
                        this.player.takeDamage(this.config.damage)
                    }

                    this.telegraph.destroy()
                    this.telegraph = undefined

                    //Draw cone telegraph
                    const angleToPlayer = Phaser.Math.Angle.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )

                    this.telegraph = new ConeTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        angleToPlayer,
                        this.config.range,
                        this.coneAngle
                    )

                    this.scene.time.delayedCall(800, () => {
                        //Check cone hit

                        const coneDist = Phaser.Math.Distance.Between(
                            this.boss.x,
                            this.boss.y,
                            this.player.x,
                            this.player.y
                        )

                        if (coneDist <= this.config.range + this.player.hurtboxRadius) {

                            const coneAngleToPlayer = Phaser.Math.Angle.Between(
                                this.boss.x,
                                this.boss.y,
                                this.player.x,
                                this.player.y
                            )

                            const coneAngleDiff = Phaser.Math.Angle.Wrap(
                                coneAngleToPlayer - this.telegraph.angle
                            )

                            if (Math.abs(coneAngleDiff) <= this.coneAngle / 2) {
                                this.player.takeDamage(this.config.damage)
                            }

                            this.telegraph?.destroy()
                            this.telegraph = undefined
                        }

                    })
                }
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}