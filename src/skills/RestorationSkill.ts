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
        //VFX icon
        const icon = this.scene.add.image(this.player.x, this.player.y - 50, "restoration-icon");
        icon.setScale(2).setDepth(1000);

        this.scene.tweens.add({
            targets: icon,
            y: icon.y - 30,
            alpha: 0,
            duration: 800,
            ease: "Cubic-easeOut",
            onComplete: () => icon.destroy(),
        })
        
        this.player.heal(this.healingValue)
    }
}