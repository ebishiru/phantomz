import Phaser from "phaser";
import Skill from "./Skill";

export default class ZephyrSkill extends Skill {
    player: any
    facingAngle: number = 0

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "zephyr", "Zephyr", 8, 3500, 60)
        this.iconKey = "zephyr-icon"
        this.player = player
    }

    updateFacing() {
        const dir = this.player.facing.clone().normalize()
        this.facingAngle = Math.atan2(dir.y, dir.x)
    }

    activate() {
        this.updateFacing()
    
        //Slash1
        const cone1StartAngle = this.facingAngle + Math.PI / 4
        const cone1EndAngle = this.facingAngle - Math.PI / 4

        const zephyrVFX1 = this.scene.add.sprite(this.player.x, this.player.y, "zephyr-vfx")
        zephyrVFX1.setOrigin(0, 0.5)
        zephyrVFX1.setScale(this.getRange() / 16, this.getRange() / 32)
        zephyrVFX1.setDepth(10)
        zephyrVFX1.setRotation(cone1StartAngle)

        this.scene.tweens.add({
            targets: { t: 0 },
            t: 1,
            duration: 100,
            ease: "Sine-easeOut",
            onUpdate: (_: any, target: any) => {
                const rot = Phaser.Math.Linear(cone1StartAngle, cone1EndAngle, target.t)
                zephyrVFX1.setRotation(rot)

                //VFX follows player
                zephyrVFX1.x = this.player.x
                zephyrVFX1.y = this.player.y
            },
            onComplete: () => zephyrVFX1.destroy()
        })

        //Check hit for slash1
        const checkSlash1Hit = () => {
            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const dx = boss.x - this.player.x
            const dy = boss.y - this.player.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > this.getRange() + boss.hurtRadius) return

            const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facingAngle)
            if (Math.abs(diff) > Math.PI / 4) return

            boss.takeDamage(this.getDamage())
        }

        this.scene.time.delayedCall(50, checkSlash1Hit)

        //Slash2
        this.scene.time.delayedCall(500, () => {
            const cone2StartAngle = this.facingAngle - Math.PI / 4
            const cone2EndAngle = this.facingAngle + Math.PI / 4

            const zephyrVFX2 = this.scene.add.sprite(this.player.x, this.player.y, "zephyr-vfx")
            zephyrVFX2.setOrigin(0, 0.5)
            zephyrVFX2.setScale(this.getRange() / 16, this.getRange() / 32)
            zephyrVFX2.setDepth(10)
            zephyrVFX2.setRotation(cone2StartAngle)

            this.scene.tweens.add({
                targets: { t: 0 },
                t: 1,
                duration: 100,
                ease: "Sine-easeOut",
                onUpdate: (_: any, target: any) => {
                    const rot = Phaser.Math.Linear(cone2StartAngle, cone2EndAngle, target.t)
                    zephyrVFX2.setRotation(rot)

                    //VFX follows player
                    zephyrVFX2.x = this.player.x
                    zephyrVFX2.y = this.player.y
                },
                onComplete: () => zephyrVFX2.destroy()
            })

            //Check hit for slash2
            const checkSlash2Hit = () => {
                const boss = (this.scene as any).bossManager?.boss
                if (!boss || !boss.active) return

                const dx = boss.x - this.player.x
                const dy = boss.y - this.player.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance > this.getRange() + boss.hurtRadius) return

                const diff = Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - this.facingAngle)
                if (Math.abs(diff) > Math.PI / 4) return

                boss.takeDamage(this.getDamage())
            }

            this.scene.time.delayedCall(50, checkSlash2Hit)
        })

        //Thrust
        this.scene.time.delayedCall(1000, () => {
            const zephyrVFX3 = this.scene.add.sprite(this.player.x, this.player.y, "zephyr2-vfx")
            zephyrVFX3.setOrigin(0, 0.5)
            zephyrVFX3.setDisplaySize(100, 30)
            zephyrVFX3.setDepth(10)
            zephyrVFX3.setRotation(this.facingAngle)

            this.scene.tweens.add({
                targets: zephyrVFX3,
                alpha: 0,
                duration: 150,
                ease: "Sine-easeOut",
                onComplete: () => zephyrVFX3.destroy()
            })

            //Check hit for thrust
            const checkThrustHit = () => {
                const boss = (this.scene as any).bossManager?.boss
                if (!boss || !boss.active) return

                const lineLength = this.range * 2
                const dx = boss.x - this.player.x
                const dy = boss.y - this.player.y
                const facingDir = new Phaser.Math.Vector2(Math.cos(this.facingAngle), Math.sin(this.facingAngle))
                const toBoss = new Phaser.Math.Vector2(dx, dy)
                const proj = toBoss.dot(facingDir)
                const clampedProj = Phaser.Math.Clamp(proj, 0, lineLength)
                const closestPoint = facingDir.clone().scale(clampedProj).add(new Phaser.Math.Vector2(this.player.x, this.player.y))
                const distToLine = Phaser.Math.Distance.Between(boss.x, boss.y, closestPoint.x, closestPoint.y)
                if (distToLine > boss.hurtRadius + 15) return

                boss.takeDamage(this.getDamage())
            }

            this.scene.time.delayedCall(50, checkThrustHit)
        })
    }
}