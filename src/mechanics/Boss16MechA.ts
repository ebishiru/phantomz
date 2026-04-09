import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss16MechA extends BossMechanic {

    config = {
        id: "zig-zag-boss-player",
        name: "Savage Dash",
        castTime: 1200,
        castDuration: 1200,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 120,
    }

    startX: number = 0
    startY: number = 0
    targetX: number = 0
    targetY: number = 0

    onCastStart() {
        this.startX = this.boss.x
        this.startY = this.boss.y

        this.targetX = this.player.x
        this.targetY = this.player.y
    }

    execute() {
        // Direction to locked target
        const dx = this.targetX - this.startX
        const dy = this.targetY - this.startY
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Normalize
        const dirX = dx / dist
        const dirY = dy / dist

        // Perpendicular for zig-zag
        const perpX = -dirY
        const perpY = dirX

        const offset = dist * 0.4

        // Points (FORCED final = player initial)
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

        // Angles derived from points
        const angle1 = Phaser.Math.Angle.Between(this.startX, this.startY, point1.x, point1.y)
        const angle2 = Phaser.Math.Angle.Between(point1.x, point1.y, point2.x, point2.y)
        const angle3 = Phaser.Math.Angle.Between(point2.x, point2.y, point3.x, point3.y)

        //Draw telegraph 1
        this.telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle1,
            dashDistance,
            this.config.width
        )

        //Move boss
        this.scene.tweens.add({
            targets: this.boss,
            x: point1.x,
            y: point1.y,
            duration: 200,
            onComplete: () => {
                this.checkHit(this.startX, this.startY, point1.x, point1.y)

                this.telegraph?.destroy()
                this.telegraph = undefined

                this.telegraph = new LineTelegraph(
                    this.scene,
                    point1.x,
                    point1.y,
                    angle2,
                    dashDistance,
                    this.config.width
                )

                this.scene.tweens.add({
                    targets: this.boss,
                    x: point2.x,
                    y: point2.y,
                    duration: 200,
                    onComplete: () => {
                        this.checkHit(point1.x, point1.y, point2.x, point2.y)

                        this.telegraph?.destroy()
                        this.telegraph = undefined

                        this.telegraph = new LineTelegraph(
                            this.scene,
                            point2.x,
                            point2.y,
                            angle3,
                            dashDistance,
                            this.config.width
                        )

                        this.scene.tweens.add({
                            targets: this.boss,
                            x: point3.x,
                            y: point3.y,
                            duration: 200,
                            onComplete: () => {
                                this.checkHit(point2.x, point2.y, point3.x, point3.y)

                                this.telegraph?.destroy()
                                this.telegraph = undefined
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

    getDistance(x1: number, y1: number, x2: number, y2: number) {
        return Phaser.Math.Distance.Between(x1, y1, x2, y2)
    }

    checkHit(startX: number, startY: number, endX: number, endY: number) {
        const px = this.player.x
        const py = this.player.y

        const dx = endX - startX
        const dy = endY - startY

        const lengthSq = dx * dx + dy * dy

        // Projection factor (0 → 1 along the segment)
        let t = ((px - startX) * dx + (py - startY) * dy) / lengthSq
        t = Phaser.Math.Clamp(t, 0, 1)

        // Closest point on the segment
        const closestX = startX + t * dx
        const closestY = startY + t * dy

        // Distance to player
        const dist = Phaser.Math.Distance.Between(px, py, closestX, closestY)

        if (dist <= this.config.width / 2) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}