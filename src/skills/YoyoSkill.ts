import Phaser from "phaser";
import Skill from "./Skill";

export default class YoyoSkill extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "yoyo", "Yo-yo", 14, 4250, 150)
        this.iconKey = "yoyo-icon"
        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    rectHitCheck(directionAngle: number, range: number, thickness: number, targetX: number, targetY: number) {
        const dx = targetX - this.player.x
        const dy = targetY - this.player.y

        const forward = dx * Math.cos(directionAngle) + dy * Math.sin(directionAngle)
        const side = Math.abs(dx * -Math.sin(directionAngle) + dy * Math.cos(directionAngle))

        return forward >= 0 && forward <= range && side <= thickness / 2
    }

    getActiveBoss() {
        const boss = (this.scene as any).bossManager?.boss
        return boss && boss.active && boss.health > 0 ? boss : null
    }

    activate() {
        this.updateFacing()
        const thickness = 75
        const maxDistance = this.range

        const forwardAngle = this.facingAngle

        const fullX = this.player.x + Math.cos(forwardAngle) * maxDistance
        const fullY = this.player.y + Math.sin(forwardAngle) * maxDistance

        // Forward VFX and connecting line
        const yoyoVFX = this.scene.add.sprite(this.player.x, this.player.y, "yoyo-vfx")
            .setOrigin(0.5)
            .setScale(this.getRange() / 150)
            .setDepth(10)
            .setRotation(forwardAngle)

        const line = this.scene.add.graphics({ lineStyle: { width: 3, color: 0xffffff, alpha: 1 }})
            .setDepth(5)

        const drawLine = () => {
            line.clear()
            line.lineStyle(1, 0xffffff, 1)
            line.beginPath()
            line.moveTo(this.player.x, this.player.y)
            line.lineTo(yoyoVFX.x, yoyoVFX.y)
            line.strokePath()
        }

        this.scene.tweens.add({
            targets: yoyoVFX,
            x: fullX,
            y: fullY,
            duration: 250,
            ease: "Power2",
            yoyo: true,
            onUpdate: () => drawLine(),
            onComplete: () => {
                yoyoVFX.destroy()
                line.destroy()
            }
        })

        //Forward damage check
        const boss = this.getActiveBoss()
        if (boss) {
            if (this.rectHitCheck(forwardAngle, maxDistance, thickness, boss.x, boss.y)) {
                boss.takeDamage(this.getDamage())
            }
        }

        this.scene.time.delayedCall(500, () => {

            this.updateFacing()
            const backwardAngleNow = this.facingAngle + Math.PI

            const reverseX = this.player.x + Math.cos(backwardAngleNow) * maxDistance
            const reverseY = this.player.y + Math.sin(backwardAngleNow) * maxDistance

            const backVFX = this.scene.add.sprite(this.player.x, this.player.y, "yoyo-vfx")
                .setOrigin(0.5)
                .setScale(this.getRange() / 150)
                .setDepth(10)
                .setRotation(backwardAngleNow)

            const backLine = this.scene.add.graphics({ lineStyle: { width: 3, color: 0xffffff, alpha: 1 }})
                .setDepth(5)

            const drawBackLine = () => {
                backLine.clear()
                backLine.lineStyle(1, 0xffffff, 1)
                backLine.beginPath()
                backLine.moveTo(this.player.x, this.player.y)
                backLine.lineTo(backVFX.x, backVFX.y)
                backLine.strokePath()
            }

            this.scene.tweens.add({
                targets: backVFX,
                x: reverseX,
                y: reverseY,
                duration: 250,
                ease: "Power2",
                yoyo: true,
                onUpdate: () => drawBackLine(),
                onComplete: () => {
                    backVFX.destroy()
                    backLine.destroy()
                }
            })

            const boss = this.getActiveBoss()
            //backwards damage check
            if (boss) {
                if (this.rectHitCheck(backwardAngleNow, maxDistance, thickness, boss.x, boss.y)) {
                    boss.takeDamage(this.getDamage())
                }
            }
        })
    }
}