import Phaser from "phaser";
import Skill from "./Skill";

export default class ArrowSkill extends Skill {
    player: any
    boss: any
    
    constructor(scene: Phaser.Scene, player: any, boss: any) {
        super(scene, "arrow", "Arrow", 20, 4000, 0)

        this.player = player
        this.boss = boss
    }

    activate() {
        const g = this.scene.add.graphics()
        g.lineStyle(3, 0x00ff00, 0.6)
        g.beginPath()
        g.moveTo(this.player.x, this.player.y)
        g.lineTo(this.boss.x, this.boss.y)
        g.strokePath()
        this.scene.time.delayedCall(150, () => g.destroy())

        this.boss.takeDamage(this.damage)
    }
}