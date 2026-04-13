import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss16MechA extends BossMechanic {

    config = {
        id: "jump-player-dash-boss",
        name: "Savage Dash",
        castTime: 800,
        castDuration: 800,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 90,
        width: 120,
    }

    dashOffset: number = 0

    startX: number = 0
    startY: number = 0
    endX: number = 0
    endY: number = 0

    circleTelegraph: CircleTelegraph | null = null
    lineTelegraph: LineTelegraph | null = null

    onCastStart() {
        this.startX = this.player.x
        this.startY = this.player.y
        this.endX = this.boss.x
        this.endY = this.boss.y

        //Draw circle telegraph
        this.circleTelegraph = new CircleTelegraph(
            this.scene,
            this.startX,
            this.startY,
            this.config.range,
        )
    }

    execute() {
        const angle = Phaser.Math.Angle.Between(
            this.startX,
            this.startY,
            this.endX,
            this.endY,
        )

        const distance = Phaser.Math.Distance.Between(
            this.startX,
            this.startY,
            this.endX,
            this.endY,
        )

        this.endX = this.startX + Math.cos(angle) * this.dashOffset
        this.endY = this.startY + Math.sin(angle) * this.dashOffset 

        //Jump Boss to player
        this.scene.tweens.add({
            targets: this.boss,
            x: this.startX,
            y: this.startY,
            duration: 200,
            onComplete: () => {
                //Remove circle telegraph
                if (this.circleTelegraph) {
                    this.circleTelegraph.destroy()
                    this.circleTelegraph = null
                }

                //Damage Check for Circle Telegraph
                const hit = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.startX,
                    this.startY
                ) <= (this.config.range + this.player.hurtboxRadius)

                if (hit) {
                    this.player.takeDamage(this.config.damage)
                }

                //Draw line telegraph
                this.lineTelegraph = new LineTelegraph(
                    this.scene,
                    this.startX,
                    this.startY,
                    angle,
                    distance,
                    this.config.width,
                )

                this.scene.tweens.add({
                    targets: this.boss,
                    x: this.endX,
                    y: this.endY,
                    duration: 200,
                    onComplete: () => {
                        //Remove line telegraph
                        if (this.lineTelegraph) {
                            this.lineTelegraph.destroy()
                            this.lineTelegraph = null
                        }

                        //Damage Check for Line Telegraph
                        const hit = Phaser.Math.Distance.Between(
                            this.player.x,
                            this.player.y,
                            this.endX,
                            this.endY
                        ) <= (this.config.width + this.player.hurtboxRadius)

                        if (hit) {
                            this.player.takeDamage(this.config.damage)
                        }
                    }
                })
            }
        })
    }

    destroy() {
        if (this.circleTelegraph) {
            this.circleTelegraph.destroy()
            this.circleTelegraph = null
        }
        if (this.lineTelegraph) {
            this.lineTelegraph.destroy()
            this.lineTelegraph = null
        }
    }

}