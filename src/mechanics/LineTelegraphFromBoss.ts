import Phaser from "phaser";
import BossMechanic from "./BossMechanics";
import LineTelegraph from "../entities/LineTelegraph";

export default class LineTelegraphFromBoss extends BossMechanic {

    trigger() {
        if (!this.active || this.boss.health <= 0) return

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )
        
        const length = 700
        const width = 80

        const telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            length,
            width
        )

        this.scene.time.delayedCall(1000, () => {
            if (!this.active || this.boss.health <= 0) {
                telegraph.destroy()
                return
            }

            const startX = this.boss.x
            const startY = this.boss.y
            const endX = startX + Math.cos(angle) * length
            const endY = startY + Math.sin(angle) * length

            const px = this.player.x
            const py = this.player.y
            const pr = this.player.hurtboxRadius
            
            const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
            const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
            const closestX = startX + t * (endX - startX);
            const closestY = startY + t * (endY - startY);

            const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);

            if (distanceToLine <= pr + width / 2) {
                this.player.takeDamage(20);
            }

            telegraph.destroy()
        })
    }
}