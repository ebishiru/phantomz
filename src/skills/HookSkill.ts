import Phaser from "phaser";
import Skill from "./Skill";

export default class HookSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "hook", "Hook", 25, 5000, 0)
        this.iconKey = "hook-icon"
        this.player = player
    }

    activate() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        // cancel any existing knockback/movement tween
        this.scene.tweens.killTweensOf(this.player)
        this.player.body?.setVelocity(0, 0)

        //Add Graphics
        const g = this.scene.add.graphics()
        g.lineStyle(2, 0xeffae6, 0.8)
        g.beginPath()
        g.moveTo(this.player.x, this.player.y)
        g.lineTo(boss.x, boss.y)
        g.strokePath()

        this.scene.time.delayedCall(100, () => g.destroy())

        //VFX
        const container = this.scene.add.container(this.player.x, this.player.y)

        const follow = () => {
            container.x = this.player.x
            container.y = this.player.y
        }
        this.scene.events.on('update', follow)

        this.scene.time.delayedCall(450, () => {
            container.destroy()
            this.scene.events.off('update', follow)
        })

        const dx = boss.x - this.player.x
        const dy = boss.y - this.player.y
        const angle = Math.atan2(dy, dx)

        const offsetDistance = 20
        const offsetX = Math.cos(angle) * offsetDistance
        const offsetY = Math.sin(angle) * offsetDistance

        const hookVFX = this.scene.add.sprite(offsetX, offsetY, "hook-vfx")

        hookVFX.setOrigin(0, 0.5)
        hookVFX.setScale(2)
        hookVFX.setDepth(10)
        hookVFX.setRotation(angle)
        container.add(hookVFX)

        this.scene.time.delayedCall(400, () => hookVFX.destroy())

        boss.takeDamage(this.getDamage())

        this.scene.tweens.add({
            targets: this.player,
            x: boss.x,
            y: boss.y,
            duration: 450,
            ease: "Sine.easeInOut",
        })
    }

}