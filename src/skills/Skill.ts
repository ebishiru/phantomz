import Phaser from "phaser";
import { CooldownManager } from "../systems/CooldownManager";

export default class Skill {
    id: string;
    name: string;
    damage: number;
    cooldown: number;
    range: number;
    healingValue?: number;
    shieldDuration?: number;
    enabled: boolean;
    scene: Phaser.Scene;
    iconKey!: string;
    player: any;
    level: number = 1;
    private echoDamageMultiplier = 1;
    private echoResetTimer?: Phaser.Time.TimerEvent;

    constructor(
        scene: Phaser.Scene,
        player: any,
        id: string,
        name: string,
        damage: number,
        cooldown: number,
        range: number
    ) {
        this.scene = scene;
        this.player = player;
        this.id = id;
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.range = range;
        this.enabled = true;
    }

    canUse() {
        return !CooldownManager.isOnCooldown(this.id);
    }

    use() {
        if (!this.canUse()) return false;

        // Start cooldown
        CooldownManager.startCooldown(this.id, this.getCooldown());

        const echoTriggered = Math.random() < this.player.statModifiers.echoChance;

        if (this.echoResetTimer) {
            this.echoResetTimer.remove(false);
            this.echoResetTimer = undefined;
        }

        this.echoDamageMultiplier = echoTriggered ? 2 : 1;

        // Skill logic here
        this.activate();

        if (echoTriggered) {
            this.triggerEchoVFX();
            this.echoResetTimer = this.scene.time.delayedCall(Math.max(1000, this.getCooldown() * 0.5), () => {
                this.echoDamageMultiplier = 1;
                this.echoResetTimer = undefined;
            });
        }

        return true;
    }

    buffDamage(amount: number) {
        this.damage += amount;
    }

    buffCooldown(amount: number) {
        this.cooldown = Math.max(50, this.cooldown - amount);
    }

    buffRange(amount: number) {
        this.range += amount;
    }

    buffHeal(amount: number) {
        if (this.healingValue !== undefined) this.healingValue += amount;
    }

    buffShieldDuration(amount: number) {
        if (this.shieldDuration !== undefined) this.shieldDuration += amount;
    }

    getDamage() {
        const mods = this.player.statModifiers;
        let final = (this.damage + mods.flatDamage) * mods.damageMultiplier;

        const boss = (this.scene as any).bossManager?.boss;
        if (boss && this.player.executionerLevel > 0) {
            const threshold = 0.25 + (this.player.executionerLevel - 1) * 0.10;
            if (boss.hp / boss.maxHP <= threshold) final *= 1.25;
        }

        return final * this.echoDamageMultiplier;
    }

    getCooldown() {
        return this.cooldown * this.player.statModifiers.cooldownMultiplier;
    }

    getRange() {
        return this.range * this.player.statModifiers.aoeMultiplier;
    }

    triggerEchoVFX() {
        const icon = this.scene.add.image(this.player.x, this.player.y - 50, "echo-icon");
        icon.setScale(2).setDepth(1000);

        this.scene.tweens.add({
            targets: icon,
            y: icon.y - 30,
            alpha: 0,
            duration: 800,
            ease: "Cubic-easeOut",
            onComplete: () => icon.destroy(),
        });
    }

    activate() {}
}