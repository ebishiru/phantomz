import Phaser from "phaser"
import SaveManager from "../systems/SaveManager"

export default class LevelSelect extends Phaser.Scene {

    levels = ["cave-texture", "snow-texture"]

    selectedLevel: string = "cave-texture"
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
        const startLevelX = 325
        const levelSpacing = 300
        const levelY = 250

        const mapTextures: Phaser.GameObjects.Image[] = []

        this.levels.forEach((key, index) => {
            const texture = this.add.sprite(startLevelX + index * levelSpacing, levelY, key, 0)
            .setScale(3)
            .setInteractive({ useHandCursor: true})

            mapTextures.push(texture)

            texture.on("pointerdown", () => {
                this.selectedLevel = key
                this.moveLevelOutline(texture)
            })

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