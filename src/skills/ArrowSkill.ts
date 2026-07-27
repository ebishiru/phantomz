import Phaser from "phaser";
import Skill from "./Skill";

export default class ArrowSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "arrow", "Arrow", 25, 4000, 0)
        this.iconKey = "arrow-icon"
        this.player = player
    }

    activate() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        //Add Graphics
        // const g = this.scene.add.graphics()
        // g.lineStyle(3, 0x00ff00, 0.6)
        // g.beginPath()
        // g.moveTo(this.player.x, this.player.y)
        // g.lineTo(boss.x, boss.y)
        // g.strokePath()

        // this.scene.time.delayedCall(150, () => g.destroy())

        //VFX
        const dx = boss.x - this.player.x
        const dy = boss.y - this.player.y
        const angle = Math.atan2(dy, dx)

        const arrowVFX = this.scene.add.sprite(this.player.x, this.player.y, "arrow-vfx")

        arrowVFX.setOrigin(0.5, 0.5)
        arrowVFX.setScale(3)
        arrowVFX.setDepth(10)
        arrowVFX.rotation = angle

        this.scene.tweens.add({
            targets: arrowVFX,
            x: boss.x,
            y: boss.y,
            duration: 150,
            onComplete: () => arrowVFX.destroy()
        })


        boss.takeDamage(this.getDamage())

    }
}