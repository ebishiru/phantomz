import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss9MechB extends BossMechanic {

    config = {
        id: "circle-stay-player",
        name: "Infested Ground",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 50,
        width: 0,
    }

    telegraphs: CircleTelegraph[] = []
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
            delay: 1000,
            loop: true,
            callback: () => this.hitCheck(telegraph)
        })
        this.damageTimers.push(damageTimer)

        const lifetimeTimer = this.scene.time.delayedCall(15000, () => {
            telegraph.destroy()
            this.telegraphs = this.telegraphs.filter(t => t !== telegraph)
            this.damageTimers = this.damageTimers.filter(dt => dt !== damageTimer)
            this.lifetimeTimers = this.lifetimeTimers.filter(lt => lt !== lifetimeTimer)
            damageTimer.remove()
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

        this.telegraphs = []
        this.damageTimers = []
        this.lifetimeTimers = []
    }
}