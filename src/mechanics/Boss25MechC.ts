import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss25MechC extends BossMechanic {

    config = {
        id: "diagonal-room-wide",
        name: "Dexter Chasm",
        castTime: 2000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI
    direction: string = "Dexter"
    coneDirectionMod: number = 0
    indicatorLocation: {x: number, y: number} = { x:0 ,y:0 }

    onCastStart() {
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        //Choose right or left
        const directions = ["Dexter", "Sinister"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `${this.direction} Chasm`

        switch( this.direction ) {
            case "Dexter":
                this.coneDirectionMod = Math.PI / 2
                break
            case "Sinister":
                this.coneDirectionMod = -Math.PI / 2
                break
        }

        //Choose indicator spawn point and angle
        const bounds = this.scene.physics.world.bounds
        const centerX = bounds.x + bounds.width / 2
        const centerY = bounds.y + bounds.height / 2
        const indicatorLocations = [
            { x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 1/8 },
            { x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 1/8 },
            { x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 7/8 },
            { x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 7/8 },
        ]
        this.indicatorLocation = Phaser.Utils.Array.GetRandom(indicatorLocations)

        const angle = Phaser.Math.Angle.Between(
            this.indicatorLocation.x,
            this.indicatorLocation.y,
            centerX,
            centerY
        )

        //Draw indicator
        this.indicator = new WallIndicator(
            this.scene,
            this.indicatorLocation.x,
            this.indicatorLocation.y,
            angle,
            15,
        )

        //Draw cone telegraph
        this.scene.time.delayedCall((this.config.castTime - 600), () => {
            this.telegraph = new ConeTelegraph(
                this.scene,
                centerX,
                centerY,
                angle + this.coneDirectionMod,
                this.config.range,
                this.coneAngle
            )
        })
        
        this.scene.time.delayedCall(this.config.castTime, () => {
            //Check hit
            let hit = false

            const dist = Phaser.Math.Distance.Between(
                centerX,
                centerY,
                this.player.x,
                this.player.y
            )

            if (dist <= this.config.range + this.player.hurtboxRadius) {

                const angleToPlayer = Phaser.Math.Angle.Between(
                    centerX,
                    centerY,
                    this.player.x,
                    this.player.y
                )
    
                const angleDiff = Phaser.Math.Angle.Wrap(
                    angleToPlayer - (angle + this.coneDirectionMod)
                )
    
                if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                    hit = true
                }
            }

            if (hit) {
                this.player.takeDamage(this.config.damage)
            }

            //Clean up
            this.indicator?.destroy()
            this.indicator = undefined
            this.telegraph?.destroy()
            this.telegraph = undefined
        })
    }

    destroy() {
        this.indicator?.destroy()
        this.indicator = undefined
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}