import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss27MechA extends BossMechanic {

    config = {
        id: "teleport-lines-random",
        name: "Execution Barrage",
        castTime: 2800,
        castDuration: 2700,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 100,
    }

    onCastStart() {
        const timings = [1200, 1500, 1800, 2100, 2400, 2700]
        const telegraphDuration = 1000

        //Boss randomly teleports
        const bounds = this.scene.physics.world.bounds
        const jumpX = Phaser.Math.Between(bounds.x + 10, bounds.x + bounds.width - 10)
        const jumpY = Phaser.Math.Between(bounds.y + 10, bounds.y + bounds.height - 10)

        this.scene.tweens.add({
            targets: this.boss,
            x: jumpX,
            y: jumpY,
            duration: 200,
            ease: "Power2"
        })

        timings.forEach((time) => {
            const spawnTime = time - telegraphDuration
        
            this.scene.time.delayedCall(spawnTime, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                const dist = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                //Ensure telegraph is set distance
                let telegraphDistance = dist * 2
                if (telegraphDistance < 200) {
                    telegraphDistance = 200
                }

                const angleToPlayer = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                const startX = this.boss.x
                const startY = this.boss.y
                const endX = startX + Math.cos(angleToPlayer) * telegraphDistance
                const endY = startY + Math.sin(angleToPlayer) * telegraphDistance

                const telegraph = new LineTelegraph(
                    this.scene,
                    startX,
                    startY,
                    angleToPlayer,
                    telegraphDistance,
                    this.config.width
                )

                this.scene.time.delayedCall(telegraphDuration, () => {
                    telegraph?.destroy()

                    if (!this.boss || this.boss.health <= 0 || !this.active) {
                        return
                    }

                    //Check line hit
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
                })
            })
        })
    }
}