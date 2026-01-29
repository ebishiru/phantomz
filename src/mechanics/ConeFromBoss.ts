import Phaser from "phaser"
import BossMechanic from "./BossMechanic"
import ConeTelegraph from "../entities/ConeTelegraph"

export default class ConeFromBoss extends BossMechanic {

    config = {
        id: "cone-boss",
        name: "Screech",
        castTime: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 200,
        width: 0,
    }

    coneAngle = Math.PI / 3

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        //Draw Telegraph
        this.telegraph = new ConeTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range,
            this.coneAngle
        )
    }

    execute() {
        //Check Hit
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
                this.player.y
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.telegraph.angle
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
}