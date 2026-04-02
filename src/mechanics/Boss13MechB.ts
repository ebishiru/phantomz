import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss13MechB extends BossMechanic {

    config = {
        id: "right-left-boss-cleave",
        name: "Hex Cleave",
        castTime: 1600,
        castDuration: 1600,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 200,
        width: 0,
    }

    direction: string = "Right"
    coneAngle = Math.PI
    facingAngle: number = 0
    attackAngle: number = 0

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const directions = ["Right", "Left"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `Hex Cleave : ${this.direction}`

        //Randomize angle
        this.facingAngle = Phaser.Math.FloatBetween(-Math.PI, Math.PI)

        this.attackAngle = this.facingAngle

        switch( this.direction ) {
            case "Right":
                this.attackAngle += Math.PI /2
                break
            case "Left":
                this.attackAngle -= Math.PI /2
                break
        }

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            this.facingAngle,
        )

        //Draw telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 800), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.attackAngle,
                this.config.range,
                this.coneAngle,
            )
        })

        //Remove indicator end of cast bar
        this.scene.time.delayedCall(this.config.castTime, () => {
            this.indicator?.destroy()
            this.indicator = undefined
        })
    }

    execute() {
        //Check hit
        let hit = false
        
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )
        if (dist <= this.config.range + this.player.hurtboxRadius) {

            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.attackAngle
            )

            if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                hit = true
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    destroy() {
        this.indicator?.destroy()
        this.indicator = undefined
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}