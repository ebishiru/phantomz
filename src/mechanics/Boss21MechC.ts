import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DonutTelegraph from "../entities/DonutTelegraph";

export default class Boss21MechC extends BossMechanic {

    config = {
        id: "donut-or-circle-around",
        name: "Wildfire",
        castTime: 1200,
        castDuration: 1200,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 50,
    }

    positions: {x: number, y: number}[] = []
    telegraphs: (CircleTelegraph | DonutTelegraph)[] = []
    telegraphType: "Cluster" | "Rings" = "Cluster"

    onCastStart() {
        //Randomize telegraph positions
        const random1 = Math.random()
        const telegraphPosition = random1 < 0.5 ? "Square" : "Diamond"

        const bounds = this.scene.physics.world.bounds

        if (telegraphPosition === "Square") {
            this.positions = [
                { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 1/4 },
                { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 1/4 },
                { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 3/4 },
                { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 3/4 }
            ]
        } else if (telegraphPosition === "Diamond") {
            this.positions = [
                { x: bounds.x + bounds.width * 1/2, y: bounds.y + bounds.height * 1/4 },
                { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 1/2 },
                { x: bounds.x + bounds.width * 1/2, y: bounds.y + bounds.height * 3/4 },
                { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 1/2 }
            ]
        }

        //Randomize either circle or donut telegraphs
        const random2 = Math.random()
        this.telegraphType = random2 < 0.5 ? "Cluster" : "Rings"
        this.config.name = `Wildfire ${this.telegraphType}`

        //Draw telegraphs
        if (this.telegraphType === "Cluster") {
            this.positions.forEach(pos => {
                const telegraph = new CircleTelegraph(
                    this.scene,
                    pos.x,
                    pos.y,
                    this.config.range * 1.5
                )
                this.telegraphs.push(telegraph)
            })
        } else if (this.telegraphType === "Rings") {
            this.positions.forEach(pos => {
                const telegraph = new DonutTelegraph(
                    this.scene,
                    pos.x,
                    pos.y,
                    this.config.range * 0.5,
                    this.config.range + this.config.width
                )
                this.telegraphs.push(telegraph)
            })
        }
    }

    execute() {
        //Remove telegraps
        this.telegraphs.forEach(telegraph => {
            telegraph.destroy()
        })
        this.telegraphs = []

        if (!this.boss || this.boss.health <= 0 ||!this.active) return
        
        //Check for hit
        let hit = false

        if (this.telegraphType === "Cluster") {
            this.positions.forEach(pos => {
                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    pos.x,
                    pos.y
                )

                if (dist <= this.config.range + this.player.hurtboxRadius) {
                    hit = true
                }
            })
        } else if (this.telegraphType === "Rings") {
            this.positions.forEach(pos => {
                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    pos.x,
                    pos.y
                )

                if (dist >= this.config.range * 0.5 - this.player.hurtboxRadius &&
                    dist <= this.config.range + this.config.width + this.player.hurtboxRadius) {
                    hit = true
                }
            })
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
        this.positions = []
    }
}