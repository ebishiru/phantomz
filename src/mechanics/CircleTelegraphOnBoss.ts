import Phaser from "phaser";
import BossMechanic from "./BossMechanics";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnBoss extends BossMechanic {

    trigger() {
        if (!this.active || this.boss.health <= 0) return

        const telegraph = new CircleTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            160,
        )

        this.scene.time.delayedCall(1000, () => {
            if (!this.active || this.boss.health <= 0) {
                telegraph.destroy()
                return
            }

            const hit = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.boss.x,
                this.boss.y,
            ) <= (160 + this.player.hurtboxRadius)

            if (hit) {
                this.player.takeDamage(20)
            }

            telegraph.destroy()
        })
    }


}