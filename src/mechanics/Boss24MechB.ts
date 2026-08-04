import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss24MechB extends BossMechanic {

    config = {
        id: "half-room-wide-vertical",
        name: "Life or Death",
        castTime: 1300,
        castDuration: 1300,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    onCastStart() {
        //Randomize sides
        const sides = ["Left", "Right"]
        const side = Phaser.Utils.Array.GetRandom(sides)

        const bounds = this.scene.physics.world.bounds
        let startingX = bounds.x

        if (side === "Left") {
            this.config.name = "Death or Life"
        } else if (side === "Right") {
            this.config.name = "Life or Death"
            startingX += bounds.width / 2
        }

        //Draw Rectangle telegraph
        this.scene.time.delayedCall(this.config.castTime - 500, () => {
            this.telegraph = new RectangleTelegraph(
                this.scene,
                startingX,
                bounds.y,
                bounds.width / 2,
                bounds.height
            )
        })
        
        //Hit Check
        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            const { x: rx, y: ry, width: rw, height: rh } = this.telegraph
            const px = this.player.x
            const py = this.player.y
            const pr = this.player.hurtboxRadius

            // Find closest point on rectangle to player
            let closestX = px
            if (px < rx) closestX = rx
            else if (px > rx + rw) closestX = rx + rw

            let closestY = py
            if (py < ry) closestY = ry
            else if (py > ry + rh) closestY = ry + rh

            const dx = px - closestX
            const dy = py - closestY

            if (dx * dx + dy * dy <= pr * pr) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph.destroy()
            this.telegraph = undefined
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}