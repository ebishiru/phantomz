import Phaser from "phaser"
import Skill from "./Skill"

export default class ArrowSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player:any) {
        super(scene, player, "nexus", "Nexus", 10, 7000, 150)
        this.iconKey = "nexus-icon",
        this.player = player
    }

    numberOfShots: number = 5
    delayBetweenShots: number = 900

    activate() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const startX = this.player.x
        const startY = this.player.y

        //Spawn VFX
        const nexusVFX = this.scene.add.sprite(startX, startY, "nexus-vfx")
            .setOrigin(0.5)
            .setAlpha(1)
            .setScale(2.5)
            .setDepth(10)

        this.scene.tweens.add({
            targets: nexusVFX,
            alpha: 0.5,
            yoyo: true,
            duration: 500,
            loop: 4
        })

        //Fire VFX
        for (let i = 0; i < this.numberOfShots; i++) {
            this.scene.time.delayedCall(i*this.delayBetweenShots, () => {
                if (!nexusVFX || !nexusVFX.active || !boss || !boss.active) return
                const nexusShotVFX = this.scene.add.sprite(startX, startY - 5, "nexus2-vfx")
                    .setOrigin(0.5)
                    .setScale(2)
                    .setDepth(10)

                this.scene.tweens.add({
                    targets: nexusShotVFX,
                    x: boss.x,
                    y: boss.y,
                    duration: 150,
                    onComplete: () => {
                        if (!nexusShotVFX || !nexusShotVFX.active) return

                        if (!boss || !boss.active) {
                            nexusShotVFX.destroy()
                            if (nexusVFX && nexusVFX.active) {
                                nexusVFX.destroy()
                            }
                            return
                        }

                        if (!nexusVFX || !nexusVFX.active) {
                            nexusShotVFX.destroy()
                            return
                        }

                        boss.takeDamage(this.getDamage())
                        nexusShotVFX.destroy()

                        if (i === this.numberOfShots - 1 && nexusVFX && nexusVFX.active) {
                            nexusVFX.destroy()
                        }
                    }
                })
            })
        }

        //Ensures nexusVFX despawns after set time
        this.scene.time.delayedCall((this.numberOfShots - 1) * this.delayBetweenShots + 200, () => {
            if (nexusVFX && nexusVFX.active) {
                nexusVFX.destroy()
            }
        })

        const nexusRange = this.getRange()
        const graphics = this.scene.add.graphics().setDepth(9)

        const drawDashedLine = (
            graphics: Phaser.GameObjects.Graphics,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            dashLength = 8,
            gapLength = 6
        ) => {
            const dx = x2 - x1
            const dy = y2 - y1
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len === 0) return

            const nx = dx / len
            const ny = dy / len
            let distance = 0
            let draw = true
            let startX = x1
            let startY = y1

            while (distance < len) {
                const segmentLength = Math.min(draw ? dashLength : gapLength, len - distance)
                const endX = x1 + nx * (distance + segmentLength)
                const endY = y1 + ny * (distance + segmentLength)

                if (draw) {
                    graphics.beginPath()
                    graphics.moveTo(startX, startY)
                    graphics.lineTo(endX, endY)
                    graphics.strokePath()
                }

                startX = endX
                startY = endY
                distance += segmentLength
                draw = !draw
            }
        }

        const drawDashedCircle = (
            graphics: Phaser.GameObjects.Graphics,
            cx: number,
            cy: number,
            radius: number,
            dashLength = 10,
            gapLength = 6
        ) => {
            const circumference = 2 * Math.PI * radius
            const totalLength = dashLength + gapLength
            const segments = Math.max(1, Math.floor(circumference / totalLength))
            const angleStep = totalLength / radius
            let startAngle = 0

            for (let i = 0; i < segments; i++) {
                const endAngle = startAngle + dashLength / radius
                graphics.beginPath()
                graphics.arc(cx, cy, radius, startAngle, endAngle, false)
                graphics.strokePath()
                startAngle += angleStep
            }
        }

        const cleanup = () => {
            graphics.destroy()
            if (nexusVFX && nexusVFX.active) {
                nexusVFX.destroy()
            }
            this.scene.events.off("update", updateLine)
        }

        const updateLine = () => {
            if (!nexusVFX || !nexusVFX.active || !this.player.active) {
                cleanup()
                return
            }

            const dist = Phaser.Math.Distance.Between(nexusVFX.x, nexusVFX.y, this.player.x, this.player.y)
            if (dist > nexusRange) {
                cleanup()
                return
            }

            graphics.clear()

            graphics.lineStyle(1, 0xf0b38d, 1)
            drawDashedCircle(graphics, nexusVFX.x, nexusVFX.y, nexusRange)

            const color = dist <= (this.getRange() / 2) ? 0xf0b38d : 0xb56d7f
            graphics.lineStyle(2, color, 1)
            drawDashedLine(graphics, nexusVFX.x, nexusVFX.y, this.player.x, this.player.y)
        }

        this.scene.events.on("update", updateLine)
    }
}