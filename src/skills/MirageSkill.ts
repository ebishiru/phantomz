import Phaser from "phaser";
import Skill from "./Skill";

export default class MirageSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "mirage", "Mirage", 40, 6000, 50)
        this.iconKey = "mirage-icon"
        this.player = player
    }

    activate() {

        const originX = this.player.x
        const originY = this.player.y

        //Teleport player to random location
        const bounds = this.scene.physics.world.bounds
        const randomX = Phaser.Math.Between(bounds.left + 100, bounds.right - 100)
        const randomY = Phaser.Math.Between(bounds.top + 50, bounds.bottom - 50)

        this.player.setAlpha(0)
        this.scene.time.delayedCall(250, () => {
            this.player.setPosition(randomX, randomY)
            this.player.setAlpha(1)
        })

        //VFX
        const mirageVFX = this.scene.add.sprite(originX, originY, "mirage-vfx")
        mirageVFX.setOrigin(0.5, 0.5)
        mirageVFX.setAlpha(0.75)
        mirageVFX.setScale(5)
        mirageVFX.setDepth(10)

        this.scene.time.delayedCall(500, () => {
            mirageVFX.destroy()
            
            const mirage2VFX = this.scene.add.sprite(originX, originY, "mirage2-vfx")
            mirage2VFX.setOrigin(0.5, 0.5)
            mirage2VFX.setAlpha(0.75)
            mirage2VFX.setScale(5)
            mirage2VFX.setDepth(10)

            this.scene.tweens.add({
                targets: mirage2VFX,
                alpha: 0,
                duration: 400,
                onComplete: () => {
                    mirage2VFX.destroy()
                }
            })

            this.hitCheck(originX, originY)
        })
    }

    hitCheck(attackX: number, attackY: number) {
        //Check hit
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const attackCircle = new Phaser.Geom.Circle(
            attackX,
            attackY,
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
}