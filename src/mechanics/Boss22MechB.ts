import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss22MechB extends BossMechanic {

    config = {
        id: "boss-teleport-circle",
        name: "Bladestorm",
        castTime: 1300,
        castDuration: 1300,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 175,
        width: 0,
    }

    onCastStart() {
        //Move boss to player location

        this.scene.tweens.add({
            targets: this.boss,
            x: this.player.x,
            y: this.player.y,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                //Draw Circle Telegraph
                this.telegraph = new CircleTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    this.config.range
                )
            }
        })
    }

    execute() {
        //Check hit
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}