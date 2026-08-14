import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss14MechD extends BossMechanic {

    config = {
        id: "knockback-circles",
        name: "Wingburst",
        castTime: 1300,
        castDuration: 1700,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 0,
    }

    distanceFromCenter = 200
    knockbackDistance = 200

    telegraphs: CircleTelegraph[] = []
    indicators: DirectionIndicator[] = []
    telegraphPositions: {x: number, y: number}[] = []

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return
        
        this.telegraphPositions = []

        const screen = this.scene.scale
        const centerX = screen.width / 2
        const centerY = screen.height / 2

        //Move boss to center
        this.scene.tweens.add({
            targets: this.boss,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: "Power2",
            onComplete: () => {

                //Create 3 randomized damage circles
                const sliceSize = (Math.PI * 2) / 3

                for ( let i = 0; i < 3; i++) {
                    //Random angle within slice
                    const angle = (i * sliceSize) + Phaser.Math.FloatBetween(0, sliceSize)

                    const x = centerX + Math.cos(angle) * this.distanceFromCenter
                    const y = centerY + Math.sin(angle) * this.distanceFromCenter
                    this.telegraphPositions.push({x, y})

                    const telegraph = new CircleTelegraph(
                        this.scene,
                        x,
                        y,
                        this.config.range
                    )
                    this.telegraphs.push(telegraph)
                }

                //Create indicators around boss
                let indicatorAngle = 0
                for ( let j = 0; j < 8; j++) {
                    const indicator = new DirectionIndicator(
                        this.scene,
                        this.boss,
                        indicatorAngle,
                        15
                    )
                    this.indicators.push(indicator)
                    indicatorAngle += Math.PI/4
                }
                
                
                this.scene.time.delayedCall(1000, () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return
                    //remove indicators
                    this.indicators.forEach(i => i.destroy())
                    this.indicators = []
                    this.performKnockback()

                })

                this.scene.time.delayedCall(1400, () => {
                    this.hitCheck()
                })
            }
        })

    }

    performKnockback() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

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
            duration: 300,
            ease: "Cubic.easeOut",
        })
    }

    hitCheck() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

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

                if (dist <= this.config.range + this.player.hurtboxRadius) {
                    hit = true
                }
            }
            t.destroy()
        })

        this.telegraphs = []

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }
    }

    destroy() {
        this.telegraphs.forEach( t => t.destroy())
        this.telegraphs = []
        this.indicators.forEach( i => i.destroy())
        this.indicators = []
        this.telegraphPositions = []
    }
}