import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss6MechB extends BossMechanic {

    config = {
        id: "line-stay-boss-player",
        name: "Major Venom Spit",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 10,
        range: 700,
        width: 80,
    }

    telegraphs: LineTelegraph[] = []
    damageTimers: Phaser.Time.TimerEvent[] = []
    lifetimeTimers: Phaser.Time.TimerEvent[] = []

    onCastStart() {
        const startX = this.boss.x
        const startY = this.boss.y
        const angle = Phaser.Math.Angle.Between(
            startX,
            startY,
            this.player.x,
            this.player.y,
        )

        //Draw Telegraph
        const telegraph = new LineTelegraph(
            this.scene,
            startX,
            startY,
            angle,
            this.config.range,
            this.config.width,
        )
        this.telegraphs.push(telegraph)

        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 || !this.active) return
            
            const damageTimer = this.scene.time.addEvent({
                delay: 500,
                loop: true,
                callback: () => this.hitCheck(telegraph, startX, startY, angle)
            })
            this.damageTimers.push(damageTimer)

            const lifetimeTimer = this.scene.time.delayedCall(15000, () => {
                telegraph.destroy()
                this.telegraphs = this.telegraphs.filter(t => t !== telegraph)
                this.damageTimers = this.damageTimers.filter(dt => dt !== damageTimer)
                this.lifetimeTimers = this.lifetimeTimers.filter(lt => lt !== lifetimeTimer)
                damageTimer.remove()
            })
        })
        
    }

    hitCheck(telegraph: LineTelegraph, startX: number, startY: number, angle: number) {
        if (!telegraph) return

        const endX = startX + Math.cos(angle) * this.config.range
        const endY = startY + Math.sin(angle) * this.config.range

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineDX = endX - startX
        const lineDY = endY - startY
        const lineLenSq = lineDX * lineDX + lineDY * lineDY

        // projection factor t along the line
        let t = ((px - startX) * lineDX + (py - startY) * lineDY) / lineLenSq

        // reject points behind the start
        if (t < 0 || t > 1) return

        const closestX = startX + t * lineDX
        const closestY = startY + t * lineDY

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY)

        if (distanceToLine <= (this.config.width / 2) + pr) {
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