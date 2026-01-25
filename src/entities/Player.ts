import Phaser from "phaser"
import Skill from "../skills/Skill"
import SlashSkill from "../skills/SlashSkill"
import ArrowSkill from "../skills/ArrowSkill"
import PulseSkill from "../skills/PulseSkill"
import ThrustSkill from "../skills/ThrustSkill"
import CaltopsSkill from "../skills/CaltropsSkill"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 300
    maxHealth = 100
    health = 100
    exp = 0
    level = 1
    expToNextLevel = 10

    //Skills
    skills: Skill[] = []
    slashSkill!: SlashSkill
    arrowSkill!: ArrowSkill
    pulseSkill!: PulseSkill
    thrustSkill!: ThrustSkill
    caltropsSkill!: CaltopsSkill

    facing!: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, boss: any) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(2)

        this.body?.setSize(16, 16)
        this.body?.setOffset(0, 0)

        this.setCollideWorldBounds(true)
        
        //Default Facing down
        this.facing = new Phaser.Math.Vector2(0, 1)

        //Idle animation
        this.play("player-idle")

        //Initialize skills
        this.slashSkill = new SlashSkill(scene, this, boss)
        this.arrowSkill = new ArrowSkill(scene, this, boss)
        this.pulseSkill = new PulseSkill(scene, this, boss)
        this.thrustSkill = new ThrustSkill(scene, this)
        this.caltropsSkill = new CaltopsSkill(scene, this)

        this.skills = [this.slashSkill, this.arrowSkill, this.pulseSkill, this.thrustSkill, this.caltropsSkill]
    
        //Have all other skills locked at first
        this.slashSkill.enabled = true
        this.arrowSkill.enabled = false
        this.pulseSkill.enabled = false
        this.thrustSkill.enabled = false
        this.caltropsSkill.enabled = false
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
        if (Phaser.Input.Keyboard.JustDown(keys!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE))) {
            this.thrustSkill.use(time)
        }
        if (Phaser.Input.Keyboard.JustDown(keys!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN) )) {
            this.caltropsSkill.use(time)
        }
    }

    gainExp(amount: number) {
        this.exp += amount

        if(this.exp >= this.expToNextLevel) {
            this.skills.forEach(skill => skill.pause(this.scene.time.now))
            this.scene.scene.pause("game")
            this.scene.scene.launch("level-up", { player: this})
            this.levelUp()
        }
    }

    levelUp() {
        this.exp -= this.expToNextLevel
        this.level++
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.3)
    }
}
