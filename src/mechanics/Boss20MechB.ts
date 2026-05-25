import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss20MechB extends BossMechanic {

    config = {
        id: "line-dash-left-or-right-cone",
        name: "",
        castTime: 1200,
        castDuration: 1800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 350,
        width: 50, 
    }

    coneAngle = Math.PI * 3 / 2
    direction: string = "Dexter"
    coneDirectionMod: number = 0

    lineTelegraph?: LineTelegraph
    coneTelegraph?: ConeTelegraph

    onCastStart() {
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        const directions = ["Dexter", "Sinister"]
        this.direction = Phaser.Utils.Array.GetRandom(directions)
        this.config.name = `Lunging ${this.direction} Cleaver`

        switch( this.direction ) {
            case "Dexter":
                this.coneDirectionMod = Math.PI / 2
                break
            case "Sinister":
                this.coneDirectionMod = -Math.PI / 2
                break
        }

        const startX = this.boss.x
        const startY = this.boss.y
        const dashX = this.player.x
        const dashY = this.player.y

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        const distance = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y,
        )

        //Draw indicator
        this.indicator = new DirectionIndicator(
            this.scene,
            this.boss,
            angle
        )

        //Draw line telegraph
        this.lineTelegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            distance,
            this.config.width
        )

        this.scene.time.delayedCall((this.config.castTime - 300), () => {
            if (!this.boss || this.boss.health <= 0|| !this.active) return

            //Remove indicator
            this.indicator?.destroy()
            this.indicator = undefined

            //Boss dashes to player position
            this.scene.tweens.add({
                targets: this.boss,
                x: dashX,
                y: dashY,
                duration: 300,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    //Check hit
                    this.lineDamageCheck(startX, startY, dashX, dashY)

                    //Remove line telegraph
                    this.lineTelegraph?.destroy()
                    this.lineTelegraph = undefined

                    //Draw cone telegraph
                    this.coneTelegraph = new ConeTelegraph(
                        this.scene,
                        this.boss.x,
                        this.boss.y,
                        angle + this.coneDirectionMod,
                        this.config.range,
                        this.coneAngle
                    )

                    this.scene.time.delayedCall(300, () => {
                        //Check hit
                        this.coneDamageCheck(angle + this.coneDirectionMod)
                        
                        //Remove cone telegraph
                        this.coneTelegraph?.destroy()
                        this.coneTelegraph = undefined
                        
                    })
                }
            })
        })
    }

    lineDamageCheck(startX: number, startY: number, endX: number, endY: number) {
        if (!this.boss || this.boss.health <= 0|| !this.active) return

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
        const closestX = startX + t * (endX - startX);
        const closestY = startY + t * (endY - startY);

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);

        if (distanceToLine <= pr + this.config.width / 2) {
            this.player.takeDamage(this.config.damage);
        }
    }

    coneDamageCheck(coneDirection: number) {
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
                this.player.y,
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - coneDirection
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
        this.lineTelegraph?.destroy()
        this.lineTelegraph = undefined
        this.coneTelegraph?.destroy()
        this.coneTelegraph = undefined
        this.indicator?.destroy()
        this.indicator = undefined
    }
}
