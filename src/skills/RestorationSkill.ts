import Phaser from "phaser";
import Skill from "./Skill";

export default class RestorationSkill extends Skill {
    player: any
    healingValue: number = 4
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "restoration", "Restoration", 0, 5000, 0)
        this.iconKey = "restoration-icon"
        this.player = player
    }

    activate() {
        //VFX icon
        const restorationVFX = this.scene.add.image(this.player.x, this.player.y - 25, "restoration-vfx");
        restorationVFX.setScale(2).setDepth(11);

        this.scene.tweens.add({
            targets: restorationVFX,
            y: restorationVFX.y - 30,
            alpha: 0,
            duration: 800,
            ease: "Cubic-easeOut",
            onComplete: () => restorationVFX.destroy(),
        })
        
        this.player.heal(this.healingValue)
    }
}