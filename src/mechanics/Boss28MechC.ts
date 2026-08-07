import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss28MechC extends BossMechanic {

    config = {
        id: "circle-player-teleport-lines-cardinal",
        name: "Orbital Implosion",
        castTime: 800,
        castDuration: 1600,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 110,
        width: 110,
    }

    telegraphs: LineTelegraph[] = []
    lineTelegraphAngles: number[] = [0, Math.PI / 4, Math.PI / 2, Math.PI * 3/4, Math.PI, Math.PI * 5/4, Math.PI * 3/2, Math.PI * 7/4]
    angleMod: number = 0

    onCastStart() {
        //Draw circle telegraph on player
        this.telegraph = new CircleTelegraph(
            this.scene,
            this.player.x,
            this.player.y,
            this.config.range
        )

        //Snapshot location
        const endX = this.player.x
        const endY = this.player.y

        //Teleport boss
        this.scene.time.delayedCall(600, () => {
            this.scene.tweens.add({
                targets: this.boss,
                x: endX,
                y: endY,
                duration: 200,
                ease: "Power2",
                onComplete: () => {
                    //Check circle hit
                    const dist = Phaser.Math.Distance.Between(
                        endX,
                        endY,
                        this.player.x,
                        this.player.y
                    )

                    if (dist <= this.config.range + this.player.hurtboxRadius) {
                        this.player.takeDamage(this.config.damage)
                    }

                    //Remove telegraph
                    this.telegraph?.destroy()
                    this.telegraph = undefined

                    //Fire additional line telegraphs
                    this.angleMod = Phaser.Math.FloatBetween(0, Math.PI / 4)

                    this.lineTelegraphAngles.forEach(lineAngle => {
                        const telegraph = new LineTelegraph(
                            this.scene,
                            endX,
                            endY,
                            lineAngle + this.angleMod,
                            this.config.width * 5,
                            this.config.width
                        )

                        this.telegraphs.push(telegraph)
                    })

                    this.scene.time.delayedCall(800, () => {
                        //Check hits of line telegraphs
                        let hit = false

                        this.telegraphs.forEach(telegraph => {
                            const lineStartX = endX
                            const lineStartY = endY
                            const lineEndX = telegraph.x + Math.cos(telegraph.angle) * telegraph.length
                            const lineEndY = telegraph.y + Math.sin(telegraph.angle) * telegraph.length

                            const px = this.player.x
                            const py = this.player.y
                            const pr = this.player.hurtboxRadius
                    
                            const lineLen = Phaser.Math.Distance.Between(lineStartX, lineStartY, lineEndX, lineEndY);
                            const t = Phaser.Math.Clamp(((px - lineStartX) * (lineEndX - lineStartX) + (py - lineStartY) * (lineEndY - lineStartY)) / (lineLen * lineLen), 0, 1);
                            const closestX = lineStartX + t * (lineEndX - lineStartX);
                            const closestY = lineStartY + t * (lineEndY - lineStartY);
                    
                            const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);
                    
                            if (distanceToLine <= pr + this.config.width / 2) {
                                hit = true
                            }

                            telegraph?.destroy()
                        })

                        if (hit) {
                            this.player.takeDamage(this.config.damage)
                        }

                        this.telegraphs.forEach( t => t.destroy())
                        this.telegraphs = []
                    })

                }
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.telegraphs.forEach( t => t.destroy())
        this.telegraphs = []
    }
}