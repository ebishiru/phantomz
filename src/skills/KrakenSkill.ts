import Phaser from "phaser";
import Skill from "./Skill";

export default class KrakenSkill extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "kraken", "Kraken", 60, 9000, 40)
        this.iconKey = "kraken-icon"
        this.player = player
    }

    krakenDelay: number = 4000

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    activate() {
        //Determine random location on map
        const bounds = this.scene.physics.world.bounds
        const endX = Phaser.Math.Between(bounds.x + 100, bounds.x + bounds.width - 100)
        const endY = Phaser.Math.Between(bounds.y + 100, bounds.y + bounds.height - 100)

        //Trident VFX
        const krakenVFX1 = this.scene.add.sprite(endX, endY, "kraken-vfx")
            .setOrigin(0.75, 0.75)
            .setAlpha(1)
            .setScale(2)
            .setDepth(11)
            .setRotation(Math.PI / 4)

        this.scene.time.delayedCall(this.krakenDelay - 1000, () => {
            this.scene.tweens.add({
                targets: krakenVFX1,
                alpha: 0,
                duration: 100,
                yoyo: true,
                repeat: 4,
                onComplete: () => krakenVFX1.destroy() 
            })
        })
        
        this.scene.time.delayedCall(this.krakenDelay, () => {

            //Kraken VFX
            const krakenVFX2 = this.scene.add.sprite(endX, endY + this.getRange() / 2, "kraken2-vfx")
                .setOrigin(0.5, 0.75)
                .setAlpha(1)
                .setScale(this.getRange() / 8)
                .setDepth(10)
            
            this.scene.tweens.add({
                targets: krakenVFX2,
                alpha: 0.5,
                duration: 400,
                ease: "Sine.easeOut",
                onComplete: () => krakenVFX2.destroy()
            })

            //Check hit
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
            if (Phaser.Geom.Intersects.CircleToCircle(attackCircle, bossCircle)) {
                boss.takeDamage(this.getDamage())
            }
        })
    }
}