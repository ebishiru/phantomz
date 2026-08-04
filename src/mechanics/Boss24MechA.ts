import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss24MechA extends BossMechanic {

    config = {
        id: "donut-room-boss-line",
        name: "Execution Zone",
        castTime: 1500,
        castDuration: 2500,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 600,
        width: 150,
    }

    innerRadius = 60
    outerRadius = 600

    coordinates: {x: number, y:number}[] = []

    onCastStart() {
        //Randomize pair of corner points
        const bounds = this.scene.physics.world.bounds
        const randomize = Math.random()
        this.coordinates = []

        if (randomize < 0.5) {
            const coordinateTopLeft = { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 1/4 }
            const coordinateBottomRight = { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 3/4}
            this.coordinates.push(coordinateTopLeft)
            this.coordinates.push(coordinateBottomRight)
        } else {
            const coordinateTopRight = { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 1/4}
            const coordinateBottomLeft = { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 3/4}
            this.coordinates.push(coordinateTopRight)
            this.coordinates.push(coordinateBottomLeft)
        }

        //Draw donut room wide telegraph at one of the chosen coordinates
        const chosenIndex = Phaser.Math.Between(0, 1)
        this.telegraph = new DonutTelegraph(
            this.scene,
            this.coordinates[chosenIndex].x,
            this.coordinates[chosenIndex].y,
            this.innerRadius,
            this.outerRadius
        )

        //Teleport boss at other coordinate
        const remainingIndex = (chosenIndex + 1) % 2
        this.scene.tweens.add({
            targets: this.boss,
            x: this.coordinates[remainingIndex].x,
            y: this.coordinates[remainingIndex].y,
            duration: 200,
            ease: "Power2"
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return

            //Check donut hit
            const donutDist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.coordinates[chosenIndex].x,
                this.coordinates[chosenIndex].y,
            )

            if (donutDist >= (this.innerRadius - this.player.hurtboxRadius)) {
                this.player.takeDamage(this.config.damage)
                this.boss.heal(this.config.damage/4)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined

            const angleToCoordinate = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.coordinates[chosenIndex].x,
                this.coordinates[chosenIndex].y,
            )

            const distToCoordinate = Phaser.Math.Distance.Between(
                this.boss.x,
                this.boss.y,
                this.coordinates[chosenIndex].x,
                this.coordinates[chosenIndex].y,
            )

            //Draw line telegraph
            this.telegraph = new LineTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                angleToCoordinate,
                distToCoordinate * 1.5,
                this.config.width
            )

            //Move boss to donut coordinate
            this.scene.time.delayedCall(800, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                this.scene.tweens.add({
                    targets: this.boss,
                    x: this.coordinates[chosenIndex].x,
                    y: this.coordinates[chosenIndex].y,
                    duration: 200,
                    ease: "Power2"
                })
            })

            //Check hit
            this.scene.time.delayedCall(1000, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                const angle = this.telegraph.angle
                const startX = this.coordinates[remainingIndex].x
                const startY = this.coordinates[remainingIndex].y
                const endX = startX + Math.cos(angle) * this.telegraph.length
                const endY = startY + Math.sin(angle) * this.telegraph.length

                const px = this.player.x
                const py = this.player.y
                const pr = this.player.hurtboxRadius
        
                const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
                const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
                const closestX = startX + t * (endX - startX);
                const closestY = startY + t * (endY - startY);
        
                const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);
        
                if (distanceToLine <= pr + this.config.width / 2) {
                    this.player.takeDamage(this.config.damage)
                    this.boss.heal(this.config.damage/4)
                }

                this.telegraph?.destroy()
                this.telegraph = undefined
            })
        })
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.coordinates = []
    }
}