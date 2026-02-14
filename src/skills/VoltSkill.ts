import Phaser from "phaser";
import Skill from "./Skill";
import Player from "../entities/Player";

export default class LightningSkill extends Skill {
    player: Player
    originalSpeed: number
    hasteDuration = 2000

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, "volt", "Volt", 25, 6000, 40)

        this.player = player
        this.originalSpeed = player.speed
        this.iconKey = "volt-icon"
    }

    activate() {
        const g = this.scene.add.graphics()
        const startTime = this.scene.time.now

        // Increase speed temporarily
        this.player.speed = this.originalSpeed * 1.75

        //Draw graphics
        // const draw = () => {
        //     g.clear()
        //     g.lineStyle(2, 0x00ff00, 1)
        //     g.strokeCircle(this.player.x, this.player.y, this.range)
        //     g.fillStyle(0x00ff00, 0.25)
        //     g.fillCircle(this.player.x, this.player.y, this.range)
        // }

        //VFX
        const container = this.scene.add.container(this.player.x, this.player.y)

        const follow = () => {
            container.x = this.player.x
            container.y = this.player.y
        }
        this.scene.events.on('update', follow)

        const drawVFX = () => {
            const voltVFX = this.scene.add.sprite(0, 0, "volt-vfx")
            voltVFX.setOrigin(0.5, 0.5)
            voltVFX.setAlpha(0.75)
            voltVFX.setScale(this.range / 8)
            voltVFX.setDepth(10)
            container.add(voltVFX)

            this.scene.tweens.add({
                targets: voltVFX,
                alpha: 0.25,
                duration: 400,
                ease: "Sine.easeOut",
                onComplete: () => {
                    voltVFX.destroy()
                    container.destroy()
                }
            })
        }

        //Bolt Icon on Player
        const volt2VFX = this.scene.add.sprite(0, -25, "volt2-vfx")

        volt2VFX.setOrigin(0.5, 0.5)
        volt2VFX.setAlpha(1)
        volt2VFX.setScale(1.5)
        volt2VFX.setDepth(10)
        container.add(volt2VFX)

        this.scene.time.delayedCall(this.hasteDuration - 1000, () => {
            this.scene.tweens.add({
                targets: volt2VFX,
                alpha: 0,
                duration: 100,
                yoyo: true,
                repeat: 4,
                onComplete: () => volt2VFX.destroy()
            })
        })

        //Check hit
        const hitBoss = () => {
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackCircle = new Phaser.Geom.Circle(
                this.player.x,
                this.player.y,
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

        // const updateCircle = () => {
        //     draw()
        //     if (this.scene.time.now - startTime < this.hasteDuration) {
        //         this.scene.time.delayedCall(32, updateCircle)
        //     }
        // }

        // this.scene.time.delayedCall(1500, () => updateCircle())
        this.scene.time.delayedCall(this.hasteDuration, () => {
            drawVFX()
            this.player.speed = this.originalSpeed
            this.scene.events.off('update', follow)
            hitBoss()
            g.destroy()
        })
    }
}