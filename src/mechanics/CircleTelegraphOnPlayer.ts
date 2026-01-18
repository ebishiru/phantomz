import Phaser from "phaser";
import BossMechanic from "./BossMechanics";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnPlayer extends BossMechanic {
    trigger () {
        const telegraph = new CircleTelegraph(
            this.scene,
            this.player.x,
            this.player.y,
            80
        )

        this.scene.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }
}