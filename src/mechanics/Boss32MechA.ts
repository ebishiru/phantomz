import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class Boss32MechA extends BossMechanic {

    config = {
        id: "cone-alternate-thrice",
        name: "Radial Sweep",
        castTime: 1000,
        castDuration: 2600,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 400,
        width: 0,
    }
    
    coneAngle = Math.PI / 4
    coneTelegraphs: ConeTelegraph[] = []

    onCastStart() {
        //Reset cone telegraphs
        this.coneTelegraphs.forEach(coneTelegraph => coneTelegraph.destroy())
        this.coneTelegraphs = []

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        //Draw Cone Telegraphs
        for (let i = 0; i < 4; i++) {
            const coneTelegraph = new ConeTelegraph(
                this.scene,
                this.boss.x,
                this.boss.y,
                angle + (i * Math.PI / 2),
                this.config.range,
                this.coneAngle
            )
            this.coneTelegraphs.push(coneTelegraph)
        }

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            //Check hit for each cone telegraph
            const dist = Phaser.Math.Distance.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y,
            )
            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y
            )

            this.coneTelegraphs.forEach(coneTelegraph => {
                this.checkHit(coneTelegraph, dist, angleToPlayer)

                //Destroy cone telegraph after checking hit
                coneTelegraph.destroy()
            })

            //Reset cone telegraphs
            this.coneTelegraphs.forEach(coneTelegraph => coneTelegraph.destroy())
            this.coneTelegraphs = []

            //Draw alternate cone telegraphs
            for (let i = 0; i < 4; i++) {
                const coneTelegraph = new ConeTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    angle + (i * Math.PI / 2) + (this.coneAngle),
                    this.config.range,
                    this.coneAngle
                )
                this.coneTelegraphs.push(coneTelegraph)
            }

            this.scene.time.delayedCall(800, () => {
                if (!this.boss || this.boss.health <= 0 ||!this.active) return
                //Check hit for each cone telegraph
                const dist = Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )
                const angleToPlayer = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                this.coneTelegraphs.forEach(coneTelegraph => {
                    this.checkHit(coneTelegraph, dist, angleToPlayer)

                    //Destroy cone telegraph after checking hit
                    coneTelegraph.destroy()
                })

                //Reset cone telegraphs
                this.coneTelegraphs.forEach(coneTelegraph => coneTelegraph.destroy())
                this.coneTelegraphs = []

                //Draw alternate cone telegraphs again
                for (let i = 0; i < 4; i++) {
                    const coneTelegraph = new ConeTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        angle + (i * Math.PI / 2),
                        this.config.range,
                        this.coneAngle
                    )
                    this.coneTelegraphs.push(coneTelegraph)
                }

                this.scene.time.delayedCall(800, () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return
                    //Check hit for each cone telegraph
                    const dist = Phaser.Math.Distance.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )
                    const angleToPlayer = Phaser.Math.Angle.Between(
                        this.boss.x,
                        this.boss.y,
                        this.player.x,
                        this.player.y
                    )

                    this.coneTelegraphs.forEach(coneTelegraph => {
                        this.checkHit(coneTelegraph, dist, angleToPlayer)

                        //Destroy cone telegraph after checking hit
                        coneTelegraph.destroy()
                    })
                })
            })
        })
    }

    checkHit(telegraph: ConeTelegraph, dist: number, angle: number) {
        if (dist <= telegraph.radius + this.player.hurtboxRadius) {

            const angleDiff = Phaser.Math.Angle.Wrap(angle - telegraph.angle)

            if (Math.abs(angleDiff) <= telegraph.coneAngle / 2) {
                //Player is hit
                this.player.takeDamage(this.config.damage)
            }
        }
    }

    destroy() {
        this.coneTelegraphs.forEach(coneTelegraph => coneTelegraph.destroy())
        this.coneTelegraphs = []
    }
}