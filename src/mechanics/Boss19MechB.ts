import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss19MechB extends BossMechanic {

    config = {
        id: "expand-cross-rectangle-player",
        name: "Absolute Rimecross",
        castTime: 800,
        castDuration: 800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 100,
    }

    telegraphs: RectangleTelegraph[] = []
    thinwidth: number = this.config.width / 5

    onCastStart() {
        const centerX = this.player.x
        const centerY = this.player.y

        const bounds = this.scene.physics.world.bounds

        //Draw preliminary vertical telegraph
        const vertical = new RectangleTelegraph(
            this.scene,
            centerX - this.thinwidth /2,
            bounds.y,
            this.thinwidth,
            bounds.height
        )

        //Draw preliminary horizontal telegraph
        const horizontal = new RectangleTelegraph(
            this.scene,
            bounds.x,
            centerY - this.thinwidth /2,
            bounds.width,
            this.thinwidth,
        )
        this.telegraphs.push(vertical, horizontal)

        // After cast time, expand telegraphs to full size
        this.scene.time.delayedCall(this.config.castTime - 100, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.telegraphs.forEach(telegraph => telegraph.destroy())
            this.telegraphs = []

            const vertical = new RectangleTelegraph(
                this.scene,
                centerX - this.config.width /2,
                bounds.y,
                this.config.width,
                bounds.height
            )

            const horizontal = new RectangleTelegraph(
                this.scene,
                bounds.x,
                centerY - this.config.width /2,
                bounds.width,
                this.config.width,
            )

            this.telegraphs.push(vertical, horizontal)
        })
    }

        execute() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        let hit = false
        for (const telegraph of this.telegraphs) {
            // Check if player is within the rectangular telegraph area
            if (
                this.player.x >= telegraph.x &&
                this.player.x <= telegraph.x + telegraph.width &&
                this.player.y >= telegraph.y &&
                this.player.y <= telegraph.y + telegraph.height
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
            telegraph.destroy()
        }
        this.telegraphs = []
    }

    destroy() {
        for (const telegraph of this.telegraphs) {
            telegraph.destroy()
        }
        this.telegraphs = []
    }
}