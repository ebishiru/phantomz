import Phaser from "phaser"
import Player from "./Player"

export default class ExpOrb extends Phaser.Physics.Arcade.Image {
    expValue: number

    spawnTime:  number
    homingDelay = 800
    homingSpeed = 250
    isHoming: boolean = false

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

        this.setScale(0.25)
        this.setCircle(this.width / 2)
        this.setCollideWorldBounds(true)

        this.spawnTime = scene.time.now
        this.setVelocity(Phaser.Math.Between(-120, 120), Phaser.Math.Between(-120, 120))
    }

    update(player: Player, time: number) {
        if (!this.isHoming && time - this.spawnTime >= this.homingDelay) {
            this.isHoming = true
        }

        if (!this.isHoming) return

        const direction = new Phaser.Math.Vector2(
            player.x - this.x,
            player.y - this.y
        )

        if (direction.lengthSq() === 0) return
        
        direction.normalize().scale(this.homingSpeed)

        this.setVelocity(direction.x, direction.y)
    }
}