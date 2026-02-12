import Phaser from "phaser";
import Skill from "./Skill";

export default class ThrustSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "thrust", "Thrust", 15, 3500, 100)
        this.iconKey = "thrust-icon"
        this.player = player
    }

    activate() {
        const dx = this.player.facing.x
        const dy = this.player.facing.y

        const facingAngle = Math.atan2(dy, dx);

        const startX = this.player.x
        const startY = this.player.y

        const endX = startX + (dx * this.range)
        const endY = startY + (dy * this.range)
        const width = 30

        //Add Graphics
        const g = this.scene.add.graphics()
        g.lineStyle(width/2, 0xeffae6, 0.5)
        g.beginPath()
        g.moveTo(startX, startY)
        g.lineTo(endX, endY)
        g.strokePath()

        this.scene.tweens.add({
            targets: g,
            alpha: 0,
            duration: 200,
            onComplete: () => g.destroy()
        })

        //VFX
        this.scene.time.delayedCall(16, () => {
            const thrustVFX = this.scene.add.sprite(this.player.x, this.player.y, "thrust-vfx")

            thrustVFX.setOrigin(0, 0.5)
            thrustVFX.setScale(3)
            thrustVFX.setDepth(10)
            thrustVFX.setRotation(facingAngle)

            this.scene.tweens.add({
                targets: { t: 0},
                t: 1,
                duration: 120,
                ease: "Sine.easeOut",
                onUpdate: (tween, target: any) => {
                    thrustVFX.x = this.player.x
                    thrustVFX.y = this.player.y
                },
                onComplete: () => thrustVFX.destroy()
            })
        })

        //Player Dash
        this.scene.tweens.add({
            targets: this.player,
            x: endX,
            y: endY,
            duration: 120,
            ease: "Sine.easeOut"
        })

        //Check Hit
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const lineLength = this.range
        const toBossX = boss.x - startX
        const toBossY = boss.y - startY

        // dot product to get projection
        const proj = toBossX * dx + toBossY * dy
        const clampedProj = Math.max(0, Math.min(lineLength, proj))

        // closest point on line
        const closestX = startX + dx * clampedProj
        const closestY = startY + dy * clampedProj

        // distance from boss to line
        const dist = Phaser.Math.Distance.Between(boss.x, boss.y, closestX, closestY)

        if (dist <= width / 2 + boss.hurtRadius) {
            boss.takeDamage(this.damage)
        }
    }
}