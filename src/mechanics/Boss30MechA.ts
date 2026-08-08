import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss30MechA extends BossMechanic {

    config = {
        id: "boss-random-teleport-lines-player",
        name: "Divine Judgment",
        castTime: 2600,
        castDuration: 2600,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 300,
        width: 100,
    }

    telegraphs: LineTelegraph[] = []

    onCastStart() {
        const timings = [1000, 1400, 1800, 2200, 2600]
        const telegraphDuration = 800

        timings.forEach(time => {
            const spawnTime = time - telegraphDuration

            this.scene.time.delayedCall(spawnTime - 200, () => {
                //teleport boss randomly near player
                let x = this.player.x
                let y = this.player.y

                const tpAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)
                const tpDist = Phaser.Math.Between(150, 250)

                this.scene.tweens.add({
                    targets: this.boss,
                    x: x + Math.cos(tpAngle) * tpDist,
                    y: y + Math.sin(tpAngle) * tpDist,
                    duration: 200,
                    ease: "Power2",
                    onComplete: () => {
                        //Draw line telegraph
                        const angle = Phaser.Math.Angle.Between(
                            this.boss.x,
                            this.boss.y,
                            this.player.x,
                            this.player.y,
                        )

                        const telegraph = new LineTelegraph(
                            this.scene,
                            this.boss.x,
                            this.boss.y,
                            angle,
                            this.config.range,
                            this.config.width
                        )

                        this.telegraphs.push(telegraph)

                        this.scene.time.delayedCall(telegraphDuration, () => {
                            //Line Hit check
                            const startX = telegraph.x
                            const startY = telegraph.y
                            const endX = startX + Math.cos(telegraph.angle) * telegraph.length
                            const endY = startY + Math.sin(telegraph.angle) * telegraph.length

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

                            telegraph?.destroy()
                        })
                    }
                })
            })
        })
    }

    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }
}