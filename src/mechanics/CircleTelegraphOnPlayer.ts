import BossMechanic from "./BossMechanics";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CircleTelegraphOnPlayer extends BossMechanic {

    trigger () {
        if (!this.active || this.boss.health <= 0) return

        const telegraph = new CircleTelegraph(
            this.scene,
            this.player.x,
            this.player.y,
            80
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
            ) <= 80

            if (hit) {
                this.player.takeDamage(20)
            }

            telegraph.destroy()
        })
    }
}