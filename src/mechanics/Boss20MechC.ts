import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import LineTelegraph from "../entities/LineTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss20MechC extends BossMechanic {

    config = {
        id: "teleport-circle-dash-thrice",
        name: "Final Stand",
        castTime: 1700,
        castDuration: 3000,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 150,
        width: 90,
    }

    indicators: WallIndicator[] = []
    selectedPositions: {x: number, y: number}[] = []
    positions = [
        {x: 320, y: 170 },
        {x: 320, y: 370 },
        {x: 640, y: 170 },
        {x: 640, y: 370 },
    ]
    lineTelegraph?: LineTelegraph
    lineAngle: number = 0
    lineDist: number = 0
    circleTelegraph?: CircleTelegraph

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        //Choose 3 random positions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.positions])
        this.selectedPositions = [shuffled[0], shuffled[1], shuffled[2]]
        const [pos1, pos2, pos3] = this.selectedPositions

        //Create indicators
        this.indicators.push(
            new WallIndicator(this.scene, pos1.x, pos1.y, Math.PI / 2, 10)
        )

        this.scene.time.delayedCall(500, () => {
            this.indicators.push(
                new WallIndicator(this.scene, pos2.x, pos2.y, Math.PI / 2, 10)
            )
        })

        this.scene.time.delayedCall(1000, () => {
            this.indicators.push(
                new WallIndicator(this.scene, pos3.x, pos3.y, Math.PI / 2, 10)
            )
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            //Remove indicators
            this.indicators.forEach( i => i.destroy())
            this.indicators = []
        })
    }

    execute() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const [pos1, pos2, pos3] = this.selectedPositions

        //Remove indicators (backup)
        this.indicators.forEach( i => i.destroy())
        this.indicators = []

        //Create Dash telegraph to pos1
        this.createLineTelegraph(this.boss.x, this.boss.y, pos1.x, pos1.y)

        this.scene.tweens.add({
            targets: this.boss,
            x: pos1.x,
            y: pos1.y,
            duration: 250,
            ease: "Power2",
            onComplete: () => {
                //Check hit of line telegraph
                this.lineHitCheck(this.boss.x, this.boss.y, pos1.x, pos1.y)
                
                //Create circle telegraph
                this.circleTelegraph = new CircleTelegraph(
                    this.scene,
                    pos1.x,
                    pos1.y,
                    this.config.range
                ) 

                this.scene.time.delayedCall(250, () => {
                    //Circle hit check
                    this.circleHitCheck(pos1.x, pos1.y)

                    //Create line telegraph 2
                    this.createLineTelegraph(this.boss.x, this.boss.y, pos2.x, pos2.y)

                    //Repeat mechanics to pos2
                    this.scene.tweens.add({
                        targets: this.boss,
                        x: pos2.x,
                        y: pos2.y,
                        duration: 250,
                        ease: "Power2",
                        onComplete: () => {
                            //Check line telegraph hit
                            this.lineHitCheck(this.boss.x, this.boss.y, pos2.x, pos2.y)

                            //Create circle telegraph
                            this.circleTelegraph = new CircleTelegraph(
                                this.scene,
                                pos2.x,
                                pos2.y,
                                this.config.range,
                            )

                            this.scene.time.delayedCall(250, () => {
                                //Circle hitcheck
                                this.circleHitCheck(pos2.x, pos2.y)

                                //Create line telegraph 3
                                this.createLineTelegraph(this.boss.x, this.boss.y, pos3.x, pos3.y)

                                //Repeat mechanics to pos3
                                this.scene.tweens.add({
                                    targets: this.boss,
                                    x: pos3.x,
                                    y: pos3.y,
                                    duration: 250,
                                    ease: "Power2",
                                    onComplete: () => {
                                        //Check line telegraph hit
                                        this.lineHitCheck(this.boss.x, this.boss.y, pos3.x, pos3.y)


                                        //Create circle telegraph
                                        this.circleTelegraph = new CircleTelegraph(
                                            this.scene,
                                            pos3.x,
                                            pos3.y,
                                            this.config.range,
                                        )
                                        
                                        this.scene.time.delayedCall(250, () => {
                                            //Circle hitcheck
                                            this.circleHitCheck(pos3.x, pos3.y)
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

    createLineTelegraph(startX: number, startY: number, endX: number, endY: number) {
        const angle = Phaser.Math.Angle.Between(
            startX,
            startY,
            endX,
            endY,
        )

        const distance = Phaser.Math.Distance.Between(
            startX,
            startY,
            endX,
            endY,
        )

        this.lineTelegraph = new LineTelegraph(
            this.scene,
            startX,
            startY,
            angle,
            distance,
            this.config.width
        )
    }

    lineHitCheck(startX: number, startY: number, endX: number, endY: number) {
        if (!this.boss || this.boss.health <= 0 || !this.active) return
        
        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY)
        const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1)
        const closestX = startX + t * (endX - startX)
        const closestY = startY + t * (endY - startY)
        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY)

        if (distanceToLine <= pr + this.config.width / 2) {
            this.player.takeDamage(this.config.damage)
        }

        this.lineTelegraph?.destroy()
        this.lineTelegraph = undefined
    }

    circleHitCheck(centerX: number, centerY: number) {
        if (!this.boss || this.boss.health <= 0 || !this.active) return
        
        const dist = Phaser.Math.Distance.Between(
            centerX,
            centerY,
            this.player.x,
            this.player.y,
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {
            this.player.takeDamage(this.config.damage)
        }

        this.circleTelegraph?.destroy()
        this.circleTelegraph = undefined
    }

    destroy() {
        this.indicators.forEach( i => i.destroy())
        this.indicators = []
        this.selectedPositions = []
        this.lineTelegraph?.destroy()
        this.lineTelegraph = undefined
        this.circleTelegraph?.destroy()
        this.circleTelegraph = undefined
    }
}