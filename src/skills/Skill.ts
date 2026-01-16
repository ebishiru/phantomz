import Phaser from "phaser"

export default class Skill {
    enabled: boolean
    cooldown: number
    lastUsed: number
    scene: Phaser.Scene

    constructor(scene: Phaser.Scene, cooldown: number) {
        this.scene = scene
        this.cooldown = cooldown
        this.lastUsed = 0
        this.enabled = true
    }

    canUse(time: number) {
        return this.enabled && (time >= this.lastUsed + this.cooldown)
    }

    use(time: number) {
        if (!this.canUse(time)) return
        this.lastUsed = time
        this.activate()
    }

    activate() {}
}