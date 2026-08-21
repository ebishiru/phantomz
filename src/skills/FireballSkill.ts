import Phaser from "phaser";
import Skill from "./Skill";

export default class FireballSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "fireball", "Fireball", 50, 7000, 65)
        this.iconKey = "fireball-icon"
        this.player = player
    }

    activate() {
        // const g = this.scene.add.graphics()

        const dir = new Phaser.Math.Vector2(
            this.player.facing.x,
            this.player.facing.y
        ).normalize()

        const originX = this.player.x
        const originY = this.player.y

        const castDistance = 200
        const bounds = this.player.scene.physics.world.bounds
        const radius = this.getRange()

        const projX = originX + (dir.x * castDistance)
        const projY = originY + (dir.y * castDistance) 

        //Keep it within bounds
        const endX = Phaser.Math.Clamp(projX, bounds.left + radius, bounds.right - radius)
        const endY = Phaser.Math.Clamp(projY, bounds.top + radius, bounds.bottom - radius)

        const draw = () => {
            //VFX
            const fireballVFX = this.scene.add.sprite(endX, endY + this.getRange() / 2, "fireball-vfx")

            fireballVFX.setOrigin(0, 0.5)
            fireballVFX.setAlpha(1)
            fireballVFX.setScale(this.getRange() / 8)
            fireballVFX.setDepth(10)
            fireballVFX.setRotation(Math.PI * 3 / 2)

            this.scene.tweens.add({
                targets: fireballVFX,
                alpha: 0.5,
                duration: 400,
                ease: "Sine.easeOut",
                onComplete: () => fireballVFX.destroy()
            })
        }
        
        //Fire Icon on Player 
        const fireballIndicator = this.scene.add.sprite(endX, endY, "fireball2-vfx")

        fireballIndicator.setOrigin(0.5, 0.5)
        fireballIndicator.setScale(2)
        fireballIndicator.setDepth(10)

        this.scene.time.delayedCall(800, () => fireballIndicator.destroy())

        //Check hit
        const hitBoss = () => {
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackCircle = new Phaser.Geom.Circle(
                endX,
                endY,
                this.getRange()
            )
            const bossCircle = new Phaser.Geom.Circle(
                boss.x,
                boss.y,
                boss.hurtRadius
            )
            const hit = Phaser.Geom.Intersects.CircleToCircle(
                attackCircle, bossCircle
            )
            if (hit) {
                boss.takeDamage(this.getDamage())
            }
        }

        this.scene.time.delayedCall(800, () => draw())
        this.scene.time.delayedCall(1000, () => hitBoss())
        // this.scene.time.delayedCall(1200, () => g.destroy())
    }
}