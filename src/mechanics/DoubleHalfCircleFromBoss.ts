import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class DoubleHalfCircleFromBoss extends BossMechanic {

    config = { 
        id: "two-half-circle-boss",
        name: "",
        castTime: 2000,
        castDuration: 2800,
        cooldown: 2800,
        showCastBar: true,
        damage: 20,
        range: 500,
        width: 0,
    }

    coneAngle = Math.PI * 3 / 2
    followCleave: string = "Dexter"
    firstAngle: number = 0
    secondAngle: number = 0

    onCastStart() {
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        const followCleaves = ["Dexter", "Sinister"]
        this.followCleave = Phaser.Utils.Array.GetRandom(followCleaves)
        this.config.name = `${this.followCleave} Judgment`

        this.firstAngle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            this.firstAngle
        )

        //Draw telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.firstAngle,
                this.config.range,
                this.coneAngle
            )
        })

        //Check hit of first cleave
        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            if (this.firstAngle !== undefined && this.coneHitCheck(this.firstAngle)) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined
        })

        switch( this.followCleave ) {
            case "Dexter":
                this.secondAngle = this.firstAngle + Math.PI / 2
                break
            case "Sinister":
                this.secondAngle = this.firstAngle - Math.PI / 2
                break
        }

        //Draw second telegraph
        this.scene.time.delayedCall((this.config.castDuration - 300), () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.secondAngle,
                this.config.range,
                this.coneAngle,
            )
        })

        //Check hit of 2nd cleave and only destroy indicator at the end of both cleaves
        this.scene.time.delayedCall(this.config.castDuration, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.indicator?.destroy()
            this.indicator = undefined

            if (this.secondAngle !== undefined && this.coneHitCheck(this.secondAngle)) {
                this.player.takeDamage(this.config.damage)
            }

            this.telegraph?.destroy()
            this.telegraph = undefined
        })
    }
    
    coneHitCheck(cleaveAngle: number): boolean {
        if (!this.boss) return false
        
        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )
        if (dist > this.config.range + this.player.hurtboxRadius) {
            return false
        }

        const angleToPlayer = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        const angleDiff = Phaser.Math.Angle.Wrap(
            angleToPlayer - cleaveAngle
        )

        return Math.abs(angleDiff) <= this.coneAngle / 2
    }

    destroy() {
        this.indicator?.destroy()
        this.indicator = undefined
        this.telegraph?.destroy()
        this.telegraph = undefined
    }

}