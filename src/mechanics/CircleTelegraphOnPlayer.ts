import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnPlayer extends BossMechanic {

    config = {
        id: "circle-player",
        name: "Rock Drop",
        castTime: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 80,
        width: 0,
    }

    execute() {
        //Draw telegraph
        const telegraph = new CircleTelegraph(
            this.scene,
            this.player.x,
            this.player.y,
            this.config.range,
        )

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

        telegraph.destroy()

    }
}