import Phaser from "phaser"
import Player from "./Player"

export default class ExpOrb extends Phaser.Physics.Arcade.Image {
    expValue: number
    player: Player

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        player: Player,
        expValue: 1
    ) {
        super(scene, x, y, "exp-orb")

        this.expValue = expValue
        this.player = player

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(0.6)
        this.setCircle(this.width / 2)
        this.setDamping(true)
        this.setDrag(0.98)
        this.setMaxVelocity(200)
    }

    update() {
        const distance = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y,
        )

        if (distance < 150) {
            this.scene.physics.moveToObject(this, this.player, 250)
        }
    }
}