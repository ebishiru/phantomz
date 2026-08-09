import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss29MechA extends BossMechanic {

    config = {
        id: "donut-room-boss-line-random",
        name: "Execution Grounds",
        castTime: 1300,
        castDuration: 2100,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 600,
        width: 150,
    }

    innerRadius: number = 50
    outerRadius: number = 600

    onCastStart() {
        const bounds = this.scene.physics.world.bounds
        const coordinates = [
            { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 1/4 },
            { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 1/4 },
            { x: bounds.x + bounds.width * 1/4, y: bounds.y + bounds.height * 3/4 },
            { x: bounds.x + bounds.width * 3/4, y: bounds.y + bounds.height * 3/4 }
        ]

        const chosenIndex = Phaser.Math.Between(0, coordinates.length - 1)
        const donutCoordinate = coordinates[chosenIndex]
        coordinates.splice(chosenIndex, 1)
        const jumpCoordinate = Phaser.Utils.Array.GetRandom(coordinates)

        const donutX = donutCoordinate.x
        const donutY = donutCoordinate.y

        //Draw donut room wide telegraph at chosen coordinate
        this.telegraph = new DonutTelegraph(
            this.scene,
            donutX,
            donutY,
            this.innerRadius,
            this.outerRadius
        )

        //Teleport boss at random other coordinate
        this.scene.tweens.add({
            targets: this.boss,
            x: jumpCoordinate.x,
            y: jumpCoordinate.y,
            duration: 200,
            ease: "Power2"
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            
            //Check donut hit
            const donutDist = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                donutX,
                donutY,
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
                donutX,
                donutY
            )

            const distToCoordinate = Phaser.Math.Distance.Between(
                this.boss.x,
                this.boss.y,
                donutX,
                donutY,
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
            this.scene.time.delayedCall(600, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                this.scene.tweens.add({
                    targets: this.boss,
                    x: donutX,
                    y: donutY,
                    duration: 200,
                    ease: "Power2"
                })
            })

            //Check hit
            this.scene.time.delayedCall(800, () => {
                if (!this.boss || this.boss.health <= 0 || !this.active) return

                const angle = this.telegraph.angle
                const startX = donutX
                const startY = donutY
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
    }
}