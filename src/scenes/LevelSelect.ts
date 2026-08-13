import Phaser from "phaser"
import SaveManager from "../systems/SaveManager"

export default class LevelSelect extends Phaser.Scene {

    levels = ["cave", "snow", "tower"]

    selectedLevel: string = "cave"
    saveManager!: SaveManager

    levelOutline!: Phaser.GameObjects.Rectangle

    constructor() {
        super("levelselect")
    }

    create() {
        // Reload SaveManager from localStorage every time we enter this scene
        this.saveManager = new SaveManager()

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const { width } = this.scale

        this.add.text(width/2, 50, "Select Level", {
            fontSize: "40px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00"
        }).setOrigin(0.5)

        //Level selection
        const startLevelX = 175
        const levelSpacing = 300
        const levelY = 250

        const mapTextures: Phaser.GameObjects.Image[] = []
        const levelLocked: Record<string, boolean> = {}

        this.levels.forEach((key, index) => {
            const texture = this.add.sprite(startLevelX + index * levelSpacing, levelY, key, 0)
            .setScale(3)
            .setInteractive({ useHandCursor: true})

            if (key === "cave") {
                texture.setTint(0xb0a080);
                texture.setAlpha(0.9);
            }
            if (key === "snow") {
                texture.setTint(0x8a9aa8);
                texture.setAlpha(0.7);
            }
            if (key === "tower") {
                texture.setTint(0x87ceeb);
                texture.setAlpha(0.8);
            }

            // Determine lock state for snow/tower
            let isLocked = false
            if (key === "snow") {
                isLocked = this.saveManager.getHiScore("cave") < 1500
            } else if (key === "tower") {
                isLocked = this.saveManager.getHiScore("snow") < 1500
            }

            levelLocked[key] = isLocked

            mapTextures.push(texture)

            if (isLocked) {
                texture.setAlpha(0.35)
                const lockText = this.add.text(texture.x, texture.y - 10, "LOCKED", {
                    fontSize: "18px",
                    fontFamily: "Georgia, serif",
                    color: "#ff0000"
                })
                .setOrigin(0.5)
                .setDepth(40)
                .setAlpha(1)
                .setBlendMode(Phaser.BlendModes.NORMAL)

                texture.on("pointerdown", () => {
                    // show short feedback when clicking locked level
                    const warn = this.add.text(this.scale.width/2, 420, `Reach 1500 Hi-Score on the previous level to unlock.`, {
                        fontSize: "16px",
                        fontFamily: "Georgia, serif",
                        color: "#ff0000",
                    })
                    .setOrigin(0.5)
                    .setDepth(60)
                    .setAlpha(1)
                    .setBlendMode(Phaser.BlendModes.NORMAL)

                    this.time.delayedCall(1400, () => warn.destroy())
                })
            } else {
                texture.on("pointerdown", () => {
                    this.selectedLevel = key
                    this.moveLevelOutline(texture)
                })
            }

            // Add score display under each map texture
            const highScore = this.saveManager.getHiScore(key)
            const totalScore = this.saveManager.getTotalScore(key)
            
            const scoreY = levelY + 130 // Position below the texture
            
            // High Score
            this.add.text(startLevelX + index * levelSpacing, scoreY, `Best: ${highScore}`, {
                fontSize: "14px",
                fontFamily: "Georgia, serif",
                color: "#ffcc00",
                align: "center"
            }).setOrigin(0.5)
            
            // Total Score
            this.add.text(startLevelX + index * levelSpacing, scoreY + 20, `Total: ${totalScore}`, {
                fontSize: "12px",
                fontFamily: "Georgia, serif",
                color: "#ffffff",
                align: "center"
            }).setOrigin(0.5)
        })

        //Level chosen outline
        this.levelOutline = this.add.rectangle(
            mapTextures[0].x,
            mapTextures[0].y,
            220,
            220,
        )
        .setStrokeStyle(4, 0xffcc00)
        .setDepth(20)

        //Next button
        const nextBg = this.add.rectangle(width * 2/3, 490, 260, 70, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setInteractive({ useHandCursor: true})

        this.add.text(width * 2/3, 490, "NEXT", {
            fontSize: "24px",
            fontFamily: "Georgia, serif",
            color: "#ffffff"
        }).setOrigin(0.5)

        nextBg.on("pointerdown", () => {
            if (levelLocked[this.selectedLevel]) {
                const warn = this.add.text(this.scale.width/2, 420, `Level locked. Reach 1500 hi-score on the previous level.`, {
                    fontSize: "16px",
                    fontFamily: "Georgia, serif",
                    color: "#ff6666",
                    backgroundColor: "#000000"
                })
                .setOrigin(0.5)
                .setDepth(60)
                .setAlpha(1)
                .setBlendMode(Phaser.BlendModes.NORMAL)

                this.time.delayedCall(1400, () => warn.destroy())
                return
            }

            //Reset revive and half time state
            this.registry.set("reviveUsed", false);
            this.registry.set("halfTime", false);

            this.scene.start("gamesetup", {
                level: this.selectedLevel
            })
        })

        //Back button
        const backBg = this.add.rectangle(width / 3, 490, 260, 70, 0x222222)
        .setStrokeStyle(3,0xffcc00)
        .setInteractive({useHandCursor:true})

        this.add.text(width/3, 490, "BACK",{
            fontSize:"24px",
            fontFamily:"Georgia, serif",
            color:"#ffffff"
        }).setOrigin(0.5)

        backBg.on("pointerdown",()=>{
            this.scene.start("mainmenu")
        })
    }

    moveLevelOutline(texture: Phaser.GameObjects.Image) {
        this.tweens.add({
            targets: this.levelOutline,
            x: texture.x,
            y: texture.y,
            duration: 150,
            ease: "Power2"
        })
    }
}