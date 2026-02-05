import Phaser from "phaser";
import Skill from "./Skill";

export default class HookSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "hook", "Hook", 10, 7000, 0)
        this.iconKey = "hook-icon"
        this.player = player
    }

    activate() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        //Add Graphics
        const g = this.scene.add.graphics()
        g.lineStyle(3, 0x00ff00, 0.8)
        g.beginPath()
        g.moveTo(this.player.x, this.player.y)
        g.lineTo(boss.x, boss.y)
        g.strokePath()

        boss.takeDamage(this.damage)

        this.scene.time.delayedCall(100, () => g.destroy())

        this.scene.tweens.add({
            targets: this.player,
            x: boss.x,
            y: boss.y,
            duration: 250,
            ease: "Sine.easeInOut",
        })
    }

}