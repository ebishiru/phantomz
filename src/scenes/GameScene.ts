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

    num4Key!: Phaser.Input.Keyboard.Key
    num8Key!: Phaser.Input.Keyboard.Key
    num6Key!: Phaser.Input.Keyboard.Key

    slashCooldownBG!: Phaser.GameObjects.Graphics
    slashCooldownFG!: Phaser.GameObjects.Graphics
    arrowCooldownBG!: Phaser.GameObjects.Graphics
    arrowCooldownFG!: Phaser.GameObjects.Graphics
    pulseCooldownBG!: Phaser.GameObjects.Graphics
    pulseCooldownFG!: Phaser.GameObjects.Graphics

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

        //Cooldown Blocks
        const size = 40
        const radius = 6

        //Cooldown Block for Slash Skill
        const slashBlockX = 400
        const slashBlockY = 640

        this.slashCooldownBG = this.add.graphics()
        this.slashCooldownBG.fillStyle(0x444444, 1)
        this.slashCooldownBG.fillRoundedRect(slashBlockX - size/2, slashBlockY - size, size, size, radius)

        this.slashCooldownFG = this.add.graphics()
        this.slashCooldownFG.fillStyle(0x00ff00, 1)
        this.slashCooldownFG.fillRoundedRect(slashBlockX - size/2, slashBlockY - size, size, size, radius)

        this.num4Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR)

        //Cooldown Block for Arrow Skill
        const arrowBlockX = 450
        const arrowBlockY = 640

        this.arrowCooldownBG = this.add.graphics()
        this.arrowCooldownBG.fillStyle(0x444444, 1)
        this.arrowCooldownBG.fillRoundedRect(arrowBlockX - size/2, arrowBlockY - size, size, size, radius)

        this.arrowCooldownFG = this.add.graphics()
        this.arrowCooldownFG.fillStyle(0x00ff00, 1)
        this.arrowCooldownFG.fillRoundedRect(arrowBlockX - size/2, arrowBlockY - size, size, size, radius)

        this.num8Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT)

        //Cooldown Block for Pulse Skill
        const pulseBlockX = 500
        const pulseBlockY = 640

        this.pulseCooldownBG = this.add.graphics()
        this.pulseCooldownBG.fillStyle(0x444444, 1)
        this.pulseCooldownBG.fillRoundedRect(pulseBlockX - size/2, pulseBlockY - size, size, size, radius)

        this.pulseCooldownFG = this.add.graphics()
        this.pulseCooldownFG.fillStyle(0x00ff00, 1)
        this.pulseCooldownFG.fillRoundedRect(pulseBlockX - size/2, pulseBlockY - size, size, size, radius)

        this.num6Key = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX)

        // Boss Mechanics Loop
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                this.spawnBossAttack()
            }
        })

        // Optional: add some text
        this.add.text(150, 10, "BOSS", {
        font: "16px Arial",
        color: "#ffffff",
        })
    }

    //Boss Telegraphs
    spawnCircleTelegraphOnPlayer() {
        const telegraph = new CircleTelegraph(this, this.player.x, this.player.y, 80)
        this.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }

    spawnLineTelegraphFromBoss() {
        const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
        const telegraph = new LineTelegraph(this, this.boss.x, this.boss.y, angle, 700, 100)
        this.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }

    spawnCircleTelegraphFromBoss() {
        const telegraph = new CircleTelegraph(this, this.boss.x, this.boss.y, 160)
        this.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }

    spawnBossAttack() {
        const attackType = Phaser.Math.Between(0, 2)
        if (attackType === 0 ) {
            this.spawnCircleTelegraphOnPlayer()
        } else if (attackType === 1) {
            this.spawnLineTelegraphFromBoss()
        } else {
            this.spawnCircleTelegraphFromBoss()
        }
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

        //General Cooldown Visual
        const size = 40
        const radius = 6

        //Player Slash Skill
        this.player.slashSkill.updateFacing()
        if (Phaser.Input.Keyboard.JustDown(this.num4Key)) {
            this.player.slashSkill.use(this.time.now)
        }

        //Slash Cooldown Visual
        const playerSlashSkill = this.player.slashSkill

        let slashSkillRatio = (this.time.now - playerSlashSkill.lastUsed) / playerSlashSkill.cooldown
        slashSkillRatio = Phaser.Math.Clamp(slashSkillRatio, 0, 1)

        const slashBlockX = 400
        const slashBlockY = 640
        const slashBlockTop = slashBlockY - size
        const slashSkillFillHeight = size * slashSkillRatio
        const slashSkillFillY = slashBlockTop + (size - slashSkillFillHeight)

        this.slashCooldownFG.clear()
        const slashFGRadius = slashSkillRatio >= 1 ? radius : 0
        this.slashCooldownFG.fillStyle(slashSkillRatio < 1? 0x888888 : 0x00ff00, 1)
        this.slashCooldownFG.fillRoundedRect(slashBlockX - size / 2, slashSkillFillY, size, slashSkillFillHeight, slashFGRadius)

        //Arrow Cooldown Visual
        const playerArrowSkill = this.player.arrowSkill

        let arrowSkillRatio = (this.time.now - playerArrowSkill.lastUsed) / playerArrowSkill.cooldown
        arrowSkillRatio = Phaser.Math.Clamp(arrowSkillRatio, 0, 1)

        const arrowBlockX = 450
        const arrowBlockY = 640
        const arrowBlockTop = arrowBlockY - size
        const arrowSkillFillHeight = size * arrowSkillRatio
        const arrowSkillFillY = arrowBlockTop + (size - arrowSkillFillHeight)

        this.arrowCooldownFG.clear()
        const arrowFGRadius = arrowSkillRatio >= 1 ? radius : 0
        this.arrowCooldownFG.fillStyle(arrowSkillRatio < 1? 0x888888 : 0x00ff00, 1)
        this.arrowCooldownFG.fillRoundedRect(arrowBlockX - size /2, arrowSkillFillY, size, arrowSkillFillHeight, arrowFGRadius)

        //Pulse Cooldown Visual
        const playerPulseSkill = this.player.pulseSkill

        let pulseSkillRatio = (this.time.now - playerPulseSkill.lastUsed) / playerPulseSkill.cooldown
        pulseSkillRatio = Phaser.Math.Clamp(pulseSkillRatio, 0, 1)

        const pulseBlockX = 500
        const pulseBlockY = 640
        const pulseBlockTop = pulseBlockY - size
        const pulseSkillFillHeight = size * pulseSkillRatio
        const pulseSkillFillY = pulseBlockTop + (size - pulseSkillFillHeight)

        this.pulseCooldownFG.clear()
        const pulseFGRadius = pulseSkillRatio >= 1? radius : 0
        this.pulseCooldownFG.fillStyle(pulseSkillRatio < 1? 0x888888 : 0x00ff00, 1)
        this.pulseCooldownFG.fillRoundedRect(pulseBlockX - size/2, pulseSkillFillY, size, pulseSkillFillHeight, pulseFGRadius)
    }
}
