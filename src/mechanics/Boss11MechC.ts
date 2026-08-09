import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss11MechC extends BossMechanic {

    config = {
        id: "circle-drain-boss",
        name: "Howl of Renewal",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 140,
        width: 0,
    }

    onCastStart() {
        //Draw telegraph
        this.telegraph = new CircleTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            this.config.range,
        )
    }

    execute() {
        //Check hit
        const hit = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.boss.x,
            this.boss.y,
        ) <= (this.config.range + this.player.hurtboxRadius)

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        //Boss heals
        this.boss.heal(this.config.damage/4)

        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}