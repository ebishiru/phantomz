import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss18MechB extends BossMechanic {

    config = {
        id: "fake-out-right-left-cleave",
        name: "Hex Cleave 2",
        castTime: 1800,
        castDuration: 1800,
        cooldown: 2500,
        showCastBar: true,
        damage: 20,
        range: 400,
        width: 0,
    }

    direction: string = "Right"
    isDirectionReal: boolean = true
    coneAngle = Math.PI * 7 / 5
    facingAngle: number = 0
    attackAngle: number = 0

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const directions = ["Right", "Left"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `Hex Cleave : ${this.direction}?`

        this.isDirectionReal = Phaser.Math.Between(0,1) === 0 ? true : false

        //Randomize angle
        this.facingAngle = Phaser.Math.FloatBetween(-Math.PI, Math.PI)

        this.attackAngle = this.facingAngle

        switch( this.direction ) {
            case "Right":
                if (this.isDirectionReal) {
                    this.attackAngle += Math.PI /2
                    break
                } else {
                    this.attackAngle -= Math.PI /2
                    break
                }
            case "Left":
                if (this.isDirectionReal) {
                    this.attackAngle -= Math.PI /2
                    break
                } else {
                    this.attackAngle += Math.PI /2
                    break
                }
        }

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            this.facingAngle,
        )

        //Conditional ? Icon on Boss
        if (!this.isDirectionReal) {
            const container = this.scene.add.container(this.boss.x, this.boss.y)

            const follow = () => {
                container.x = this.boss.x
                container.y = this.boss.y
            }

            this.scene.events.on('update', follow)

            const fakeoutVFX = this.scene.add.sprite(0, -40, "boss18-fakeout")

            fakeoutVFX.setOrigin(0.5, 0.5)
            fakeoutVFX.setScale(1.5)
            fakeoutVFX.setDepth(20)
            container.add(fakeoutVFX)

            this.scene.time.delayedCall(this.config.castTime, () => container.destroy())
        }

        //Draw telegraph right before hit
        this.scene.time.delayedCall((this.config.castTime - 300), () => {
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