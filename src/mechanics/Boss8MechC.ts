import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss8MechC extends BossMechanic {

    config = {
        id: "teleport-triple-rectangle-player",
        name: "Triple Dimensional Rend",
        castTime: 1000,
        castDuration: 3000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 130,
    }

    telegraphs: RectangleTelegraph[] = []

    onCastStart() {
        //Teleport to player
        this.boss.body?.stop()

        this.scene.tweens.add({
            targets: this.boss,
            x: this.player.x,
            y: this.player.y,
            duration: 300,
            ease: "Sine.easeInOut",
            onStart: () => this.boss.body?.stop(),
            onComplete: () => {
                //Draw 3 rectangles around player
                const angle1 = Phaser.Math.DegToRad(0)
                const angle2 = Phaser.Math.DegToRad(120)
                const angle3 = Phaser.Math.DegToRad(240)

                const telegraph1 = new RectangleTelegraph(
                    this.scene,
                    -this.config.width / 2,
                    -this.config.range / 2,
                    this.config.width,
                    this.config.range
                )
                telegraph1.graphics.setPosition(this.player.x, this.player.y)
                telegraph1.graphics.setRotation(angle1)

                const telegraph2 = new RectangleTelegraph(
                    this.scene,
                    -this.config.width / 2,
                    -this.config.range / 2,
                    this.config.width,
                    this.config.range
                )
                telegraph2.graphics.setPosition(this.player.x, this.player.y)
                telegraph2.graphics.setRotation(angle2)

                const telegraph3 = new RectangleTelegraph(
                    this.scene,
                    -this.config.width / 2,
                    -this.config.range / 2,
                    this.config.width,
                    this.config.range
                )
                telegraph3.graphics.setPosition(this.player.x, this.player.y)
                telegraph3.graphics.setRotation(angle3)

                this.telegraphs = [telegraph1, telegraph2, telegraph3]
            }
        })
    }

    execute() {
        //Check Hit
        let hit = false
        for (const telegraph of this.telegraphs) {
            const dx = this.player.x - telegraph.graphics.x
            const dy = this.player.y - telegraph.graphics.y
            const angle = -telegraph.graphics.rotation
            const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle)
            const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle)

            if (
                rotatedX >= -this.config.width / 2 &&
                rotatedX <= this.config.width / 2 &&
                rotatedY >= -this.config.range / 2 &&
                rotatedY <= this.config.range / 2
            ) {
                hit = true
                break
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        for (const telegraph of this.telegraphs) {
            telegraph.destroy()
        }

        this.telegraphs = []
    }

    destroy() {
        for (const telegraph of this.telegraphs) {
            telegraph.destroy()
        }

        this.telegraphs = []

        super.destroy?.()
    }
}