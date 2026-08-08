import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss30MechB extends BossMechanic {

    config = {
        id: "circles-last-donut-indicators-only",
        name: "Final Rites",
        castTime: 800,
        castDuration: 2900,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 150,
        width: 0,
    }

    innerRadius: number = 60
    outerRadius: number = 600

    indicators: WallIndicator[] = []

    selectedPositions: {x: number, y: number}[] = []
    bounds = this.scene.physics.world.bounds
    positions = [
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 1/8 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 1/8 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 7/8 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 7/8 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 1/2 , y: this.bounds.y + this.bounds.height * 1/2 }
    ]

    telegraphs: (CircleTelegraph | DonutTelegraph)[] = []

    onCastStart() {
        //Choose 4 random positions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.positions])
        this.selectedPositions = [shuffled[0], shuffled[1], shuffled[2], shuffled[3]]

        //Create indicators
        this.selectedPositions.forEach((pos, index) => {
            this.scene.time.delayedCall((index+1)*200, () => {
                const indicator = new WallIndicator(
                    this.scene,
                    pos.x,
                    pos.y,
                    Math.PI / 2,
                    15
                )
                this.indicators.push(indicator)
            })
        })

        const timings = [1600, 2000, 2400, 2900]
        const maxIndex = timings.length - 1

        timings.forEach((time, index) => {

            if (index !== maxIndex) {
                this.scene.time.delayedCall(time - 200, () => {
                    //Remove indicator
                    this.indicators[index].destroy()

                    //Spawn circle telegraph
                    const telegraph = new CircleTelegraph(
                        this.scene,
                        this.selectedPositions[index].x,
                        this.selectedPositions[index].y,
                        this.config.range
                    )
                    this.telegraphs.push(telegraph)

                    this.scene.time.delayedCall(200, () => {
                        //Check hit
                        const dist = Phaser.Math.Distance.Between(
                            telegraph.x,
                            telegraph.y,
                            this.player.x,
                            this.player.y
                        )

                        if (dist <= this.config.range + this.player.hurtboxRadius) {
                            this.player.takeDamage(this.config.damage)
                        }

                        //Remove telegraph
                        telegraph?.destroy()
                    })
                })
            }

            else if (index === maxIndex) {
                this.scene.time.delayedCall(time - 300, () => {
                    //Remove indicator
                    this.indicators[index].destroy()

                    //Spawn donut telegraph
                    const telegraph = new DonutTelegraph(
                        this.scene,
                        this.selectedPositions[maxIndex].x,
                        this.selectedPositions[maxIndex].y,
                        this.innerRadius,
                        this.outerRadius
                    )
                    this.telegraphs.push(telegraph)

                    this.scene.time.delayedCall(300, () => {
                        //Check donut hit
                        const dist = Phaser.Math.Distance.Between(
                            telegraph.x,
                            telegraph.y,
                            this.player.x,
                            this.player.y
                        )

                        if (dist >= this.innerRadius - this.player.hurtboxRadius &&
                            dist <= this.outerRadius + this.player.hurtboxRadius) {
                                this.player.takeDamage(this.config.damage)
                            }
                        
                            telegraph?.destroy()

                            //Ensure all is cleaned up
                            this.indicators.forEach(i => i.destroy())
                            this.indicators = []
                            this.telegraphs.forEach(t => t.destroy())
                            this.telegraphs = []
                    })
                })
            }
        })
    }

    destroy() {
        this.indicators.forEach(i => i.destroy())
        this.indicators = []
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }
}