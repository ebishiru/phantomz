import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss6MechC extends BossMechanic {

    config = {
        id: "circles-sequence-around-boss",
        name: "Stalactite Storm",
        castTime: 1000,
        castDuration: 2800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 150,
        width: 0,
    }

    distanceFromCenter = 150
    rotationAngle = 0
    telegraphs: CircleTelegraph[] = []
    
    sequences = [
        [0, 1, 2, 3],
        [3, 2, 1, 0]
    ]

    spawnDelay = 300
    explosionDelay = 1500
    explosionInterval = 300

    onCastStart() {
        const centerX = this.boss.x
        const centerY = this.boss.y

        this.rotationAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)

        const order = this.sequences[Math.floor(Math.random() * this.sequences.length)]

        order.forEach((explosion, index) => {
            //Draw Telegraph
            this.scene.time.delayedCall(index * this.spawnDelay, () => {
                const angle = this.rotationAngle + explosion * (Math.PI/2)
                const x = centerX + Math.cos(angle) * this.distanceFromCenter
                const y = centerY + Math.sin(angle) * this.distanceFromCenter

                const telegraph = new CircleTelegraph(
                    this.scene,
                    x,
                    y,
                    this.config.range
                )
                this.telegraphs[explosion] = telegraph
            })

            //Hit Check
            this.scene.time.delayedCall(this.explosionDelay + index * this.explosionInterval, () => {
                const telegraph = this.telegraphs[explosion]
                if (!telegraph) return
                
                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    telegraph.x,
                    telegraph.y
                )

                if (dist <= this.config.range + this.player.hurtboxRadius) {
                    this.player.takeDamage(this.config.damage)
                }

                telegraph.destroy()
                this.telegraphs[explosion] = undefined as any
            })
        })
    }

    destroy() {
        this.telegraphs.forEach(t => t?.destroy())
        this.telegraphs = []
    }
}