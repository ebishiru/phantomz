import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss14MechD extends BossMechanic {

    config = {
        id: "knockback-circles",
        name: "",
        castTime: 1800,
        castDuration: 2500,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 90,
        width: 0,
    }

    pattern: string = "Cross"
    distanceFromCenter = 200
    rotationAngle = 0
    knockbackDistance = 200
    telegraphs: CircleTelegraph[] = []
    indicators: DirectionIndicator[] = []
    directionalangles = [Math.PI, Math.PI*3/4, Math.PI/2, Math.PI/4, 0, -Math.PI/4, -Math.PI/2, -Math.PI*3/4]

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return
        
        const screen = this.scene.scale
        const leapX = screen.width / 2
        const leapY = screen.height / 2

        this.scene.tweens.add({
            targets: this.boss,
            x: leapX,
            y: leapY,
            duration: 300,
            ease: "Power2",
            onComplete: () => {
                //Create direcional indicators
                this.directionalangles.forEach(dirAngle => {
                    this.indicator = new DirectionIndicator(
                        this.scene,
                        this.boss,
                        dirAngle,
                    )
                    this.indicators.push(this.indicator)
                })
            }
        })

        //Choose Cardinals or Corners
        const patterns = ["Cross", "Oblique"]
        this.pattern = Phaser.Utils.Array.GetRandom(patterns)
        this.config.name = `Wingburst: ${this.pattern}`
        this.rotationAngle = 0
        switch (this.pattern) {
            case "Cross":
                break;
            case "Oblique":
                this.rotationAngle += Math.PI / 4
                break
        }

        //Draw circle telegraphs
        this.scene.time.delayedCall((this.config.castTime - 800), () => {

            for (let i = 0; i < 4; i++) {
                const angle = this.rotationAngle + i * (Math.PI / 2)

                const x = this.boss.x + Math.cos(angle) * this.distanceFromCenter
                const y = this.boss.y + Math.sin(angle) * this.distanceFromCenter

                const telegraph = new CircleTelegraph(
                    this.scene,
                    x,
                    y,
                    this.config.range,
                )
                this.telegraphs.push(telegraph)
            }
        })
    }

    execute() {
        //Remove indicators
        this.indicators.forEach( i => i.destroy())
        this.indicators = []

        //Push player back
        const angleFromBoss = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        const distFromBoss = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.boss.x,
            this.boss.y,
        )

        const maxDist = 300
        const strength = Phaser.Math.Clamp(1 - distFromBoss / maxDist, 0.3, 1)
        const finalKnockback = this.knockbackDistance * strength

        const endX = this.player.x + Math.cos(angleFromBoss) * finalKnockback
        const endY = this.player.y + Math.sin(angleFromBoss) * finalKnockback

        this.scene.tweens.add({
            targets: this.player,
            x: endX,
            y: endY,
            duration: 400,
            ease: "Cubic.easeOut",
        })

        this.scene.time.delayedCall(500, () => {
            this.hitCheck()
        })
    }

    hitCheck() {
        //Check hit
        let hit = false

        this.telegraphs.forEach(t => {
            if (!hit) {
                const dist = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    t.x,
                    t.y,
                )

                if (dist <= this.config.range) {
                    hit = true
                }
            }
            t.destroy()
        })

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraphs.forEach( t => t.destroy())
        this.telegraphs = []
        this.indicators.forEach( i => i.destroy())
        this.indicators = []
    }
}