import Phaser from "phaser";
import Skill from "./Skill";
import Player from "../entities/Player";

export default class LightningSkill extends Skill {
    player: Player
    originalSpeed: number
    hasteDuration = 2000

    constructor(scene: Phaser.Scene, player: Player) {
        super(scene, "lightning", "Lightning", 20, 6000, 40)

        this.player = player
        this.originalSpeed = player.speed
        this.iconKey = "lightning-icon"
    }

    activate() {
        const g = this.scene.add.graphics()
        const startTime = this.scene.time.now

        // Increase speed temporarily
        this.player.speed = this.originalSpeed * 1.5

        // Turn player blue
        this.player.setTint(0x9999ff)

        //Draw graphics
        const draw = () => {
            g.clear()
            g.lineStyle(2, 0x00ff00, 1)
            g.strokeCircle(this.player.x, this.player.y, this.range)
            g.fillStyle(0x00ff00, 0.25)
            g.fillCircle(this.player.x, this.player.y, this.range)
        }

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

        const updateCircle = () => {
            draw()
            if (this.scene.time.now - startTime < this.hasteDuration) {
                this.scene.time.delayedCall(32, updateCircle)
            }
        }

        this.scene.time.delayedCall(500, () => updateCircle())
        this.scene.time.delayedCall(this.hasteDuration, () => {
            this.player.speed = this.originalSpeed
            this.player.clearTint()
            hitBoss()
            g.destroy()
        })
    }
}