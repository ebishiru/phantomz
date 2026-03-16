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

        this.scene.time.delayedCall(this.shieldDuration, () => {
            this.player.isInvulnerable = false
        })
    }
}