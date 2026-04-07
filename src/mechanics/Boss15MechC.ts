import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import LineTelegraph from "../entities/LineTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss15MechC extends BossMechanic {

    config = {
        id: "teleport-circle-dash-twice",
        name: "Last Stand",
        castTime: 1800,
        castDuration: 2600,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 120,
        width: 60,
    }

    indicators: WallIndicator[] = []

    selectedPositions: {x: number, y: number}[] = []
    positions = [
        {x: 320, y: 170 },
        {x: 320, y: 370 },
        {x: 640, y: 170 },
        {x: 640, y: 370 },
    ]

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        //Choose 2 random positions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.positions])
        this.selectedPositions = [shuffled[0], shuffled[1]]
        const [pos1, pos2] = this.selectedPositions

        //Create indicators
        this.indicators.push(
            new WallIndicator(this.scene, pos1.x, pos1.y, Math.PI)
        )

        this.scene.time.delayedCall(600, () => {
            this.indicators.push(
                new WallIndicator(this.scene, pos2.x, pos2.y, Math.PI)
            )
        })
    }

    execute() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const [pos1, pos2] = this.selectedPositions

        //Dash to pos1
        const lineTelegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            pos1.x,
            pos1.y,
            this.config.width
        )
    }

}