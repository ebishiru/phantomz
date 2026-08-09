import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import DonutTelegraph from "../entities/DonutTelegraph";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss16MechC extends BossMechanic {

    config = {
        id: "moon-shape-safe",
        name: "Lunar Relief",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 175,
        width: 0,
    }

    donutTelegraph: DonutTelegraph | null = null
    circleTelegraph: CircleTelegraph | null = null

    donutInnerRadius: number = 120
    donutOuterRadius: number = 360

    circleRadiusAngle: number = 0
    circleX: number = 0
    circleY: number = 0

    onCastStart() {
        //Draw donut telegraph
        this.donutTelegraph = new DonutTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            this.donutInnerRadius,
            this.donutOuterRadius,
        )

        //Randomize circle telegraph position along inner donut
        this.circleRadiusAngle = Phaser.Math.FloatBetween(0, Math.PI * 2)

        this.circleX = this.boss.x + Math.cos(this.circleRadiusAngle) * this.donutInnerRadius
        this.circleY = this.boss.y + Math.sin(this.circleRadiusAngle) * this.donutInnerRadius

        //Draw circle telegraph
        this.circleTelegraph = new CircleTelegraph(
            this.scene,
            this.circleX,
            this.circleY,
            this.config.range,
        )
    }

    execute() {
        //Check hit
        let hit = false

        const dist = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.boss.x,
            this.boss.y,
        )

        if (dist >= this.donutInnerRadius && dist <= this.donutOuterRadius) {
            hit = true
        }

        const circleDist = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.circleX,
            this.circleY,
        )

        if ( circleDist <= this.config.range + this.player.hurtboxRadius) {
            hit = true
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        //Boss heals
        this.boss.heal(this.config.damage / 4)

        this.donutTelegraph?.destroy()
        this.donutTelegraph = null

        this.circleTelegraph?.destroy()
        this.circleTelegraph = null
    }

    destroy() {
        this.donutTelegraph?.destroy()
        this.donutTelegraph = null

        this.circleTelegraph?.destroy()
        this.circleTelegraph = null
    }

}