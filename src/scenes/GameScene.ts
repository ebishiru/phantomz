import Phaser from "phaser"
import Player from "../entities/Player"
import BossManager from "../managers/BossManager"

import InputSystem from "../systems/InputSystem"
import ExpSystem from "../systems/ExpSystem"
import UISystem from "../systems/UISystem"
import MobileControls from "../systems/MobileControls"

export default class GameScene extends Phaser.Scene {

    player!: Player
    bossManager!: BossManager

    inputSystem!: InputSystem
    expSystem!: ExpSystem
    uiSystem!: UISystem
    mobileControls!: MobileControls
    
    skillKeys!: Phaser.Input.Keyboard.Key[]

    constructor() {
        super("game")
    }

    create(data: { characterKey?: string, startingSkill?: string}) {
        //Load Title Screen Selection
        const character = data?.characterKey || "player1"
        const startingSkill = data?.startingSkill || "slash"

        // Fade In
        this.cameras.main.fadeIn(500, 0, 0, 0)

        // World Bounds
        this.physics.world.setBounds(50, 100, 700, 500)

        //Ground Texture
        const floor = this.add.tileSprite(
            50, 100, 700, 500, "dirt-texture"
        ).setOrigin(0)

        floor.setTint(0xB0A080)
        floor.setAlpha(0.9)

        //Player animation
        const animKey = `${character}-idle`

        if (!this.anims.exists(animKey)) {
            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(character, {
                    start: 0,
                    end: 1
                }),
                frameRate: 3,
                repeat: -1
            })
        }

        //Player
        this.player = new Player(this, 400, 550, character, startingSkill)

        //Systems
        this.inputSystem = new InputSystem(this, this.player)
        this.expSystem = new ExpSystem(this)
        this.uiSystem = new UISystem(this, this.player)

        //Boss
        this.bossManager = new BossManager(this, this.player, this.expSystem)
        this.bossManager.spawnBoss()

        //Mobile Controls
        if (this.sys.game.device.input.touch) {
            this.mobileControls = new MobileControls(this.player);
        }

        //Skills
        this.skillKeys = [
            // 1 2 3 4
            this.input.keyboard!.addKey("ONE"),
            this.input.keyboard!.addKey("TWO"),
            this.input.keyboard!.addKey("THREE"),
            this.input.keyboard!.addKey("FOUR"),

            // U I O P
            this.input.keyboard!.addKey("U"),
            this.input.keyboard!.addKey("I"),
            this.input.keyboard!.addKey("O"),
            this.input.keyboard!.addKey("P"),
        ]

    }

    update(time: number) {

        if (this.scene.isPaused()) return

        //Player Movement
        const keyboardDir = this.inputSystem.getMovementVector()
        const mobileDir = this.mobileControls?.getMovementVector() || new Phaser.Math.Vector2(0, 0)

        keyboardDir.add(mobileDir)

        this.player.move(keyboardDir)

        //Systems update
        this.uiSystem.update(time)
        this.expSystem.update(this.player, time)

        //Boss update
        if (this.bossManager.boss) {
            this.bossManager.boss.update(this.player)

            // Redraw health bar
            this.bossManager.bossHealthBar?.draw()

            if (this.bossManager.boss.health <= 0) {
                this.bossManager.spawnBoss()
            }
        }

        // Skill input
        const skillMapping = [
            [0, 4], // skill 0: keys 0 and 4 in skillKeys array
            [1, 5], // skill 1: keys 1 and 5
            [2, 6], // skill 2: keys 2 and 6
            [3, 7], // skill 3: keys 3 and 7
        ]

        skillMapping.forEach((keyIndices, skillIndex) => {
            keyIndices.forEach(i => {
                const key = this.skillKeys[i]
                if (Phaser.Input.Keyboard.JustDown(key)) {
                    const skill = this.player.skills[skillIndex]
                    if (skill) skill.use(time)
                }
            })
        })

        // Depth sorting (top-down)
        this.player.setDepth(this.player.y)

        if (this.bossManager.boss) {
            this.bossManager.boss.setDepth(this.bossManager.boss.y)
        }
    }
}
