import Phaser from "phaser"
import Player from "../entities/Player"
import BossManager from "../managers/BossManager"

import { playMusic } from "../systems/MusicSystem"
import { setupEscapeMenu } from "../systems/setupEscapeMenu"
import { OptionsButton } from "../ui/OptionsButton"

import InputSystem from "../systems/InputSystem"
import SkillSystem from "../systems/SkillSystem"
import ExpSystem from "../systems/ExpSystem"
import UISystem from "../systems/UISystem"
import MobileControls from "../systems/MobileControls"

import { App } from '@capacitor/app';

export default class GameScene extends Phaser.Scene {
    player!: Player
    bossManager!: BossManager

    inputSystem!: InputSystem
    skillSystem!: SkillSystem
    expSystem!: ExpSystem
    uiSystem!: UISystem
    mobileControls?: MobileControls
    
    skillKeys!: Phaser.Input.Keyboard.Key[]
    level: string = "cave"
    selectedCharacter: string = "player1"
    selectedSkillKey: string = "slash"

    constructor() {
        super("game")
    }

    create(data: { characterKey?: string, startingSkill?: string, level?: string }) {
        this.selectedCharacter = data?.characterKey || "player1";
        this.selectedSkillKey = data?.startingSkill || "slash";
        this.level = data?.level || "cave";

        const character = this.selectedCharacter;
        const startingSkill = this.selectedSkillKey;

        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width/2;
        const centerY = height/2;
        const worldWidth = 650;
        const worldHeight = 400;

        // Fade In
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // World Bounds
        const worldX = centerX - worldWidth/2
        const worldY = centerY - worldHeight/2

        this.physics.world.setBounds(worldX, worldY, worldWidth, worldHeight)

        // Ground Texture
        const floor = this.add.tileSprite(centerX - worldWidth/2, centerY - worldHeight/2, worldWidth, worldHeight, this.level).setOrigin(0);
        floor.setDepth(-11)
        if (this.level === "cave") {
            floor.setTint(0xb0a080);
            floor.setAlpha(0.9);
        }
        if (this.level === "snow") {
            floor.setTint(0x8a9aa8);
            floor.setAlpha(0.7);
        }
        if (this.level === "tower") {
            floor.setTint(0x87ceeb);
            floor.setAlpha(0.8);
        }

        // Play music
        const musicMap: Record<string, string> = {
            "cave": "caveMusic",
            "snow": "snowMusic",
            "tower": "towerMusic",
        };

        const musicKey = musicMap[this.level] || "caveMusic";
        playMusic(this, musicKey);

        // Music minimize on app change state
        App.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
                this.sound.pauseAll();
            } else {
                this.sound.resumeAll();
            }
        });

        // Options Button
        setupEscapeMenu(this);
        OptionsButton(this);

        // Player animation
        const animKey = `${character}-idle`;
        if (!this.anims.exists(animKey)) {
            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(character, { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            });
        }

        // Player
        this.player = new Player(this, centerX, centerY + 100, character);

        // Systems
        this.inputSystem = new InputSystem(this, this.player);
        this.skillSystem = new SkillSystem(this, this.player);
        this.expSystem = new ExpSystem(this);
        this.uiSystem = new UISystem(this, this.player, this.skillSystem);

        // Unlock starting skill
        this.skillSystem.unlockSkill(startingSkill);

        // Boss
        this.bossManager = new BossManager(this, this.player, this.expSystem, this.level);
        this.bossManager.spawnBoss();

        // Mobile Controls
        if (this.sys.game.device.input.touch) {
            this.mobileControls = new MobileControls(this.player, this.skillSystem);
        }

        // Skill Keybinds
        this.skillKeys = [
            this.input.keyboard!.addKey("ONE"),
            this.input.keyboard!.addKey("TWO"),
            this.input.keyboard!.addKey("THREE"),
            this.input.keyboard!.addKey("FOUR"),
            this.input.keyboard!.addKey("U"),
            this.input.keyboard!.addKey("I"),
            this.input.keyboard!.addKey("O"),
            this.input.keyboard!.addKey("P"),
        ];
    }

    update(time: number) {
        if (this.scene.isPaused()) return;

        // Player Movement
        const keyboardDir = this.inputSystem.getMovementVector();
        const mobileDir = this.mobileControls?.getMovementVector() || new Phaser.Math.Vector2(0, 0);
        keyboardDir.add(mobileDir);
        this.player.move(keyboardDir);

        //Facing indicator
        this.player.facingIndicator.update();

        // Desperation VFX
        this.player.updateDesperationVFX();

        // Systems update
        this.uiSystem.update();
        this.expSystem.update(this.player, time);

        // Boss update
        if (this.bossManager.boss) {
            this.bossManager.boss.update(this.player);
            this.bossManager.bossHealthBar?.draw();

            if (this.bossManager.boss.health <= 0) {
                this.bossManager.spawnBoss();
            }
        }

        // Skill input
        const skillMapping = [
            [0, 4], // skill 0: keys 0 and 4 in skillKeys array
            [1, 5], // skill 1: keys 1 and 5
            [2, 6], // skill 2: keys 2 and 6
            [3, 7], // skill 3: keys 3 and 7
        ];

        skillMapping.forEach((keyIndices, skillIndex) => {
            keyIndices.forEach(i => {
                const key = this.skillKeys[i];
                if (Phaser.Input.Keyboard.JustDown(key)) {
                    this.skillSystem.useSkill(skillIndex);
                }
            });
        });

        // Depth sorting (top-down)
        this.player.setDepth(this.player.y);
        if (this.bossManager.boss) {
            this.bossManager.boss.setDepth(this.bossManager.boss.y);
        }
    }
}
