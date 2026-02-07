import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class TeleportCircleAndBack extends BossMechanic {

    config = {
        id: "teleport-circle-player",
        name: "Leaping Swing",
        castTime: 1500,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 120,
        width: 0,
    }

    onCastStart() {
        const startX = this.boss.x
        const startY = this.boss.y
        const leapX = this.player.x
        const leapY = this.player.y

        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            this.telegraph = new CircleTelegraph(
                this.scene,
                leapX,
                leapY,
                this.config.range
            )
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            
            this.scene.tweens.add({
                targets: this.boss,
                x: leapX,
                y: leapY,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
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

                    this.scene.tweens.add({
                        targets: this.boss,
                        x: startX,
                        y: startY,
                        duration: 300,
                        ease: "Power2",
                    })
                }
            })
        })
    }

    execute() {}

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.active = false
    }
}