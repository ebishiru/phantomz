import Phaser from "phaser"

export default class ExpOrb extends Phaser.Physics.Arcade.Image {
    expValue: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        expValue: 1
    ) {
        super(scene, x, y, "exp-orb")

        this.expValue = expValue

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(0.5)
        this.setCircle(this.width / 2)
        this.setCollideWorldBounds(true)
    }

}