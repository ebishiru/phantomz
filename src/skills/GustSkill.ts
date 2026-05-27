import Phaser from 'phaser';
import Skill from './Skill';

export default class GustSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "gust", "Gust", 15, 3000, 80)
        this.iconKey = "gust-icon"
        this.player = player
    }

    activate() {
        // cancel any existing knockback/movement tween
        this.scene.tweens.killTweensOf(this.player)
        this.player.body?.setVelocity(0, 0)

        const dx = this.player.facing.x
        const dy = this.player.facing.y

        const facingAngle = Math.atan2(dy, dx);

        const startX = this.player.x
        const startY = this.player.y

        const endX = startX - (dx * this.range)
        const endY = startY - (dy * this.range)
        
        //VFX
        const offsetDistance = this.getRange() * 0.5
        
        const vfxX = this.player.x + Math.cos(facingAngle) * offsetDistance
        const vfxY = this.player.y + Math.sin(facingAngle) * offsetDistance

        const gustVFX = this.scene.add.sprite(vfxX, vfxY, "gust-vfx")

        gustVFX.setRotation(facingAngle)
        gustVFX.setAlpha(1)
        gustVFX.setScale(2.5)
        gustVFX.setDepth(10)

        this.scene.tweens.add({
            targets: gustVFX,
            alpha: 0.5,
            duration: 300,
            onComplete: () => gustVFX.destroy()
        })

        //Player knockback
        this.scene.tweens.add({
            targets: this.player,
            x: endX,
            y: endY,
            duration: 150,
            ease: "Sine.easeOut"
        })

        //Check hit
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const distancetoBossX = boss.x - this.player.x
        const distancetoBossY = boss.y - this.player.y
        const distance = Math.sqrt(distancetoBossX*distancetoBossX + distancetoBossY*distancetoBossY)

        if (distance > this.getRange() + boss.hurtRadius) return

        const diff = Phaser.Math.Angle.Wrap(Math.atan2(distancetoBossY, distancetoBossX) - facingAngle)

        if (Math.abs(diff) > Math.PI/2) return

        boss.takeDamage(this.getDamage())
    }

}