import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss15MechB extends BossMechanic {

    config = {
        id: "left-or-right-cone",
        name: "",
        castTime: 2000,
        castDuration: 2000,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 350,
        width: 0,
    }

    coneAngle = Math.PI * 3 / 2
    direction: string = "Dexter"
    coneDirection: number = 0

    onCastStart() {
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        const directions = ["Dexter", "Sinister"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `${this.direction} Cleave`

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        switch( this.direction ) {
            case "Dexter":
                this.coneDirection = angle + Math.PI / 2
                break
            case "Sinister":
                this.coneDirection = angle - Math.PI / 2
                break
        }

        //draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            angle
        )

        //Draw telegraph before hit
        this.scene.time.delayedCall((this.config.castTime - 600), () => {
            if (!this.boss || this.boss.health <= 0|| !this.active) return
            this.telegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                this.coneDirection,
                this.config.range,
                this.coneAngle
            )
        })
    }

    execute() {
        //remove indicator
        this.indicator?.destroy()
        this.indicator = undefined

        //check hit
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        let hit = false;

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
                this.player.y
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.coneDirection
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