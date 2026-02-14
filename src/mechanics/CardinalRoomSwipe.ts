import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class CardinalRoomSwipe extends BossMechanic {

    config = {
        id: "cardinal-rectangle-room",
        name: "",
        castTime: 2000,
        castDuration: 2000,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    direction: string = "North"

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const directions = ["North", "South", "East", "West"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `${this.direction}ern Infestation`

        const bounds = this.scene.physics.world.bounds
        let x = bounds.x
        let y = bounds.y
        let width = bounds.width
        let height = bounds.height

        const roomPercent = 0.7 

        switch( this.direction ) {
            case "North":
                height = bounds.height * roomPercent
                break
            case "South":
                y += bounds.height * ( 1 - roomPercent)
                height = bounds.height * roomPercent
                break
            case "East":
                x += bounds.width * ( 1 - roomPercent)
                width = bounds.width * roomPercent
                break
            case "West":
                width = bounds.width * roomPercent
                break
        }

        // Rectangle Telegraph First
        this.scene.time.delayedCall(this.config.castTime - 300, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraph = new RectangleTelegraph(
                this.scene,
                x,
                y,
                width,
                height
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

    execute() {
        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        super.destroy?.()
    }
}
