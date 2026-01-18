import Phaser from "phaser"
import SlashSkill from "../skills/SlashSkill"
import ArrowSkill from "../skills/ArrowSkill"
import PulseSkill from "../skills/PulseSkill"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 300
    maxHealth = 100
    health = 100

    //Skills
    slashSkill!: SlashSkill
    arrowSkill!: ArrowSkill
    pulseSkill!: PulseSkill

    facing!: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, x: number, y: number, boss: any) {
        super(scene, x, y, "")

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setSize(32, 32)
        this.setTint(0x00ff00)
        this.setCollideWorldBounds(true)
        
        //Default Facing down
        this.facing = new Phaser.Math.Vector2(0, 1)

        //Initialize skills
        this.slashSkill = new SlashSkill(scene, this, boss, 50, 3000)
        this.arrowSkill = new ArrowSkill(scene, this, boss, 4000)
        this.pulseSkill = new PulseSkill(scene, this, boss, 75, 8000)
    
    }

    takeDamage(amount: number) {
        this.health -= amount
        this.health = Math.max(this.health, 0)
    }

    move(dir: Phaser.Math.Vector2) {
        this.setVelocity(dir.x * this.speed, dir.y * this.speed)

        if(dir.lengthSq() > 0) {
            this.facing.copy(dir).normalize()
        }
    }

    update(time: number) {
        this.handleSkillInputs(time)
    }

    handleSkillInputs(time: number) {
        const keys = this.scene.input.keyboard
        if (Phaser.Input.Keyboard.JustDown(keys!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR))) {
            this.slashSkill.use(time)
        }
        if (Phaser.Input.Keyboard.JustDown(keys!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT))) {
            this.arrowSkill.use(time)
        }
        if (Phaser.Input.Keyboard.JustDown(keys!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX))) {
            this.pulseSkill.use(time)
        }
    }
}
