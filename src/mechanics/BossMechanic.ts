import Phaser from "phaser";

export default class BossMechanic {
    scene: Phaser.Scene
    boss: any
    player: any
    active: boolean = true

    lastUsedAt = 0

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
        if (this.isOnCooldown()) return

        this.lastUsedAt = this.scene.time.now

        const castTime = this.config.castTime || 0

        if (this.config.showCastBar && castTime > 0) {
            this.onCastStart(castTime)
        }

        if (castTime <= 0) {
            this.execute()
            return
        }

        this.scene.time.delayedCall(castTime, () => {
            if (!this.active || this.boss.health <= 0 ) return
            this.execute()
        })
    }

    isOnCooldown() {
        if (!this.config.cooldown || this.config.cooldown <= 0) return false
        return this.scene.time.now < this.lastUsedAt + this.config.cooldown
    }

    onCastStart(castTime: number) {}

    execute() {}

    destroy() {
        this.active = false
    }
}