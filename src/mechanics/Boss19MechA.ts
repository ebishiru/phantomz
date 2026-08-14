import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss19MechA extends BossMechanic {

    config = {
        id: "double-cone-boss",
        name: "Swipe-Sweep",
        castTime: 1100,
        castDuration: 2200,
        cooldown: 2400,
        showCastBar: false,
        damage: 20,
        range: 500,
        width: 0,
    }

    coneAngle = Math.PI
    firstAttack: string = ""
    secondAttack: string = ""
    firstAttackAngle: number = 0
    secondAttackAngle: number = 0

    onCastStart(){
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const types = ["Swipe", "Sweep"]

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Randomize patterns
        this.firstAttack = Phaser.Utils.Array.GetRandom(types)
        if (this.firstAttack === "Sweep") {
            this.firstAttackAngle = angle + Math.PI
        } else {
            this.firstAttackAngle = angle
        }
        this.secondAttack = Phaser.Utils.Array.GetRandom(types)
        if (this.secondAttack === "Sweep") {
            this.secondAttackAngle = angle + Math.PI
        } else {
            this.secondAttackAngle = angle
        }

        this.config.name = `${this.firstAttack} - ${this.secondAttack}`

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            angle,
        )

        //Draw first telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.firstAttackAngle,
                this.config.range,
                this.coneAngle
            )
        })

        //Check first attack hit
        this.scene.time.delayedCall((this.config.castTime), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.checkHit(this.firstAttackAngle)

            this.telegraph?.destroy()
            this.telegraph = undefined
        })

        //Draw second telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime + 700), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.secondAttackAngle,
                this.config.range,
                this.coneAngle
            )
        })

        //Check second attack hit
        this.scene.time.delayedCall((this.config.castTime + 1100), () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.checkHit(this.secondAttackAngle)
            this.telegraph?.destroy()
            this.telegraph = undefined
            this.indicator?.destroy()
            this.indicator = undefined
        })
    }

    checkHit(angle: number) {
        let hit = false

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )
        if (dist <= this.config.range + this.player.hurtboxRadius) {

            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y,
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - angle
            )

            if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                hit = true
            }
        }
        
        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.indicator?.destroy()
        this.indicator = undefined
        
    }
}