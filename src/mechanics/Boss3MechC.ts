import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss3MechC extends BossMechanic {

    config = {
        id: "snowflake-player",
        name: "Landslide",
        castTime: 1500,
        castDuration: 1500,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 600,
        width: 100,
    }

    telegraphs: RectangleTelegraph[] = []

    onCastStart() {
        const centerX = this.player.x
        const centerY = this.player.y

        for (let i = 0; i < 3; i++) {
            const angle = Phaser.Math.DegToRad(60 * i)
            const telegraph = new RectangleTelegraph(
                this.scene,
                -this.config.width / 2,
                -this.config.range / 2,
                this.config.width,
                this.config.range
            )

            telegraph.graphics.setPosition(centerX, centerY)
            telegraph.graphics.setRotation(angle)

            this.telegraphs.push(telegraph)
        }
    }

    execute() {
        let hit = false
        this.telegraphs.forEach(t => {
            const dx = this.player.x - t.graphics.x
            const dy = this.player.y - t.graphics.y
            const angle = -t.graphics.rotation
            const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle)
            const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle)

            if (
                rotatedX >= -this.config.width / 2 &&
                rotatedX <= this.config.width / 2 &&
                rotatedY >= this.config.range / 2 &&
                rotatedY <= this.config.range / 2
            ) {
                hit = true
            }
        })

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }

    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
        this.active = false
    }
}