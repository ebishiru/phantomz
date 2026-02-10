import Phaser from "phaser";
import Skill from "./Skill";

export default class FireballSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, "fireball", "Fireball", 60, 7000, 65)
        this.iconKey = "fireball-icon"
        this.player = player
    }

    activate() {
        const g = this.scene.add.graphics()

        const dir = new Phaser.Math.Vector2(
            this.player.facing.x,
            this.player.facing.y
        ).normalize()

        const originX = this.player.x
        const originY = this.player.y

        const castDistance = 200

        const endX = originX + (dir.x * castDistance)
        const endY = originY + (dir.y * castDistance) 
 
        const draw = () => {
            //Create Graphics  
            g.clear()
            g.lineStyle(2, 0x00ff00, 1)
            g.strokeCircle(endX, endY, this.range)
            g.fillStyle(0x00ff00, 0.25)
            g.fillCircle(endX, endY, this.range)

            this.scene.tweens.add({
                targets: g,
                alpha: { from: 0.3, to: 0.6 },
                duration: 200,
                yoyo: true,
                repeat: 1
            })

            //VFX
            const fireballVFX = this.scene.add.sprite(endX, endY + this.range / 2, "fireball-vfx")

            fireballVFX.setOrigin(0, 0.5)
            fireballVFX.setAlpha(1)
            fireballVFX.setScale(this.range / 8)
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
            

        //Check hit
        const hitBoss = () => {
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackCircle = new Phaser.Geom.Circle(
                endX,
                endY,
                this.range
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
                boss.takeDamage(this.damage)
            }
        }

        this.scene.time.delayedCall(800, () => draw())
        this.scene.time.delayedCall(1000, () => hitBoss())
        this.scene.time.delayedCall(1200, () => g.destroy())
    }
}