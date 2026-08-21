import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss14MechC extends BossMechanic {

    config = {
        id: "cross-rectangle-player",
        name: "Rimecross",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 80,
    }

    telegraphs: RectangleTelegraph[] = []

    onCastStart() {
        const centerX = this.player.x
        const centerY = this.player.y

        const bounds = this.scene.physics.world.bounds

        //Draw vertical telegraph
        const vertical = new RectangleTelegraph(
            this.scene,
            centerX - this.config.width /2,
            bounds.y,
            this.config.width,
            bounds.height
        )

        //Draw horizontal telegraph
        const horizontal = new RectangleTelegraph(
            this.scene,
            bounds.x,
            centerY - this.config.width /2,
            bounds.width,
            this.config.width,
        )
        this.telegraphs.push(vertical, horizontal)

        //Boss jumps to center
        this.scene.time.delayedCall(this.config.castTime - 200, () => {
            this.scene.tweens.add({
                targets: this.boss,
                x: centerX,
                y: centerY,
                duration: 200,
                ease: "Power2"
            })
        })
    }

    execute() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const r = this.player.hurtboxRadius

        let hit = false
        for (const telegraph of this.telegraphs) {
            // Check if player is within the rectangular telegraph area
            if (
                this.player.x + r >= telegraph.x &&
                this.player.x - r <= telegraph.x + telegraph.width &&
                this.player.y + r >= telegraph.y &&
                this.player.y - r <= telegraph.y + telegraph.height
            ) {
                hit = true
                break
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
            this.destroy()
        }

        for (const telegraph of this.telegraphs) {
            telegraph?.destroy()
        }
        this.telegraphs = []
    }

    destroy() {
        for (const telegraph of this.telegraphs) {
            telegraph?.destroy()
        }
        this.telegraphs = []
    }
}