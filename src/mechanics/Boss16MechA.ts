import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss16MechA extends BossMechanic {

    config = {
        id: "jump-dash-jump-dash",
        name: "Savage Dash",
        castTime: 1000,
        castDuration: 2100,
        cooldown: 2200,
        showCastBar: false,
        damage: 20,
        range: 90,
        width: 120,
    }

    positions: {x: number, y: number}[] = []

    onCastStart() {
        const bounds = this.scene.physics.world.bounds
        this.positions = [
            { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 1/4 },
            { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 1/4 },
            { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 3/4 },
            { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 3/4 }
        ]
        //Randomize jump points
        const firstJump = this.positions[Phaser.Math.Between(0, 3)]
        const secondJump = this.positions[Phaser.Math.Between(0, 3)]

        //Boss jumps to point 1
        this.scene.add.tween({
            targets: this.boss,
            x: firstJump.x,
            y: firstJump.y,
            duration: 300,
            ease: "Sine.easeInOut",
            onComplete: () => {
                const angle = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y,
                )
                const distance = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y,
                )

                //Draw line telegraph to player
                this.telegraph = new LineTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    angle,
                    distance + 100,
                    this.config.width
                )

                //Boss jumps across line
                this.scene.time.delayedCall(500, () => {
                    this.scene.add.tween({
                        targets: this.boss,
                        x: this.telegraph.x + Math.cos(angle) * (distance + 100),
                        y: this.telegraph.y + Math.sin(angle) * (distance + 100),
                        duration: 200,
                        ease: "Power2",
                        onComplete: () => {
                            //Hit check
                            if (this.hitCheck(this.telegraph.x, this.telegraph.y, angle, distance + 100)) {
                                this.player.takeDamage(this.config.damage)
                            }

                            this.telegraph?.destroy()
                            this.telegraph = undefined

                            this.scene.time.delayedCall(100, () => {
                                //Boss jumps to second point
                                this.scene.add.tween({
                                    targets: this.boss,
                                    x: secondJump.x,
                                    y: secondJump.y,
                                    duration: 300,
                                    ease: "Sine.easeInOut",
                                    onComplete: () => {
                                        const angle = Phaser.Math.Angle.Between(
                                            this.boss.x,
                                            this.boss.y,
                                            this.player.x,
                                            this.player.y,
                                        )
                                        const distance = Phaser.Math.Distance.Between(
                                            this.boss.x,
                                            this.boss.y,
                                            this.player.x,
                                            this.player.y,
                                        )

                                        //Draw second line telegraph to player
                                        this.telegraph = new LineTelegraph(
                                            this.scene,
                                            this.boss.x,
                                            this.boss.y,
                                            angle,
                                            distance + 100,
                                            this.config.width
                                        )

                                        //Boss jumps across line
                                        this.scene.time.delayedCall(500, () => {
                                            this.scene.add.tween({
                                                targets: this.boss,
                                                x: this.telegraph.x + Math.cos(angle) * (distance + 100),
                                                y: this.telegraph.y + Math.sin(angle) * (distance + 100),
                                                duration: 200,
                                                ease: "Power2",
                                                onComplete: () => {
                                                    //Hit check
                                                    if (this.hitCheck(this.telegraph.x, this.telegraph.y, angle, distance + 100)) {
                                                        this.player.takeDamage(this.config.damage)
                                                    }

                                                    this.telegraph?.destroy()
                                                    this.telegraph = undefined
                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    }

    hitCheck(startX: number, startY: number, angle: number, dist: number) {
        const endX = startX + Math.cos(angle) * dist
        const endY = startY + Math.sin(angle) * dist

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
        const closestX = startX + t * (endX - startX);
        const closestY = startY + t * (endY - startY);

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);

        return (distanceToLine <= pr + this.config.width / 2)
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}