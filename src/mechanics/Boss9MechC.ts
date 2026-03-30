import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss9MechC extends BossMechanic {

    config = {
        id: "checkboard-once",
        name: "Swarm Formation",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 50,
    }

    telegraphs: RectangleTelegraph[] = []

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 || !this.active) return

        const bounds = this.scene.physics.world.bounds

        const verticalStart = Phaser.Math.Between(0, 1) //Choosing even or odd
        const horizontalStart = Phaser.Math.Between(0, 1) //Choosing even or odd

        const verticalCount = Math.floor(bounds.width / this.config.width)
        const horizontalCount = Math.floor(bounds.height / this.config.width)

        //Draw vertical telegraphs
        for (let i = 0; i < verticalCount; i++) {
            if (i % 2 === verticalStart) {
                const x = bounds.x + i * this.config.width
                const telegraph = new RectangleTelegraph(
                    this.scene,
                    x,
                    bounds.y, 
                    this.config.width,
                    bounds.height
                )
                this.telegraphs.push(telegraph)
            }
        }

        //Draw horizontal telegraphs
        for (let i = 0; i < horizontalCount; i++) {
            if (i % 2 === horizontalStart) {
                const y = bounds.y + i * this.config.width 
                const telegraph = new RectangleTelegraph(
                    this.scene,
                    bounds.x,
                    y,
                    bounds.width,
                    this.config.width,
                )
                this.telegraphs.push(telegraph)
            }
        }

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0|| !this.active) return

            let hit = false

            this.telegraphs.forEach(t => {
                if (!hit && this.checkHit({
                    x: t.x,
                    y: t.y,
                    width: t.width,
                    height: t.height
                })) {
                    hit = true
                }
                t.destroy()
            })
            this.telegraphs = []
        })
    }

    checkHit(rect: { x: number, y: number, width: number, height: number}) {
        const { x: rx, y: ry, width: rw, height: rh } = rect
        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const closestX = Phaser.Math.Clamp(px, rx, rx + rw)
        const closestY = Phaser.Math.Clamp(py, ry, ry + rh)

        const dx = px - closestX
        const dy = py - closestY
        if (dx * dx + dy * dy <= pr * pr) {
            this.player.takeDamage(this.config.damage)
            return true
        }
        return false
    }

    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }
}