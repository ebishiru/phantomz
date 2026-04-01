import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss13MechB extends BossMechanic {

    config = {
        id: "right-left-boss-cleave",
        name: "Hex Cleave",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 300,
        width: 0,
    }

    direction: string = "Right"
    coneAngle = Math.PI
    facingAngle: number = 0

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const directions = ["Right", "Left"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `Hex Cleave : ${this.direction}`

        //Randomize angle
        this.facingAngle = Phaser.Math.FloatBetween(-Math.PI, Math.PI)

        let angleAdjust = 0

        switch( this.direction ) {
            case "Right":
                angleAdjust += Math.PI
                break
            case "Left":
                angleAdjust -= Math.PI
                break
        }
    }
}