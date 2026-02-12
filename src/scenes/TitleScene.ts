import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    selectedCharacter: string = "player1"
    selectedIndex: number = 0
    characters = ["player1", "player2", "player3"]
    selectionOutline!: Phaser.GameObjects.Rectangle

    constructor() {
        super("title")
    }

    preload() {
        this.load.spritesheet("player1", "assets/player1.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("player2", "assets/player2.png", {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.spritesheet("player3", "assets/player3.png", {
            frameWidth: 16,
            frameHeight: 16
        })
    }


    create() {
        //Main Title
        this.add.text(400, 150, "Project PhantomZ", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Character selection
        const startX = 250
        const spacing = 150
        const y = 320

        const sprites: Phaser.GameObjects.Sprite[] = []

        this.characters.forEach((key, index) => {
            const sprite = this.add.sprite(startX + index * spacing, y, key, 0)
            .setScale(4)
            .setInteractive({ useHandCursor: true})

            sprites.push(sprite)

            sprite.on("pointerdown", () => {
                this.selectedIndex = index
                this.selectedCharacter = key
                this.moveOutline(sprite)
            })
        })

        //Character chosen outline
        this.selectionOutline = this.add.rectangle(
            sprites[0].x,
            sprites[0].y,
            80,
            80,
        )
        .setStrokeStyle(4, 0xffffff)
        .setDepth(10)

        //Start Button
        const startButton = this.add.text(400, 450, "START GAME [ Enter ]", {
            fontSize: "32px",
            fontFamily: `Georgia, serif`,
            color: `#ffffff`,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

        this.tweens.add({
            targets: startButton,
            alpha: { from: 1, to: 0.5 },
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        startButton.on("pointerdown", () => {
            this.startGame()
        })

        this.add.text(400, 650, "Select Character • Click Start", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: `#ffcc00`
        }).setOrigin(0.5)

        this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        this.enterKey.once("down", () => {
            this.cameras.main.fadeOut(500, 0, 0, 0)
            
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start("game")
            })
        })

        this.add.text(400, 550, "Created by Kevin Lo", {
            fontSize: "18px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: `#ffffff`,
        }).setOrigin(0.5)

        this.add.text(400, 650, "WASD to move, JIKL for skills", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: `#ffcc00`,
        }).setOrigin(0.5)
    }

    moveOutline(sprite: Phaser.GameObjects.Sprite) {
        this.tweens.add({
            targets: this.selectionOutline,
            x: sprite.x,
            y: sprite.y,
            duration: 150,
            ease: "Power2"
        })
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0)

        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start("game", {
                    characterKey: this.selectedCharacter
                })
            }
        )
    }
}