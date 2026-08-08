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
        range: 100,
        width: 0,
    }

    innerRadius: number = 50
    outerRadius: number = 300

    indicators: WallIndicator[] = []
    selectedPositions: {x: number, y: number}[] = []
    bounds = this.scene.physics.world.bounds
    positions = [
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 3/4 },
    ]

    onCastStart() {
        //Choose 4 random positions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.positions])
        this.selectedPositions = [shuffled[0], shuffled[1], shuffled[2], shuffled[3]]
        const [pos1, pos2, pos3, pos4] = this.selectedPositions

        //Create indicators
        this.selectedPositions.forEach((pos, index) => {
            this.scene.time.delayedCall((index+1)*200, () => {
                this.indicator = new WallIndicator(
                    this.scene,
                    pos.x,
                    pos.y,
                    Math.PI / 2,
                    10
                )
                this.indicators.push(this.indicator)
            })
        })

        const timings = [1600, 2000, 2400, 2900]
    }
}