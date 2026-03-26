import Phaser from "phaser";
import Skill from "./Skill";

export default class JavelinSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "javelin", "Javelin", 15, 0, 25)
        this.iconKey = "javelin-icon"
        this.player = player
    }

    activate() {

        const dir = new Phaser.Math.Vector2(
            this.player.facing.x,
            this.player.facing.y
        ).normalize()

        const originX = this.player.x
        const originY = this.player.y

        const castDistance = 150

        const endX = originX + (dir.x * castDistance)
        const endY = originY + (dir.y * castDistance)

        //Draw VFX
        const javelinVFX = this.scene.add.sprite(endX, endY + this.getRange() / 2, "javelin-vfx")

        javelinVFX.setOrigin(0.5)
        javelinVFX.setAlpha(1)
        javelinVFX.setScale(this.getRange() / 8)
        javelinVFX.setDepth(10)

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
        const hit = Phaser.Geom.Intersects.CircleToCircle(
            attackCircle, bossCircle
        )
        if (hit) {
            boss.takeDamage(this.getDamage())
        }
        
    }
}