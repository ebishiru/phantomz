import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss13MechA extends BossMechanic {

    config = {
        id: "delay-circle-player",
        name: "Doom Circle",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 90,
        width: 0,
    }

    onCastStart() {
        const endX = this.player.x
        const endY = this.player.y

        //Draw telegraph
        this.telegraph = new CircleTelegraph(
            this.scene,
            endX,
            endY,
            this.config.range
        )

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            //Check hit
            const hit = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                endX,
                endY
            ) <= (this.config.range + this.player.hurtboxRadius)

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}