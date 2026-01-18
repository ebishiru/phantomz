import Phaser from "phaser";
import BossMechanic from "./BossMechanics";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnBoss extends BossMechanic {
    trigger() {
        const telegraph = new CircleTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            160
        )

        this.scene.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }
}