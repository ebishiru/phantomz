// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"
import HealthBar from "../ui/HealthBar"
import Boss from "../entities/Boss"
import BossMechanic from "../mechanics/BossMechanics"
import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss"
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer"
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss"
import SkillCooldown from "../ui/SkillCooldown"

export default class GameScene extends Phaser.Scene {
    player!: Player
    healthBar!: HealthBar
    boss!: Boss
    bossHealthBar!: HealthBar

    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    num4Key!: Phaser.Input.Keyboard.Key
    num8Key!: Phaser.Input.Keyboard.Key
    num6Key!: Phaser.Input.Keyboard.Key

    skillCooldownUIs!: SkillCooldown[]
    bossMechanics!: BossMechanic[]

    constructor() {
        super("game")
    }

    create() {
        // Boss Info
        this.boss = new Boss(this, 400, 350)
        this.bossHealthBar = new HealthBar(this, 150, 30, 500, 20, this.boss, 0xff0000)

        // Player Info
        this.player = new Player(this, 400, 550, this.boss)
        this.healthBar = new HealthBar(this, 300, 650, 200, 20, this.player, 0x00ff00)

        // Inputs
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        //Slash Skill
        this.num4Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)
        //Arrow Skill
        this.num8Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT)
        //Pulse Skill
        this.num6Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX)

        this.skillCooldownUIs = [
            new SkillCooldown(this, this.player.slashSkill, 400, 640),
            new SkillCooldown(this, this.player.arrowSkill, 450, 640),
            new SkillCooldown(this, this.player.pulseSkill, 500, 640),
        ]

        // Boss Mechanics Loop
        this.bossMechanics = [
            new CircleTelegraphOnBoss(this, this.boss, this.player),
            new CircleTelegraphOnPlayer(this, this.boss, this.player),
            new LineTelegraphFromBoss(this, this.boss, this.player),
        ]

        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                const mechanic = Phaser.Utils.Array.GetRandom(this.bossMechanics)
                mechanic.trigger()
            }
        })

        // Optional: add some text
        this.add.text(150, 10, "BOSS", {
        font: "16px Arial",
        color: "#ffffff",
        })
    }

    update() {
        this.healthBar.draw()
        this.bossHealthBar.draw()

        //Player Movement and Skills
        const dir = new Phaser.Math.Vector2(0, 0)
        if (this.aKey.isDown) dir.x -= 1 // A → left
        if (this.dKey.isDown) dir.x += 1 // D → right
        if (this.wKey.isDown) dir.y -= 1 // W → up
        if (this.sKey.isDown) dir.y += 1 // S → down
        dir.normalize()
        this.player.move(dir)

        this.player.update(this.time.now)

        this.skillCooldownUIs.forEach( ui => {
            ui.update(this.time.now)
        })
    }
}
