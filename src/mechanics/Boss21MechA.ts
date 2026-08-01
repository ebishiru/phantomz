import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss21MechA extends BossMechanic {

    config = {
        id: "cone-boss-dash",
        name: "Roaring Assault",
        castTime: 1000,
        castDuration: 2300,
        cooldown: 2500,
        showCastBar: false,
        damage: 20,
        range: 300,
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

        //Draw Cone Telegraph
        this.telegraph = new ConeTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range,
            this.coneAngle
        )
    }

    execute() {
        //Check cone hit
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
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

        this.telegraph.destroy()
        this.telegraph = undefined

        //Draw Line telegraph towards player
        this.telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angleToPlayer,
            dist,
            this.config.width
        )

        //Snapshot current positions
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = this.player.x
        const endY = this.player.y

        this.scene.time.delayedCall((1000), () => {
            //Move Boss
            this.scene.tweens.add({
                targets: this.boss,
                x: endX,
                y: endY,
                duration: 300,
            })

            //Line hit check
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
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}