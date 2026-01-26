import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnBoss extends BossMechanic {

    config = {
        id: "circle-boss",
        name: "Quake",
        castTime: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 160,
        width: 0,
    }

    execute() {
        //Draw Telegraph
        const telegraph = new CircleTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            this.config.range,
        )

        //Check Hit
        const hit = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.boss.x,
                this.boss.y,
            ) <= (this.config.range + this.player.hurtboxRadius)

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        telegraph.destroy()
    }
}