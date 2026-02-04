// src/scenes/GameScene.ts
import Phaser from "phaser"
import Player from "../entities/Player"
import HealthBar from "../ui/HealthBar"
import ExpBar from "../ui/ExpBar"
import BossManager from "../managers/BossManager"
import SkillCooldown from "../ui/SkillCooldown"
import ExpOrb from "../entities/ExpOrb"

export default class GameScene extends Phaser.Scene {
    player!: Player
    healthBar!: HealthBar
    levelText!: Phaser.GameObjects.Text
    expBar!: ExpBar
    bossManager!: BossManager

    wKey!: Phaser.Input.Keyboard.Key
    aKey!: Phaser.Input.Keyboard.Key
    sKey!: Phaser.Input.Keyboard.Key
    dKey!: Phaser.Input.Keyboard.Key

    joystickBase!: Phaser.GameObjects.Arc
    joystickThumb!: Phaser.GameObjects.Arc
    joystickVector = new Phaser.Math.Vector2()
    joystickActive = false
    joystickRadius = 40

    skillButtons: Phaser.GameObjects.Arc[] = []

    skillKeys!: Phaser.Input.Keyboard.Key[]

    skillCooldownUIs!: SkillCooldown[]

    expOrbs!: ExpOrb[]

    constructor() {
        super("game")
    }

    preload() {
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("boss1", "assets/boss1.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("boss2", "assets/boss2.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("boss3", "assets/boss3.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("boss4", "assets/boss4.png", {
            frameWidth: 16,
            frameHeight: 16
        }
        )

        this.load.image("exp-orb", "assets/exp-orb.png")

        this.load.image("loading-border", "assets/loading-border.png")
        this.load.image("ready-border", "assets/ready-border.png")
        this.load.image("slash-icon", "assets/slash-icon.png")
        this.load.image("arrow-icon", "assets/arrow-icon.png")
        this.load.image("pulse-icon", "assets/pulse-icon.png")
        this.load.image("thrust-icon", "assets/thrust-icon.png")
        this.load.image("caltrops-icon", "assets/caltrops-icon.png")
        this.load.image("fireball-icon", "assets/fireball-icon.png")
        this.load.image("skip-icon", "assets/skip-icon.png")

        this.load.image("dirt-texture", "assets/dirt-texture.png")
    }

    create() {
        // Fade In
        this.cameras.main.fadeIn(500, 0, 0, 0)


        // World Bounds
        this.physics.world.setBounds(50, 100, 700, 500)

        //Ground Texture
        const floorBG = this.add.tileSprite(
            50, 100, 700, 500, "dirt-texture"
        ).setOrigin(0)

        floorBG.setTint(0xB0A080)
        floorBG.setAlpha(0.9)
        floorBG.setDepth(0)

        //Player animation
        if (!this.anims.exists("player-idle")) {
            this.anims.create({
                key: "player-idle",
                frames: this.anims.generateFrameNumbers("player", {
                    start: 0,
                    end: 1
                }),
                frameRate: 3,
                repeat: -1
            })
        }

        // Player Info
        this.player = new Player(this, 400, 550, "player")
        this.healthBar = new HealthBar(this, 300, 650, 200, 20, this.player, 0x006400)
        this.expBar = new ExpBar(this, 0, 685, 800, 15, this.player)

        //Player Level Text
        this.levelText = this.add.text(400, 630, `Level ${this.player.level}`, {
            fontSize: "12px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5, 0)

        //Boss Info
        this.bossManager = new BossManager(this, this.player)
        this.bossManager.spawnBoss()

        // Inputs
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // Skill keybindings
        this.skillKeys = [
            this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.J),
            this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I),
            this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K),
            this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        ]

        // Mobile Controls
        const isMobile = this.sys.game.device.input.touch
        if (isMobile) {
            this.createMobileControls()
        }

        this.updateSkillUIPositions()

        //Exp
        this.expOrbs = []
    }

    updateSkillUIPositions() {
        const baseX = 550
        const baseY = 650
        const spacing = 50

        this.skillCooldownUIs?.forEach(ui => ui.destroy())
        this.skillCooldownUIs = []

        this.player.skills.forEach((s, index) => {
            const x = baseX + (index * spacing)
            this.skillCooldownUIs.push(new SkillCooldown(this, s, x, baseY, s.iconKey))
        })
    }

    spawnExp(x: number, y: number, orbCount: number = 15) {
        const minRadius = 80
        const maxRadius = 120

        for (let i = 0; i < orbCount; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
            const distance = Phaser.Math.FloatBetween(minRadius, maxRadius)

            const spawnX = x + Math.cos(angle) * distance
            const spawnY = y + Math.sin(angle) * distance

            const orb = new ExpOrb(
                this,
                spawnX,
                spawnY,
                1
            )

            orb.setScale(0)

            this.tweens.add({
                targets: orb,
                x: spawnX,
                y: spawnY,
                scale: 0.5,
                duration: 800,
                ease: "Back.Out"
            })

            this.expOrbs.push(orb)
        }
    }
    
    createMobileControls() {
        const w = this.scale.width
        const gameHeight = 700
        const controlSpace = this.scale.height - gameHeight

        //Joystick
        const joystickX = 100
        const joystickY = gameHeight + controlSpace / 2
        const joystickRadius = 60
        const thumbRadius = 35

        this.joystickBase = this.add.circle(joystickX, joystickY, joystickRadius, 0x000000, 0.3).setScrollFactor(0)
        this.joystickThumb = this.add.circle(joystickX, joystickY, thumbRadius, 0xffffff, 0.6 ).setScrollFactor(0)

        let joystickPointerId: number | null = null

        //Convert Joystick to movement
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.x < w / 2 && pointer.y > gameHeight) {
                this.joystickActive = true
                joystickPointerId = pointer.id
            }
        })

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!this.joystickActive || pointer.id !== joystickPointerId) return

            const dx = pointer.x - this.joystickBase.x
            const dy = pointer.y - this.joystickBase.y

            const dist = Math.min(
                Math.sqrt(dx * dx + dy * dy),
                this.joystickRadius
            )

            this.joystickVector.set(dx, dy).normalize()

            this.joystickThumb.setPosition(
                this.joystickBase.x + this.joystickVector.x * dist,
                this.joystickBase.y + this.joystickVector.y * dist
            )
        })

        this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (pointer.id === joystickPointerId) {
                this.joystickActive = false
                joystickPointerId = null;
                this.joystickVector.set(0, 0)
                this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y)
            }
            
        })

        //Face buttons
        const centerX = w - 120
        const centerY = gameHeight + controlSpace / 2
        const offset = 60
        const radius = 28

        const positions = [
            { x: centerX - offset, y: centerY },
            { x: centerX, y: centerY - offset},
            { x: centerX + offset, y: centerY},
            { x: centerX, y: centerY + offset}
        ]

        const buttonColors = [0xa4ebcc, 0x5f699c, 0xf0b38d, 0xb56d7f]

        positions.forEach((pos, index) => {
            const btn = this.add.circle(pos.x, pos.y, radius, buttonColors[index], 0.6)
                .setScrollFactor(0)
                .setInteractive()

            btn.on("pointerdown", () => {

                this.tweens.add({
                    targets: btn,
                    scale: 0.8,
                    duration: 50,
                    ease: "Power1"
                })

                const skill = this.player.skills[index]
                if (skill) skill.use(this.time.now)
            })

            const release = () => {
                this.tweens.add({
                    targets: btn,
                    scale: 1,
                    duration: 50,
                    ease: "Power1"
                })
            }

            btn.on("pointerup", release)
            btn.on("pointerout", release)

            this.skillButtons.push(btn)
        })
    }

    update() {
        if (this.scene.isPaused()) return

        this.healthBar.draw()
        this.levelText.setText(`Level ${this.player.level}`)
        this.expBar.draw()
        if (this.bossManager.boss && this.bossManager.bossHealthBar) {
            this.bossManager.bossHealthBar.draw()
        }

        //Player Movement and Skills
        const dir = new Phaser.Math.Vector2(0, 0)
        if (this.aKey.isDown) dir.x -= 1 // left
        if (this.dKey.isDown) dir.x += 1 // right
        if (this.wKey.isDown) dir.y -= 1 // up
        if (this.sKey.isDown) dir.y += 1 // down

        //Joystick
        dir.add(this.joystickVector)

        dir.normalize()
        this.player.move(dir)

        this.player.update(this.time.now)

        this.skillCooldownUIs.forEach( ui => {
            ui.update(this.time.now)
        })

        //Boss Respawn
        if (this.bossManager.boss && this.bossManager.boss.health <= 0) {
            this.bossManager.spawnBoss()
        }

        // Depth sorting (top-down)
        this.player.setDepth(this.player.y)

        if (this.bossManager.boss) {
            this.bossManager.boss.setDepth(this.bossManager.boss.y)
        }

        // Boss movement
        if (this.bossManager.boss) {
            this.bossManager.boss.update(this.player)
        }

        // Boss castbar follow
        if (this.bossManager.castBar && this.bossManager.boss) {
            this.bossManager.castBar.setPosition(this.bossManager.boss.x, this.bossManager.boss.y - 60)
        }

        //Exp
        this.expOrbs.forEach((orb, index) => {
            if (!orb.active) return

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                orb.x,
                orb.y,
            )

            if (distance < 20) {
                this.player.gainExp(orb.expValue)
                orb.destroy()
                this.expOrbs.splice(index, 1)
            }
        })

        this.expOrbs.forEach((orb) => {
            orb.update(this.player, this.time.now)
        })
    }
}
