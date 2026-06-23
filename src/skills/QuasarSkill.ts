import Phaser from "phaser";
import Skill from "./Skill";

export default class QuasarSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "quasar", "Quasar", 45, 6000, 30)
        this.iconKey = "quasar-icon"
        this.player = player
    }

    activate() {
        //Timing of VFX and hit check
        const timings = [ 150, 300, 450, 1950 ]

        //Choose a random direction
        const directions = [ 0, 90, 180, 270 ]
        const scrambledDirections = Phaser.Utils.Array.Shuffle(directions)

        const direction1 = scrambledDirections[0]
        const direction2 = scrambledDirections[1]
        const direction3 = scrambledDirections[2]
        const direction4 = scrambledDirections[3] //True direction

        //Quasar icon on player
        const container = this.scene.add.container(this.player.x, this.player.y)
        
        const follow = () => {
            container.x = this.player.x
            container.y = this.player.y
        }

        this.scene.events.on("update", follow)

        const iconVFX = this.scene.add.sprite(0, -25, "quasar-vfx")

        iconVFX.setOrigin(0.5, 0.5)
        iconVFX.setScale(1.5)
        iconVFX.setDepth(10)
        iconVFX.setRotation(Phaser.Math.DegToRad(direction1))
        container.add(iconVFX)

        //Icon scrambles before locking in
        this.scene.time.delayedCall(timings[0], () => {
            iconVFX.setRotation(Phaser.Math.DegToRad(direction2))
        })

        this.scene.time.delayedCall(timings[1], () => {
            iconVFX.setRotation(Phaser.Math.DegToRad(direction3))
        })

        this.scene.time.delayedCall(timings[2], () => {
            iconVFX.setRotation(Phaser.Math.DegToRad(direction4))
        })

        //Quasar fires
        this.scene.time.delayedCall(timings[3], () => {
            this.scene.events.off("update", follow)
            container.destroy()

            const bounds = this.scene.physics.world.bounds
            const angle = Phaser.Math.DegToRad(direction4)
            const dx = Math.cos(angle)
            const dy = Math.sin(angle)
            const width = this.getRange()

            let startX = this.player.x + dx * 30
            let startY = this.player.y + dy * 30
            let endX = startX
            let endY = startY

            if (direction4 === 0) {
                endX = bounds.right
                endY = this.player.y
            } else if (direction4 === 180) {
                endX = bounds.left
                endY = this.player.y
            } else if (direction4 === 90) {
                endX = this.player.x
                endY = bounds.bottom
            } else if (direction4 === 270) {
                endX = this.player.x
                endY = bounds.top
            }

            const lineLength = Phaser.Math.Distance.Between(startX, startY, endX, endY)

            const quasar3VFX = this.scene.add.sprite(startX, startY, "quasar3-vfx")
            quasar3VFX.setOrigin(0, 0.5)
            quasar3VFX.setRotation(angle)
            quasar3VFX.setDepth(10)
            quasar3VFX.setAlpha(0.85)
            quasar3VFX.setDisplaySize(Math.max(lineLength, 1), width)

            const quasar2VFX = this.scene.add.sprite(
                this.player.x + dx * 50,
                this.player.y + dy * 50,
                "quasar2-vfx"
            )
            quasar2VFX.setOrigin(0.5, 0.5)
            quasar2VFX.setRotation(angle)
            quasar2VFX.setDepth(10.1)
            quasar2VFX.setScale(3)
            quasar2VFX.setAlpha(0.9)

            this.scene.tweens.add({
                targets: [quasar3VFX, quasar2VFX],
                alpha: 0,
                duration: 400,
                ease: "Cubic.easeOut",
                onComplete: () => {
                    quasar3VFX.destroy()
                    quasar2VFX.destroy()
                }
            })

            const boss = (this.scene as any).bossManager?.boss
            if (!boss || !boss.active) return

            const attackLine = new Phaser.Geom.Line(startX, startY, endX, endY)
            const bossCircle = new Phaser.Geom.Circle(boss.x, boss.y, boss.hurtRadius)

            if (Phaser.Geom.Intersects.LineToCircle(attackLine, bossCircle)) {
                boss.takeDamage(this.getDamage())
            }
        })
    }
}