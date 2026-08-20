import Phaser from "phaser";
import Skill from "./Skill";
import { CooldownManager } from "../systems/CooldownManager";

export default class JavelinSkill extends Skill {
    player: any
    activeJavelins: Array<{
        sprite: Phaser.Physics.Arcade.Sprite;
        pickupRadius: number;
        lifetime: number;
        maxLifetime: number;
    }> = [];

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "javelin", "Javelin", 13, 10000, 25)
        this.iconKey = "javelin-icon"
        this.player = player
    }

    activate() {
        const dir = new Phaser.Math.Vector2(
            this.player.facing.x,
            this.player.facing.y
        ).normalize()

        const originX = this.player.x
        const originY = this.player.y

        const castDistance = 125

        const endX = originX + (dir.x * castDistance)
        const endY = originY + (dir.y * castDistance)

        // Create javelin sprite with physics
        const javelinSprite = this.scene.physics.add.sprite(
            endX,
            endY,
            "javelin-vfx"
        ) as Phaser.Physics.Arcade.Sprite;

        javelinSprite.setOrigin(0.5)
        javelinSprite.setAlpha(1)
        javelinSprite.setScale(this.getRange() / 12)
        javelinSprite.setDepth(11)
        javelinSprite.setCollideWorldBounds(true)
        javelinSprite.setBounce(0.3)

        // Track javelin
        const javelinData = {
            sprite: javelinSprite,
            pickupRadius: 30,
            lifetime: 0,
            maxLifetime: 10000 // 10 seconds
        };

        this.activeJavelins.push(javelinData);

        // Check hit with boss
        const boss = (this.scene as any).bossManager?.boss
        if (boss && boss.active) {
            const attackCircle = new Phaser.Geom.Circle(
                endX,
                endY,
                this.getRange()
            )
            const bossCircle = new Phaser.Geom.Circle(
                boss.x,
                boss.y,
                boss.hurtRadius
            )
            const hit = Phaser.Geom.Intersects.CircleToCircle(
                attackCircle, bossCircle
            )
            if (hit) {
                boss.takeDamage(this.getDamage())
            }
        }

        // Update javelin logic in scene update
        const updateJavelin = () => {
            javelinData.lifetime += 16; // ~60fps

            // Check if player picks up javelin
            const dx = this.player.x - javelinSprite.x;
            const dy = this.player.y - javelinSprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < javelinData.pickupRadius) {
                // Pickup - refresh cooldown immediately
                this.refreshCooldown();
                javelinSprite.destroy();
                this.activeJavelins = this.activeJavelins.filter(j => j.sprite !== javelinSprite);
                this.scene.events.off("update", updateJavelin);
                return;
            }

            // Check if javelin expired
            if (javelinData.lifetime >= javelinData.maxLifetime) {
                // Timeout - refresh cooldown and remove
                this.refreshCooldown();
                javelinSprite.destroy();
                this.activeJavelins = this.activeJavelins.filter(j => j.sprite !== javelinSprite);
                this.scene.events.off("update", updateJavelin);
                return;
            }

            // Fade out near end of life
            const fadeStart = javelinData.maxLifetime - 1000; // Fade last 1 second
            if (javelinData.lifetime > fadeStart) {
                const fadeProgress = (javelinData.lifetime - fadeStart) / 1000;
                javelinSprite.setAlpha(1 - fadeProgress);
            }
        };

        // Update every frame
        this.scene.events.on("update", updateJavelin);
    }

    private refreshCooldown() {
        // Immediately refresh cooldown
        CooldownManager.cooldowns[this.id] = Date.now();
    }

    update() {
        // Clean up destroyed javelins
        this.activeJavelins = this.activeJavelins.filter(j => j.sprite.active);
    }
}