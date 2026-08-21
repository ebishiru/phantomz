import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss25MechB extends BossMechanic {

    config = {
        id: "circles-last-donut",
        name: "Last Rites",
        castTime: 1600,
        castDuration: 2400,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 0,
    }

    innerRadius: number = 60
    outerRadius: number = 300

    destroyed = false
    telegraphs: ( CircleTelegraph | DonutTelegraph | undefined )[] = []

    selectedPositions: {x: number, y: number}[] = []
    bounds = this.scene.physics.world.bounds
    positions = [
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 1/4 },
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 2/4 },
        { x: this.bounds.x + this.bounds.width * 1/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 2/4 , y: this.bounds.y + this.bounds.height * 3/4 },
        { x: this.bounds.x + this.bounds.width * 3/4 , y: this.bounds.y + this.bounds.height * 3/4 },
    ]

    onCastStart() {
        //Choose 3 random positions
        const shuffled = Phaser.Utils.Array.Shuffle([...this.positions])
        this.selectedPositions = [shuffled[0], shuffled[1], shuffled[2]]
        const [pos1, pos2, pos3] = this.selectedPositions

        // Clear any old telegraphs from previous casts
        this.telegraphs.forEach(t => t?.destroy())
        this.telegraphs = []

        //Create telegraphs
        this.telegraphs[0] = new CircleTelegraph(
            this.scene,
            pos1.x,
            pos1.y,
            this.config.range
        )
        this.scene.time.delayedCall(300, () => {
            if (this.destroyed) return
            this.telegraphs[1] = new CircleTelegraph(
                this.scene,
                pos2.x,
                pos2.y,
                this.config.range
            )
        })
        this.scene.time.delayedCall(600, () => {
            if (this.destroyed) return
            this.telegraphs[2] = new DonutTelegraph(
                this.scene,
                pos3.x,
                pos3.y,
                this.innerRadius,
                this.outerRadius
            )
        })

        const timings = [1400, 1800, 2200]
        const maxIndex = timings.length - 1

        timings.forEach((time, index) => {
            
            this.scene.time.delayedCall(time, () => {
                if (this.destroyed) return

                const telegraph = this.telegraphs[index]
                if (!telegraph) return

                const dist = Phaser.Math.Distance.Between(
                    telegraph.x,
                    telegraph.y,
                    this.player.x,
                    this.player.y
                )

                if (index != maxIndex) {
                    //Check circle hit
                    if (dist <= this.config.range + this.player.hurtboxRadius) {
                        this.player.takeDamage(this.config.damage)
                    }
                } else {
                    //Check donut hit
                    if (dist >= this.innerRadius - this.player.hurtboxRadius && 
                        dist <= this.outerRadius + this.player.hurtboxRadius) {
                        this.player.takeDamage(this.config.damage)
                    }
                }

                telegraph?.destroy()
                this.telegraphs[index] = undefined
            })
        })
    }

    destroy() {
        this.destroyed = true
        this.telegraphs.forEach(t => {
            if (t) {
                t.destroy()
            }
        })
        this.telegraphs = []
    }
}