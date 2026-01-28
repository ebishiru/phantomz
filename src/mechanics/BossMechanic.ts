import Phaser from "phaser";

export default class BossMechanic {
    scene: Phaser.Scene
    boss: any
    player: any

    active = true
    isCasting = false
    lastUsedAt = 0
    telegraph?: any

    config = {
        id: "",
        name: "",
        castTime: 0,
        cooldown: 0,
        showCastBar: false,
        damage: 0,
        range: 0,
        width: 0,
    }

    constructor(scene: Phaser.Scene, boss: any, player: any) {
        this.scene = scene
        this.boss = boss
        this.player = player
    }

    trigger() {
        if (!this.active || this.boss.health <= 0 ) return
        if (this.isCasting) return
        if (this.isOnCooldown()) return

        const castTime = this.config.castTime || 0
        this.isCasting = true

        this.onCastStart()

        if (this.config.showCastBar && castTime > 0) {
            this.onCastStart()
        }

        if (castTime <= 0) {
            this.lastUsedAt = this.scene.time.now
            this.execute()
            this.isCasting = false
            return
        }

        this.scene.time.delayedCall(castTime, () => {
            if (!this.active || this.boss.health <= 0 ) return
            this.lastUsedAt = this.scene.time.now
            this.execute()
            this.isCasting = false
        })
    }

    isOnCooldown() {
        if (!this.config.cooldown || this.config.cooldown <= 0) return false
        return this.scene.time.now < this.lastUsedAt + this.config.cooldown
    }

    onCastStart() {}

    execute() {}

    destroy() {
        this.telegraph?.destroy()
        this.telegraph = undefined
        this.active = false
        this.isCasting = false
    }
}