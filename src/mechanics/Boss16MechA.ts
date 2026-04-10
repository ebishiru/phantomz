import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss16MechA extends BossMechanic {

    config = {
        id: "zig-zag-boss-player",
        name: "Savage Dash",
        castTime: 800,
        castDuration: 800,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 80,
        width: 120,
    }

    startX: number = 0
    startY: number = 0
    targetX: number = 0
    targetY: number = 0

    circleTelegraph?: CircleTelegraph

    onCastStart() {
        this.startX = this.boss.x
        this.startY = this.boss.y

        this.targetX = this.player.x
        this.targetY = this.player.y
    }

    execute() {
        const dx = this.targetX - this.startX
        const dy = this.targetY - this.startY
        const dist = Math.sqrt(dx * dx + dy * dy)

        const dirX = dx / dist
        const dirY = dy / dist

        const perpX = -dirY
        const perpY = dirX

        const offset = dist * 0.3
        const EXTEND = Math.min(60, dist * 0.15)

        const point1 = {
            x: this.startX + dirX * dist * 0.33 + perpX * offset,
            y: this.startY + dirY * dist * 0.33 + perpY * offset
        }

        const point2 = {
            x: this.startX + dirX * dist * 0.66 - perpX * offset,
            y: this.startY + dirY * dist * 0.66 - perpY * offset
        }

        const point3 = {
            x: this.targetX,
            y: this.targetY
        }

        const angle1 = Phaser.Math.Angle.Between(this.startX, this.startY, point1.x, point1.y)
        const angle2 = Phaser.Math.Angle.Between(point1.x, point1.y, point2.x, point2.y)
        const angle3 = Phaser.Math.Angle.Between(point2.x, point2.y, point3.x, point3.y)

        const dash1Dist = Phaser.Math.Distance.Between(this.startX, this.startY, point1.x, point1.y)
        const dash2Dist = Phaser.Math.Distance.Between(point1.x, point1.y, point2.x, point2.y)
        const dash3Dist = Phaser.Math.Distance.Between(point2.x, point2.y, point3.x, point3.y)

        // === DASH 1 ===
        this.telegraph = new LineTelegraph(
            this.scene,
            this.startX,
            this.startY,
            angle1,
            dash1Dist + EXTEND,
            this.config.width
        )

        this.scene.tweens.add({
            targets: this.boss,
            x: point1.x,
            y: point1.y,
            duration: 200,
            onComplete: () => {

                const hitEnd1 = this.getPointFromAngle(
                    this.startX,
                    this.startY,
                    angle1,
                    dash1Dist + EXTEND
                )

                this.checkHit(this.startX, this.startY, hitEnd1.x, hitEnd1.y)

                this.telegraph?.destroy()
                this.telegraph = undefined

                // === DASH 2 ===
                this.telegraph = new LineTelegraph(
                    this.scene,
                    point1.x,
                    point1.y,
                    angle2,
                    dash2Dist + EXTEND,
                    this.config.width
                )

                this.scene.tweens.add({
                    targets: this.boss,
                    x: point2.x,
                    y: point2.y,
                    duration: 200,
                    onComplete: () => {

                        const hitEnd2 = this.getPointFromAngle(
                            point1.x,
                            point1.y,
                            angle2,
                            dash2Dist + EXTEND
                        )

                        this.checkHit(point1.x, point1.y, hitEnd2.x, hitEnd2.y)

                        this.telegraph?.destroy()
                        this.telegraph = undefined

                        // CIRCLE TELEGRAPH AT FINAL POINT
                        this.circleTelegraph?.destroy()

                        this.circleTelegraph = new CircleTelegraph(
                            this.scene,
                            point3.x,
                            point3.y,
                            this.config.range
                        )

                        // === DASH 3 ===
                        this.telegraph = new LineTelegraph(
                            this.scene,
                            point2.x,
                            point2.y,
                            angle3,
                            dash3Dist + EXTEND,
                            this.config.width
                        )

                        this.scene.tweens.add({
                            targets: this.boss,
                            x: point3.x,
                            y: point3.y,
                            duration: 200,
                            onComplete: () => {

                                const hitEnd3 = this.getPointFromAngle(
                                    point2.x,
                                    point2.y,
                                    angle3,
                                    dash3Dist + EXTEND
                                )

                                this.checkHit(point2.x, point2.y, hitEnd3.x, hitEnd3.y)

                                this.telegraph?.destroy()
                                this.telegraph = undefined

                                this.circleTelegraph?.destroy()
                                this.circleTelegraph = undefined
                            }
                        })
                    }
                })
            }
        })
    }

    getPointFromAngle(x: number, y: number, angle: number, distance: number) {
        return {
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance
        }
    }

    checkHit(startX: number, startY: number, endX: number, endY: number) {
        const px = this.player.x
        const py = this.player.y

        const dx = endX - startX
        const dy = endY - startY

        const lengthSq = dx * dx + dy * dy

        let t = ((px - startX) * dx + (py - startY) * dy) / lengthSq
        t = Phaser.Math.Clamp(t, 0, 1)

        const closestX = startX + t * dx
        const closestY = startY + t * dy

        const dist = Phaser.Math.Distance.Between(px, py, closestX, closestY)

        if (dist <= this.config.width / 2) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.circleTelegraph?.destroy()

        this.telegraph = undefined
        this.circleTelegraph = undefined
    }
}