import Phaser from "phaser";
import Player from "../entities/Player";

export default class InputSystem {
    scene: Phaser.Scene
    player: Player

    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    upKey!: Phaser.Input.Keyboard.Key
    rightKey!: Phaser.Input.Keyboard.Key
    leftKey!: Phaser.Input.Keyboard.Key
    downKey!: Phaser.Input.Keyboard.Key

    skillKeys: Phaser.Input.Keyboard.Key[]

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene
        this.player = player

        const keyboard = this.scene.input.keyboard!

        this.wKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        this.upKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        this.rightKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        this.leftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        this.downKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

        this.skillKeys = []
    }

    getMovementVector() {
        const dir = new Phaser.Math.Vector2(0, 0)

        if (this.aKey.isDown || this.leftKey.isDown) dir.x -= 1
        if (this.dKey.isDown || this.rightKey.isDown) dir.x += 1
        if (this.wKey.isDown || this.upKey.isDown) dir.y -= 1
        if (this.sKey.isDown || this.downKey.isDown) dir.y += 1

        return dir.normalize()
    }
}