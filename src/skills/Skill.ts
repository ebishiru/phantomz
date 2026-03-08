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
    player: any

    constructor(scene: Phaser.Scene, player: any, id: string, name: string, damage: number, cooldown: number, range: number) {
        this.scene = scene
        this.player = player
        this.id = id
        this.name = name
        this.damage = damage
        this.cooldown = cooldown
        this.range = range
        this.lastUsed = 0
        this.enabled = true
    }

    canUse(time: number) {
        return this.enabled && (time >= this.lastUsed + this.getCooldown())
    }

    use(time: number) {
        if (!this.canUse(time)) return
        this.lastUsed = time
        this.activate()

        //Echo Chance
        if (Math.random() < this.player.statModifiers.echoChance) {
            this.activate()
            this.triggerEchoVFX()
        }
    }

    remainingCooldown(time: number) {
        return Math.max(0, this.getCooldown() - (time - this.lastUsed))
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

    getDamage() {
        const mods = this.player.statModifiers
        let final = (this.damage + mods.flatDamage) * mods.damageMultiplier

        const boss = (this.scene as any).bossManager?.boss

        if (
            boss &&
            this.player.executionerLevel > 0
        ) {
            const threshold = 0.25 + (this.player.executionerLevel - 1) * 0.10

            if (boss.hp / boss.maxHP <= threshold) {
                final *= 1.25
            }
        }

        return final
    }

    getCooldown() {
        return (this.cooldown) * this.player.statModifiers.cooldownMultiplier
    }

    getRange() {
        return (this.range) * this.player.statModifiers.aoeMultiplier
    }

    triggerEchoVFX() {
        const icon = this.scene.add.image(this.player.x, this.player.y - 50, "echo-icon")
        icon.setScale(2)
        icon.setDepth(1000);

        this.scene.tweens.add({
            targets: icon,
            y: icon.y - 30,
            alpha: 0,
            duration: 800,
            ease: "Cubic-easeOut",
            onComplete: () => icon.destroy()
        })
    }

    activate() {}
}