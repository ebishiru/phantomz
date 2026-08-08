import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss30MechC extends BossMechanic {

    config = {
        id: "double-diagonal-room-wide",
        name: "Dexter Rift",
        castTime: 1800,
        castDuration: 1800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI
    direction: string = "Dexter"
    coneDirectionMod: number = 0
    
    indicators: WallIndicator[] = []
    telegraphs: ConeTelegraph[] = []

    onCastStart() {

        //Choose right or left
        const directions = ["Dexter", "Sinister"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `${this.direction} Rift`

        switch( this.direction ) {
            case "Dexter":
                this.coneDirectionMod = Math.PI / 2
                break
            case "Sinister":
                this.coneDirectionMod = -Math.PI / 2
                break
        }

        //Choose indicator coordinates
        const bounds = this.scene.physics.world.bounds
        const centerX = bounds.x + bounds.width / 2
        const centerY = bounds.y + bounds.height / 2
        const indicatorLocations = [
            { x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 1/8 },
            { x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 1/8 },
            { x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 7/8 },
            { x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 7/8 },
        ]
        const firstIndex = Phaser.Math.Between(0, 3)
        const secondIndex = (firstIndex + (Math.random() < 0.5 ? 1 : 3)) % 4

        const chosenLocations = [indicatorLocations[firstIndex], indicatorLocations[secondIndex]]

        //Draw indicators
        chosenLocations.forEach(location => {
            const angle = Phaser.Math.Angle.Between(
                location.x,
                location.y,
                centerX,
                centerY
            )

            const indicator = new WallIndicator(
                this.scene,
                location.x,
                location.y,
                angle,
                15
            )

            this.indicators.push(indicator)
        })

        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0|| !this.active) return

            //Draw cone telegraphs
            chosenLocations.forEach(location => {
                const angle = Phaser.Math.Angle.Between(
                    location.x,
                    location.y,
                    centerX,
                    centerY
                )

                const telegraph = new ConeTelegraph(
                    this.scene,
                    centerX,
                    centerY,
                    angle + this.coneDirectionMod,
                    this.config.range,
                    this.coneAngle
                )

                this.telegraphs.push(telegraph)
            })

            //Remove indicators
            this.indicators.forEach(i => i.destroy())
            this.indicators = []
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0|| !this.active) return
            //Check hit
            let hit = false

            const dist = Phaser.Math.Distance.Between(
                centerX,
                centerY,
                this.player.x,
                this.player.y
            )

            if (dist <= this.config.range + this.player.hurtboxRadius) {
                this.telegraphs.forEach(telegraph => {
                    if (hit) return

                    const angleToPlayer = Phaser.Math.Angle.Between(
                        centerX,
                        centerY,
                        this.player.x,
                        this.player.y
                    )

                    const angleDiff = Phaser.Math.Angle.Wrap(
                        angleToPlayer - telegraph.angle
                    )

                    if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                        hit = true
                    }
                })
            }

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraphs.forEach(t => t.destroy())
            this.telegraphs = []
        })
    }

    destroy() {
        this.indicators.forEach(i => i.destroy())
        this.indicators = []
        this.telegraphs.forEach(t => t.destroy())
        this.telegraphs = []
    }
}