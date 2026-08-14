import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss11MechA extends BossMechanic {

    config = {
        id: "dash-line-boss-player",
        name: "Dire Dash",
        castTime: 900,
        castDuration: 900,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 120,
    }

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        const distance = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Draw telegraph
        this.telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range = distance + 100,
            this.config.width,
        )
    }

    execute() {
        const angle = this.telegraph.angle
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = startX + Math.cos(angle) * this.config.range
        const endY = startY + Math.sin(angle) * this.config.range

        //Move Boss
        this.scene.tweens.add({
            targets: this.boss,
            x: endX,
            y: endY,
            duration: 200,
        })

        //Damage Check
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
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}