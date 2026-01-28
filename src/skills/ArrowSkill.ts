import Phaser from "phaser";
import Skill from "./Skill";

export default class ArrowSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "arrow", "Arrow", 20, 4000, 0)

        this.player = player
    }

    activate() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        //Add Graphics
        const g = this.scene.add.graphics()
        g.lineStyle(3, 0x00ff00, 0.6)
        g.beginPath()
        g.moveTo(this.player.x, this.player.y)
        g.lineTo(boss.x, boss.y)
        g.strokePath()

        boss.takeDamage(this.damage)

        this.scene.time.delayedCall(300, () => g.destroy())
    }
}