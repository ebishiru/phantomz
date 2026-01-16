import Phaser from "phaser";
import Skill from "./Skill";

export default class ArrowSkill extends Skill {
    player: any
    boss: any
    
    constructor(scene: Phaser.Scene, player: any, boss: any, cooldown: number) {
        super(scene, cooldown)
        this.player = player
        this.boss = boss
    }

    activate() {
        const g = this.scene.add.graphics()
        g.lineStyle(4, 0x00ff00, 0.6)
        g.beginPath()
        g.moveTo(this.player.x, this.player.y)
        g.lineTo(this.boss.x, this.boss.y)
        g.strokePath()

        this.boss.takeDamage(10)
    }
}