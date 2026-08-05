import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss25MechB extends BossMechanic {

    config = {
        id: "circles-last-donut",
        name: "Last Rites",
        castTime: 2600,
        castDuration: 2600,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 175,
        width: 0,
    }

    telegraphs: ( CircleTelegraph | DonutTelegraph)[] = []

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
        const timings = [1000, 1800, 2600]
    }
}