import Phaser from "phaser"
import Skill from "./Skill"

export default class WardSkill extends Skill {
    player: any
    shieldDuration: number = 1000

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "ward", "Ward", 0, 10000, 0)
        this.iconKey = "ward-icon"
        this.player = player
    }

    activate() {
        if (this.player.isInvulnerable) return

        this.player.isInvulnerable = true

        //Add VFX overlay on player
        const overlay = this.scene.add.image(this.player.x, this.player.y, "ward-vfx");
        overlay.setScale(2).setDepth(1000);

        const follow = () => {
            overlay.setPosition(this.player.x, this.player.y)
        }

        this.scene.events.on("update", follow)

        this.scene.time.delayedCall(this.shieldDuration, () => {
            this.player.isInvulnerable = false

            overlay.destroy()

            this.scene.events.off("update", follow)
        })
    }
}