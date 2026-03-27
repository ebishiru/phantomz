import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("preload")
    }

    preload() {
        this.preloadMusic()
        this.loadArt()
        this.loadCharacters()
        this.loadBosses()
        this.loadSkills()
        this.loadPassives()
        this.loadUI()
        this.loadEnvironment()
    }

    preloadMusic() {
        this.load.audio("titleMusic", "assets/title-music.mp3")
        this.load.audio("caveMusic", "assets/cave-music.mp3")
        this.load.audio("gameOverMusic", "assets/game-over-music.mp3")
        this.load.image("audio-icon", "assets/audio-icon.png")
        this.load.image("mute-icon", "assets/mute-icon.png")
    }

    loadArt() {
        this.load.spritesheet("main-menu-art", "assets/main-menu-art.png", {
            frameWidth: 32,
            frameHeight: 32
        })
    }

    loadCharacters() {
        for (let i = 1; i <= 3; i++) {
            this.load.spritesheet(`player${i}`, `assets/player${i}.png`, {
                frameWidth: 16,
                frameHeight: 16
            })
        }
    }

    loadBosses() {
        for (let i = 1; i <= 10; i++) {
            this.load.spritesheet(`boss${i}`, `assets/boss${i}.png`, {
                frameWidth: 16,
                frameHeight: 16
            })
        }
    }

    loadSkills() {
        const skillKeys = [
            "slash",
            "arrow",
            "pulse",
            "thrust",
            "caltrops",
            "fireball",
            "devour",
            "hook",
            "volt",
            "restoration",
            "ward",
            "javelin",
        ]

        skillKeys.forEach(key => {
            this.load.image(`${key}-icon`, `assets/${key}-icon.png`)
            this.load.image(`${key}-vfx`, `assets/${key}-vfx.png`)
        })

        //Extra skill assets
        this.load.image("fireball2-vfx", "assets/fireball2-vfx.png")    //CAST ICON
        this.load.image("volt2-vfx", "assets/volt2-vfx.png")            //CAST ICON
        // this.load.image("ward-vfx", "assets/ward-vfx.png")              //WARD HERO OVERLAY
        this.load.image("skip-icon", "assets/skip-icon.png")            //SKIP ICON
    }

    loadPassives() {
        const passiveKeys = [
            "vitality",
            "strength",
            "swiftness",
            "amplifier",
            "haste",
            "executioner",
            "fortify",
            "echo"
        ]

        passiveKeys.forEach(key => {
            this.load.image(`${key}-icon`, `assets/${key}-icon.png`)
        })
    }

    loadUI() {
        this.load.image("exp-orb", "assets/exp-orb.png")
        this.load.image("loading-border", "assets/loading-border.png")
        this.load.image("ready-border", "assets/ready-border.png")
        this.load.image("settings-icon", "assets/settings-icon.png")
    }

    loadEnvironment() {
        this.load.image("dirt-texture", "assets/dirt-texture.png")
    }

    create() {
        this.scene.start("title")
    }
}