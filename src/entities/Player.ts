import Phaser from "phaser"
import Skill from "../skills/Skill"
import SlashSkill from "../skills/SlashSkill"
import ArrowSkill from "../skills/ArrowSkill"
import PulseSkill from "../skills/PulseSkill"
import ThrustSkill from "../skills/ThrustSkill"
import CaltopsSkill from "../skills/CaltropsSkill"
import FireballSkill from "../skills/FireballSkill"
import HookSkill from "../skills/HookSkill"

export default class Player extends Phaser.Physics.Arcade.Sprite {
    speed = 300
    maxHealth = 100
    health = 100
    exp = 0
    level = 1
    expToNextLevel = 10
    hurtboxRadius = 4

    //Skills
    skills: Skill[] = []
    slashSkill!: SlashSkill
    arrowSkill!: ArrowSkill
    pulseSkill!: PulseSkill
    thrustSkill!: ThrustSkill
    caltropsSkill!: CaltopsSkill
    fireballSkill!: FireballSkill
    hookSkill!: HookSkill

    facing!: Phaser.Math.Vector2

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
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
        this.slashSkill = new SlashSkill(scene, this)
        this.arrowSkill = new ArrowSkill(scene, this)
        this.pulseSkill = new PulseSkill(scene, this)
        this.thrustSkill = new ThrustSkill(scene, this)
        this.caltropsSkill = new CaltopsSkill(scene, this)
        this.fireballSkill = new FireballSkill(scene, this)
        this.hookSkill = new HookSkill(scene, this)

        this.skills = []
    
        //Have all other skills locked at first
        this.slashSkill.enabled = false
        this.arrowSkill.enabled = false
        this.pulseSkill.enabled = false
        this.thrustSkill.enabled = false
        this.caltropsSkill.enabled = false
        this.fireballSkill.enabled = false
        this.hookSkill.enabled = false

        //Unlock starting skill
        this.unlockSkill(this.slashSkill)
    }

    takeDamage(amount: number) {
        this.health -= amount
        this.health = Phaser.Math.Clamp(this.health, 0, this.maxHealth)

        this.setTint(0xff0000)
        this.scene.time.delayedCall(300, () => {
            this.clearTint()
        })

        if (this.health <= 0) {
            this.die()
        }
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
        const keys = (this.scene as any).skillKeys as Phaser.Input.Keyboard.Key[]
        
        this.skills.forEach( (skill, index) => {
            const key = keys[index]
            if (!key) return

            if (Phaser.Input.Keyboard.JustDown(key)) {
                skill.use(time)
            }
        })
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
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.4)
    }
    
    unlockSkill(skill: Skill) {
        skill.enabled = true
        this.skills.push(skill)
    }

    die() {
        this.setVelocity(0, 0),
        this.anims.stop()

        const gameScene = this.scene.scene.get("game") as any
        const bossManager = gameScene.bossManager

        const score = bossManager.globalTimerSeconds + bossManager.bossesKilled * 50

        this.scene.scene.pause("game")
        this.scene.scene.launch("game-over", { score })
    }
}
