import Phaser from "phaser";
import Skill from "./Skill";

export default class RestorationSkill extends Skill {
    player: any
    healingValue: number = 6
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "restoration", "Restoration", 0, 5000, 0)
        this.iconKey = "restoration-icon"
        this.player = player
    }

    activate() {
        this.player.heal(this.healingValue)
    }
}