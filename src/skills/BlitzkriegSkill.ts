import Phaser from "phaser";
import Skill from "./Skill";

export default class Blitzkrieg extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player:any) {
        super(scene, player, "blitzkrieg", "Blitzkrieg", 16, 4500, 50)
        this.iconKey = "blitzkrieg-icon"
        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    dashDistance: number = 200
    startX: number = 0
    startY: number = 0
    endX: number = 0
    endY: number = 0

    activate() {
        // cancel any existing knockback/movement tween
        this.scene.tweens.killTweensOf(this.player)
        this.player.body?.setVelocity(0, 0)

        this.updateFacing()

        //Determine endpoint of dash
        this.startX = this.player.x
        this.startY = this.player.y

        this.endX = this.player.x + Math.cos(this.facingAngle) * this.dashDistance
        this.endY = this.player.y + Math.sin(this.facingAngle) * this.dashDistance

        //VFX
        const container = this.scene.add.container(this.player.x, this.player.y)

        const follow = () => {
            container.x = this.player.x
            container.y = this.player.y
        }

        this.scene.events.on("update", follow)

        const offsetDistance = 25
        const vfxX = Math.cos(this.facingAngle) * offsetDistance
        const vfxY = Math.sin(this.facingAngle) * offsetDistance
        const blitzkriegVFX = this.scene.add.sprite(vfxX, vfxY, "blitzkrieg-vfx")
            .setOrigin(0.5)
            .setScale(2)
            .setDepth(10)
            .setRotation(this.facingAngle)
        container.add(blitzkriegVFX)

        this.lineHitCheck()

        //Player Dash
        this.scene.tweens.add({
            targets: this.player,
            x: this.endX,
            y: this.endY,
            duration: 300,
            ease: "Sine.easeOut",
            onComplete: () => {
                blitzkriegVFX.destroy()

                this.scene.time.delayedCall(300, () => {
                    //Crash VFX
                    const crashVFX = this.scene.add.image(this.player.x, this.player.y, "blitzkrieg2-vfx")
                        .setOrigin(0.5)
                        .setAlpha(1)
                        .setScale(this.getRange() / 8)
                        .setDepth(11)

                    this.scene.tweens.add({
                        targets: crashVFX,
                        alpha: 0.5,
                        duration: 400,
                        ease: "Sine.easeOut",
                        onComplete: () => crashVFX.destroy()
                    })

                    this.crashHitCheck()
                })
            }
        })
    }

    lineHitCheck() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const attackLine = new Phaser.Geom.Line(this.startX, this.startY, this.endX, this.endY)
        const bossCircle = new Phaser.Geom.Circle(boss.x, boss.y, boss.hurtRadius)

        if (Phaser.Geom.Intersects.LineToCircle(attackLine, bossCircle)) {
            boss.takeDamage(this.getDamage())
        }
    }

    crashHitCheck() {
        const boss = (this.scene as any).bossManager?.boss
        if (!boss || !boss.active) return

        const attackCircle = new Phaser.Geom.Circle(this.player.x, this.player.y, this.getRange())
        const bossCircle = new Phaser.Geom.Circle(boss.x, boss.y, boss.hurtRadius)

        if (Phaser.Geom.Intersects.CircleToCircle(attackCircle, bossCircle)) {
            boss.takeDamage(this.getDamage() / 2)
        }
    }
}