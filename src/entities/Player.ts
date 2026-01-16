import Phaser from "phaser"
import SlashSkill from "../skills/SlashSkill"
import ArrowSkill from "../skills/ArrowSkill"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 500
    maxHealth = 100
    health = 100

    //Skills
    slashSkill!: SlashSkill
    arrowSkill!: ArrowSkill

    constructor(scene: Phaser.Scene, x: number, y: number, boss: any) {
    super(scene, x, y, "")

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setSize(32, 32)
    this.setTint(0x00ff00)
    this.setCollideWorldBounds(true)
    
    this.slashSkill = new SlashSkill(scene, this, boss, 50, 3000)
    this.arrowSkill = new ArrowSkill(scene, this, boss, 4000)
    
    }

    takeDamage(amount: number) {
        this.health -= amount
        this.health = Math.max(this.health, 0)
    }

    move(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.speed, dir.y * this.speed)
    }

    update(time: number) {
        this.handleSlashInput(time)
    }

    handleSlashInput(time: number) {
        const key4 = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)!

        if (Phaser.Input.Keyboard.JustDown(key4)) {
            this.slashSkill.use(time)
        }
    }
}
