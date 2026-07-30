import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss5MechC extends BossMechanic {
    private telegraphSpawnTimer?: Phaser.Time.TimerEvent
    private leapTimer?: Phaser.Time.TimerEvent

    config = {
        id: "teleport-circle-player",
        name: "Leaping Strike",
        castTime: 1500,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 120,
        width: 0,
    }

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 || !this.active) return

        const startX = this.boss.x
        const startY = this.boss.y
        const leapX = this.player.x
        const leapY = this.player.y

        this.telegraphSpawnTimer = this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.active || !this.boss || this.boss.health <= 0) {
                this.cleanupTelegraph()
                return
            }

            this.telegraph = new CircleTelegraph(
                this.scene,
                leapX,
                leapY,
                this.config.range
            )
        })

        this.leapTimer = this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) {
                this.cleanupTelegraph()
                return
            }
            
            this.scene.tweens.add({
                targets: this.boss,
                x: leapX,
                y: leapY,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    if (!this.boss || this.boss.health <= 0 || !this.active) {
                        this.cleanupTelegraph()
                        return
                    }

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

                    this.cleanupTelegraph()

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

    private cleanupTelegraph() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    execute() {}

    destroy() {
        this.telegraphSpawnTimer?.remove(false)
        this.telegraphSpawnTimer = undefined
        this.leapTimer?.remove(false)
        this.leapTimer = undefined
        this.cleanupTelegraph()
        this.active = false
    }
}