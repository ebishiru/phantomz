// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"

export default class GameScene extends Phaser.Scene {
    player!: Player
    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("game")
    }

    create() {
        // Spawn player in center
        this.player = new Player(this, 400, 300)

        // Input
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)


        // Optional: add some text
        this.add.text(10, 10, "Use WASD to move", {
        font: "16px Arial",
        color: "#ffffff",
        })
    }

    update() {
        const dir = new Phaser.Math.Vector2(0, 0)

        if (this.aKey.isDown) dir.x -= 1 // A → left
        if (this.dKey.isDown) dir.x += 1 // D → right
        if (this.wKey.isDown) dir.y -= 1 // W → up
        if (this.sKey.isDown) dir.y += 1 // S → down

        dir.normalize()
        this.player.move(dir)
    }
}
