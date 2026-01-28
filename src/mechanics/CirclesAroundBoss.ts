import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class CirclesAroundBoss extends BossMechanic {

    config = {
        id: "circles-around-boss",
        name: "Quadrant Rock Drop",
        castTime: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 60,
        width: 0,
    }

    distanceFromCenter = 100
    rotationAngle = 0
    telegraphs: CircleTelegraph[] = []

    onCastStart() {
        //Draw Telegraphs
        const centerX = this.boss.x
        const centerY = this.boss.y

        this.rotationAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)

        for (let i = 0; i < 4; i++) {
            const angle = this.rotationAngle + i * (Math.PI / 2)

            const x = centerX + Math.cos(angle) * this.distanceFromCenter
            const y = centerY + Math.sin(angle) * this.distanceFromCenter

            const telegraph = new CircleTelegraph(
                this.scene,
                x,
                y,
                this.config.range,
            )
            this.telegraphs.push(telegraph)
        }
    }

    execute() {
        //Check Hit
        let hit = false

        this.telegraphs.forEach(t => {
            if (!hit) {
                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    t.x,
                    t.y,
                )

                if (!hit && dist <= this.config.range + this.player.hurtboxRadius) {
                    hit = true
                }
            }

            t.destroy()
        })

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraphs.length = 0
    }
}