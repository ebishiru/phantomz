import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss21MechA extends BossMechanic {

    config = {
        id: "cone-line-dash",
        name: "Roaring Assault",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 200,
        width: 120,
    }

    coneAngle = Math.PI / 2

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        //Draw Cone Telegraph
        this.telegraph = new ConeTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range,
            this.coneAngle
        )
    }

    execute() {
        
    }
}