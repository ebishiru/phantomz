// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"
import HealthBar from "../ui/HealthBar"
import Boss from "../entities/Boss"
import CircleTelegraph from "../entities/CircleTelegraph"
import LineTelegraph from "../entities/LineTelegraph"

export default class GameScene extends Phaser.Scene {
    player!: Player
    healthBar!: HealthBar
    boss!: Boss
    bossHealthBar!: HealthBar

    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("game")
    }

    create() {
        // Boss Info
        this.boss = new Boss(this, 400, 350)
        this.bossHealthBar = new HealthBar(this, 300, 40, 200, 20, this.boss, 0xff0000)

        // Player Info
        this.player = new Player(this, 400, 550, this.boss)
        this.healthBar = new HealthBar(this, 300, 20, 200, 20, this.player, 0x00ff00)

        // Inputs
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // Boss Mechanics Loop
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                this.spawnBossAttack()
            }
        })

        // Optional: add some text
        this.add.text(10, 10, "PhantomZ", {
        font: "16px Arial",
        color: "#ffffff",
        })
    }

    //Boss Telegraphs
    spawnCircleTelegraphOnPlayer() {
        const telegraph = new CircleTelegraph(this, this.player.x, this.player.y,80)
        this.time.delayedCall(1200, () => {
            telegraph.resolveAttack(this.player)
        })
    }

    spawnLineTelegraphFromBoss() {
        const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
        const telegraph = new LineTelegraph(this, this.boss.x, this.boss.y, angle, 700, 100)
        this.time.delayedCall(1200, () => {
            telegraph.resolveAttack(this.player)
        })
    }

    spawnBossAttack() {
        const attackType = Phaser.Math.Between(0, 1)
        if (attackType === 0 ) {
            this.spawnCircleTelegraphOnPlayer()
        } else {
            this.spawnLineTelegraphFromBoss()
        }
    }

    update(time: number) {
        this.healthBar.draw()
        this.bossHealthBar.draw()

        //Player Movement
        const dir = new Phaser.Math.Vector2(0, 0)
        if (this.aKey.isDown) dir.x -= 1 // A → left
        if (this.dKey.isDown) dir.x += 1 // D → right
        if (this.wKey.isDown) dir.y -= 1 // W → up
        if (this.sKey.isDown) dir.y += 1 // S → down
        dir.normalize()
        this.player.move(dir)

        //Player Slash Skill
        this.player.slashSkill.updateFacing()
        const key4 = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)!
        if (Phaser.Input.Keyboard.JustDown(key4)) {
            this.player.slashSkill.use(time)
        }
    }
}
