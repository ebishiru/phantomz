import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss17MechB extends BossMechanic {

    config = {
        id: "circle-stay-delay-explode-player",
        name: "Rot Eruption",
        castTime: 800,
        castDuration: 800,
        cooldown: 2000,
        showCastBar: true,
        damage: 10,
        range: 90,
        width: 0,
    }

    telegraphs: CircleTelegraph[] = []
    explodeTelegraphs: CircleTelegraph[] = []
    damageTimers: Phaser.Time.TimerEvent[] = []
    lifetimeTimers: Phaser.Time.TimerEvent[] = []

    onCastStart() {
        const endX = this.player.x
        const endY = this.player.y
        //Draw telegraph
        const telegraph = new CircleTelegraph(
            this.scene,
            endX,
            endY,
            this.config.range
        )
        this.telegraphs.push(telegraph)

        const damageTimer = this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => this.hitCheck(telegraph)
        })
        this.damageTimers.push(damageTimer)

        const lifetimeTimer = this.scene.time.delayedCall(7300, () => {

            telegraph.destroy()
            this.telegraphs = this.telegraphs.filter(t => t !== telegraph)
            this.damageTimers = this.damageTimers.filter(dt => dt !== damageTimer)
            damageTimer.remove()

            this.scene.time.delayedCall(200, () => {
                //Draw explosion telegraph
                const explodeTelegraph = new CircleTelegraph(
                    this.scene,
                    endX,
                    endY,
                    this.config.range * 2
                )
                this.explodeTelegraphs.push(explodeTelegraph)
                this.scene.tweens.add({
                    targets: this.boss,
                    x: endX,
                    y: endY,
                    duration: 200,
                    ease: "Power2.Out",
                    onComplete: () => {
                        this.hitCheck(explodeTelegraph)
                        this.lifetimeTimers = this.lifetimeTimers.filter(lt => lt !== lifetimeTimer)
                        this.explodeTelegraphs = this.explodeTelegraphs.filter(et => et !== explodeTelegraph)
                        explodeTelegraph.destroy()
                    }
                })
            })
        })
        this.lifetimeTimers.push(lifetimeTimer)      
    }

    hitCheck(telegraph: CircleTelegraph) {
        if (!telegraph) return

        const dx = this.player.x - telegraph.x
        const dy = this.player.y - telegraph.y
        const distanceSq = dx * dx + dy * dy

        if (distanceSq <= telegraph.radius * telegraph.radius) {
            this.player.takeDamage(this.config.damage)
        }
    }
    
    destroy() {
        this.telegraphs.forEach(t => t.destroy())
        this.damageTimers.forEach(dt => dt.remove())
        this.lifetimeTimers.forEach(lt => lt.remove())
        this.explodeTelegraphs.forEach(et => et.destroy())

        this.telegraphs = []
        this.damageTimers = []
        this.lifetimeTimers = []
        this.explodeTelegraphs = []
    }
}