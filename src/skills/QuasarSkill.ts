import Phaser from "phaser";
import Skill from "./Skill";

export default class QuasarSkill extends Skill {
    player: any
    
    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "quasar", "Quasar", 40, 6000, 30)
        this.iconKey = "quasar-icon"
        this.player = player
    }

    activate() {
        //Timing of VFX and hit check
        const timings = [ 150, 300, 450, 1450 ]

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

            
        })
    }
}