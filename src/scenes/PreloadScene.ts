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
        this.load.audio("snowMusic", "assets/snow-music.mp3")
        this.load.audio("towerMusic", "assets/tower-music.mp3")
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
        for (let i = 1; i <= 30; i++) {
            this.load.spritesheet(`boss${i}`, `assets/boss${i}.png`, {
                frameWidth: 16,
                frameHeight: 16
            })
        }

        this.load.image("boss12-minion", "assets/boss12-minion.png");
        this.load.image("boss13-clone", "assets/boss13-clone.png");
        this.load.image("boss17-minion", "assets/boss17-minion.png");
        this.load.image("boss18-fakeout", "assets/boss18-fakeout.png");
        this.load.image("boss18-clone", "assets/boss18-clone.png");
        this.load.image("boss24-minion", "assets/boss24-minion.png");
        this.load.image("boss29-minion", "assets/boss29-minion.png");
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
            "gust",
            "zephyr",
            "mirage",
            "quasar",
            "yoyo",
        ]

        skillKeys.forEach(key => {
            this.load.image(`${key}-icon`, `assets/${key}-icon.png`)
            this.load.image(`${key}-vfx`, `assets/${key}-vfx.png`)
        })

        //Extra skill assets
        this.load.image("fireball2-vfx", "assets/fireball2-vfx.png")    //CAST ICON
        this.load.image("volt2-vfx", "assets/volt2-vfx.png")            //CAST ICON
        this.load.image("skip-icon", "assets/skip-icon.png")            //SKIP ICON
        this.load.image("reroll-icon", "assets/reroll-icon.png")        //REROLL ICON
        this.load.image("zephyr2-vfx", "assets/zephyr2-vfx.png")        //THRUST VFX
        this.load.image("mirage2-vfx", "assets/mirage2-vfx.png")        //DMG VFX
        this.load.image("quasar2-vfx", "assets/quasar2-vfx.png")        //DMG VFX
        this.load.image("quasar3-vfx", "assets/quasar3-vfx.png")        //DMG 2 VFX
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
            "echo",
            "gourmet",
        ]

        passiveKeys.forEach(key => {
            this.load.image(`${key}-icon`, `assets/${key}-icon.png`)
        })

        this.load.image("gourmet-vfx", "assets/gourmet-vfx.png")        //BREAD VFX
    }

    loadUI() {
        this.load.image("exp-orb", "assets/exp-orb.png")
        this.load.image("loading-border", "assets/loading-border.png")
        this.load.image("ready-border", "assets/ready-border.png")
        this.load.image("settings-icon", "assets/settings-icon.png")
    }

    loadEnvironment() {
        this.load.image("cave", "assets/cave.png")
        this.load.image("snow", "assets/snow.png")
        this.load.image("tower", "assets/tower.png")
    }

    create() {
        this.scene.start("title")
    }
}