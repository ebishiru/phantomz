import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss28MechA extends BossMechanic {

    config = {
        id: "teleport-line-expand-two-parallel",
        name: "Twin Beams",
        castTime: 1100,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 120,
    }

    telegraphDistance: number = 0
    telegraphAngle: number = 0
    telegraphs: LineTelegraph[] = []

    startX: number = 0
    startY: number = 0
    endX: number = 0
    endY: number = 0

    onCastStart() {
        //Boss Jumps to random spot
        const bounds = this.scene.physics.world.bounds

        this.scene.tweens.add({
            targets: this.boss,
            x: Phaser.Math.FloatBetween(bounds.x + 10, bounds.x + bounds.width - 10),
            y: Phaser.Math.FloatBetween(bounds.y + 10, bounds.y + bounds.height - 10),
            duration: 200,
            ease: "expo",
            onComplete: () => {

                const dist = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )
        
                this.telegraphDistance = dist * 3
                if (this.telegraphDistance < 200) {
                    this.telegraphDistance = 200
                }
                
                this.telegraphAngle = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )
        
                this.startX = this.boss.x
                this.startY = this.boss.y
                this.endX = this.startX + Math.cos(this.telegraphAngle) * this.telegraphDistance
                this.endY = this.startY + Math.sin(this.telegraphAngle) * this.telegraphDistance
        
                //Draw single line telegraph
                this.telegraph = new LineTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.telegraphAngle,
                    this.telegraphDistance,
                    this.config.width
                )
            }
        })
    }
    
    execute() {
        this.telegraph?.destroy()
        this.telegraph = undefined

        //Check first line hit
        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(this.startX, this.startY, this.endX, this.endY)
        const t = Phaser.Math.Clamp(((px - this.startX) * (this.endX - this.startX) + (py - this.startY) * (this.endY - this.startY)) / (lineLen * lineLen), 0, 1)
        const closestX = this.startX + t * (this.endX - this.startX)
        const closestY = this.startY + t * (this.endY - this.startY)

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY)

        if (distanceToLine <= pr + this.config.width / 2) {
            this.player.takeDamage(this.config.damage)
        }

        const offset = this.config.width
        const perpX = -Math.sin(this.telegraphAngle) * offset
        const perpY = Math.cos(this.telegraphAngle) * offset

        //Draw 2 parallel line telegraphs
        const parallelTelegraph1 = new LineTelegraph(
            this.scene,
            this.startX + perpX,
            this.startY + perpY,
            this.telegraphAngle,
            this.telegraphDistance,
            this.config.width
        )

        this.telegraphs.push(parallelTelegraph1)

        const parallelTelegraph2 = new LineTelegraph(
            this.scene,
            this.startX - perpX,
            this.startY - perpY,
            this.telegraphAngle,
            this.telegraphDistance,
            this.config.width
        )

        this.telegraphs.push(parallelTelegraph2)

        this.scene.time.delayedCall(900, () => {
            const playerX = this.player.x
            const playerY = this.player.y
            const playerRadius = this.player.hurtboxRadius

            const checkLineHit = (startX: number, startY: number, endX: number, endY: number) => {
                const lineLength = Phaser.Math.Distance.Between(startX, startY, endX, endY)
                if (lineLength === 0) return false

                const hitT = Phaser.Math.Clamp(
                    ((playerX - startX) * (endX - startX) + (playerY - startY) * (endY - startY)) / (lineLength * lineLength),
                    0,
                    1
                )

                const projectedX = startX + hitT * (endX - startX)
                const projectedY = startY + hitT * (endY - startY)
                const projectedDistance = Phaser.Math.Distance.Between(playerX, playerY, projectedX, projectedY)

                return projectedDistance <= playerRadius + this.config.width / 2
            }

            const hit = [
                {
                    startX: this.startX + perpX,
                    startY: this.startY + perpY,
                    endX: this.endX + perpX,
                    endY: this.endY + perpY,
                },
                {
                    startX: this.startX - perpX,
                    startY: this.startY - perpY,
                    endX: this.endX - perpX,
                    endY: this.endY - perpY,
                },
            ].some(line => checkLineHit(line.startX, line.startY, line.endX, line.endY))

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraphs.forEach(telegraph => telegraph?.destroy())
            this.telegraphs = []
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.telegraphs.forEach( t => t.destroy())
        this.telegraphs = []
    }
}