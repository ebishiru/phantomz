import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import LineTelegraph from "../entities/LineTelegraph";

export default class Boss26MechA extends BossMechanic {

    config = {
        id: "cone-boss-dash-line-stay",
        name: "Inferno Devastation",
        castTime: 1000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 300,
        width: 100,
    }

    coneAngle = Math.PI / 2
    lineTelegraphs: LineTelegraph[] = []
    damageTimers: Phaser.Time.TimerEvent[] = []
    lifetimeTimers: Phaser.Time.TimerEvent[] = []

    onCastStart() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        //Draw Cone Telegraph
        this.telegraph = new ConeTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            this.config.range,
            this.coneAngle
        )
    }

    execute() {
        //Check cone hit
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
            this.player.y,
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.telegraph.angle
            )

            if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                this.player.takeDamage(this.config.damage)
            }
        }

        this.telegraph?.destroy()
        this.telegraph = undefined

        //Draw line telegraph towards player
        const lineTelegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angleToPlayer,
            dist,
            this.config.width
        )
        this.lineTelegraphs.push(lineTelegraph)

        //Snapshow current positions
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = this.player.x
        const endY = this.player.y

        this.scene.time.delayedCall((700), () => {
            //Move Boss
            this.scene.tweens.add({
                targets: this.boss,
                x: endX,
                y: endY,
                duration: 300,
            })

            //Create constant line hit check
            const damageTimer = this.scene.time.addEvent({
                delay: 500,
                loop: true,
                callback: () => this.lineHitCheck(lineTelegraph, startX, startY, angleToPlayer, dist)
            })
            this.damageTimers.push(damageTimer)

            //Define line lifetime (15s)
            const lifetimeTimer = this.scene.time.delayedCall(15000, () => {
                lineTelegraph?.destroy()
                this.lineTelegraphs = this.lineTelegraphs.filter(t => t !== this.telegraph)
                this.damageTimers = this.damageTimers.filter(dt => dt !== damageTimer)
                this.lifetimeTimers = this.lifetimeTimers.filter(lt => lt !== lifetimeTimer)
                damageTimer.remove()
            })
        })
    }

    lineHitCheck(telegraph: LineTelegraph, startX: number, startY: number, angle: number, dist: number) {
        if (!telegraph) return

        const endX = startX + Math.cos(angle) * dist
        const endY = startY + Math.sin(angle) * dist

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
            this.player.takeDamage(this.config.damage / 2)
        }
    }

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.lineTelegraphs.forEach(t => t.destroy())
        this.damageTimers.forEach(dt => dt.destroy())
        this.lifetimeTimers.forEach(lt => lt.destroy())

        this.lineTelegraphs = []
        this.damageTimers = []
        this.lifetimeTimers = []
    }
}