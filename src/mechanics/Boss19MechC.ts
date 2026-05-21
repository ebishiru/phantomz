import Phaser from "phaser"
import BossMechanic from "./BossMechanic"
import CircleTelegraph from "../entities/CircleTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss19MechC extends BossMechanic {

    config = {
        id: "right-left-knockback-circles",
        name: "Greater Wingburst",
        castTime: 1200,
        castDuration: 3000,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 100,
        width: 0,
    }

    distanceFromCenter = 200
    knockbackDistance = 300

    telegraphs: CircleTelegraph[] = []
    indicators: WallIndicators[] = []
    indicatorPositions: {x: number, y: number}[] = []

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        this.indicatorPositions = []

        const screen = this.scene.scale
        const centerX = screen.width / 2
        const centerY = screen.height / 2

        //Create 4 randomized damage indicators
        const sliceSize = (Math.PI * 2) / 4

        for ( let i = 0; i < 4; i++) {
            //Random angle within slice
            const angle = (i * sliceSize) + Phaser.Math.FloatBetween(0, sliceSize)

            const x = centerX + Math.cos(angle) * this.distanceFromCenter
            const y = centerY + Math.sin(angle) * this.distanceFromCenter
            this.indicatorPositions.push({x, y})

            const indicator = new WallIndicator(
                this.scene,
                x,
                y,
                Math.PI / 2,
                10,
            )
            this.indicators.push(indicator)
        }

        //Move boss to Right edge
        this.scene.time.delayedCall(900, () => {
            
            this.scene.tweens.add({
                targets: this.boss,
                x: screen.width - 100,
                y: screen.height / 2,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return

                    this.firstKnockback()

                    //Show circle indicators
                    this.indicatorPositions.forEach( pos => {
                        const telegraph = new CircleTelegraph(
                            this.scene,
                            pos.x,
                            pos.y,
                            this.config.range,
                        )
                        this.telegraphs.push(telegraph)
                    })

                    this.scene.time.delayedCall(500, () => {
                        this.hitCheck()
                    })
                }
            })
        })

        //Move boss to left edge
        this.scene.time.delayedCall(2200, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.scene.tweens.add({
                targets: this.boss,
                x: 100,
                y: screen.height / 2,
                duration: 300,
                ease: "Power2",
                onComplete: () => {
                    if (!this.boss || this.boss.health <= 0 ||!this.active) return

                    this.secondKnockback()

                    //Show circle indicators again
                        this.indicatorPositions.forEach( pos => {
                        const telegraph = new CircleTelegraph(
                            this.scene,
                            pos.x,
                            pos.y,
                            this.config.range,
                        )
                        this.telegraphs.push(telegraph)
                    })

                    this.scene.time.delayedCall(500, () => {
                        this.hitCheck()
                    })
                }
            })
        })
    }

    firstKnockback() {
        //Remove indicators
        this.indicators.forEach( i => i.destroy())
        this.indicators = []

        //Push player back towards the left
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

        const maxDist = 600
        const strength = Phaser.Math.Clamp(1 - distFromBoss / maxDist, 0.7, 1)
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

    secondKnockback() {
        //Push player back towards the right
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

        const maxDist = 600
        const strength = Phaser.Math.Clamp(1 - distFromBoss / maxDist, 0.7, 1)
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

                if (dist <= this.config.range) {
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
        this.indicatorPositions = []
    }
}