import Phaser from "phaser"

export default class Skill {
    id: string
    name: string
    damage: number
    cooldown: number
    range: number
    healingValue?: number
    lastUsed: number
    enabled: boolean
    scene: Phaser.Scene
    pausedAt?: number
    iconKey!: string

    constructor(scene: Phaser.Scene, id: string, name: string, damage: number, cooldown: number, range: number) {
        this.scene = scene
        this.id = id
        this.name = name
        this.damage = damage
        this.cooldown = cooldown
        this.range = range
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

    remainingCooldown(time: number) {
        return Math.max(0, this.cooldown - (time - this.lastUsed))
    }

    pause(time: number) {
        this.pausedAt = this.remainingCooldown(time)
    }

    resume(time: number) {
        if (this.pausedAt !== undefined) {
            this.lastUsed = time - (this.cooldown - this.pausedAt)
            this.pausedAt = undefined
        }
    }

    buffDamage(amount: number) {
        this.damage += amount
    }

    buffCooldown(amount: number) {
        this.cooldown = Math.max(50, this.cooldown - amount)
    }

    buffRange(amount: number) {
        this.range += amount
    }

    buffHeal(amount: number) {
        if (this.healingValue !== undefined) {
            this.healingValue += amount
        }
    }

    activate() {}
}