import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss31MechC extends BossMechanic {

    config = {
        id: "line-teleport-cone-player",
        name: "Rolling Thunderclap",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2500,
        showCastBar: false,
        damage: 20,
        range: 400,
        width: 100,
    }

    coneAngle = Math.PI / 2

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Draw Line Telegraph
        this.telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            dist + 100,
            this.config.width
        )

        //Snapshot current positions
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = this.telegraph.x + Math.cos(angle) * (dist + 100)
        const endY = this.telegraph.y + Math.sin(angle) * (dist + 100)

        this.scene.time.delayedCall(this.config.castTime - 300, () => {
            //Teleport boss to end of line telegraph
            this.scene.tweens.add({
                targets: this.boss,
                x: endX,
                y: endY,
                duration: 300,
                ease: "Power2",
            })
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            //Check line telegraph hit
            const px = this.player.x
            const py = this.player.y
            const pr = this.player.hurtboxRadius

            const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
            const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
            const closestX = startX + t * (endX - startX);
            const closestY = startY + t * (endY - startY);
    
            const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);
    
            if (distanceToLine <= pr + this.config.width / 2) {
                this.player.takeDamage(this.config.damage);
            }

            this.telegraph?.destroy()
            this.telegraph = undefined

            //Draw cone telegraph towards player
            const angle = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y
            )

            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                angle,
                this.config.range,
                this.coneAngle
            )

            this.scene.time.delayedCall(1000, () => {
                //Check cone telegraph hit
                const dist = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                const angleToPlayer = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                if (dist <= this.config.range + this.player.hurtboxRadius) {

                    const angleDiff = Phaser.Math.Angle.Wrap(
                        angleToPlayer - this.telegraph.angle
                    )

                    if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                        this.player.takeDamage(this.config.damage)
                    }
                }

                this.telegraph?.destroy()
                this.telegraph = undefined
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}