import Phaser from "phaser";
import { playMusic } from "../systems/MusicSystem";
import { OptionsButton } from "../ui/OptionsButton";

export default class TitleScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    selectedCharacter: string = "player1"
    selectedIndex: number = 0
    characters = ["player1", "player2", "player3"]
    charOutline!: Phaser.GameObjects.Rectangle

    selectedSkillKey: string = "slash"
    skillOutline!: Phaser.GameObjects.Rectangle
    skills = [
        { key: "slash", icon: "slash-icon"},
        { key: "arrow", icon: "arrow-icon"},
        { key: "pulse", icon: "pulse-icon"}
    ]

    constructor() {
        super("title")
    }

    create() {
        //Title Music
        playMusic(this, "titleMusic")

        //Options Button
        OptionsButton(this)

        //Main Title
        this.add.text(400, 125, "The Last Phantom Z", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Character selection
        const startCharX = 250
        const charSpacing = 150
        const charY = 245

        const sprites: Phaser.GameObjects.Sprite[] = []

        this.characters.forEach((key, index) => {
            const sprite = this.add.sprite(startCharX + index * charSpacing, charY, key, 0)
            .setScale(4)
            .setInteractive({ useHandCursor: true})

            sprites.push(sprite)

            sprite.on("pointerdown", () => {
                this.selectedIndex = index
                this.selectedCharacter = key
                this.moveCharOutline(sprite)
            })
        })

        //Character chosen outline
        this.charOutline = this.add.rectangle(
            sprites[0].x,
            sprites[0].y,
            80,
            80,
        )
        .setStrokeStyle(4, 0xffffff)
        .setDepth(10)

        //Menu Text
        this.add.text(400, 315, "Choose your Hero and Starting Skill", {
            fontSize: "16px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: `#ffffff`,
        }).setOrigin(0.5)

        //Starting Skill Selection
        const startSkillX = 250
        const skillSpacing = 150
        const skillY = 385

        const skillIcons: Phaser.GameObjects.Image[] = []

        this.skills.forEach((skill, index) => {
            const icon = this.add.image(startSkillX + index * skillSpacing, skillY, skill.icon)
            .setScale(3)
            .setInteractive({ useHandCursor: true})

            skillIcons.push(icon)

            icon.on("pointerdown", () => {
                this.selectedSkillKey = skill.key
                this.moveSkillOutline(icon)
            })
        })

        //Skill chosen outline
        this.skillOutline = this.add.rectangle(
            skillIcons[0].x,
            skillIcons[0].y,
            80,
            80,
        )
        .setStrokeStyle(4, 0xffffff)
        .setDepth(10)

        //Buttons
        const buttonWidth = 220
        const buttonHeight = 60

        //Start button
        const startButtonBg = this.add.rectangle(400, 505, buttonWidth, buttonHeight, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        //Button Text
        const startText = this.add.text(400, 505, "START GAME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: `#ffffff`,
        })
        .setOrigin(0.5)

        this.tweens.add({
            targets: [startButtonBg, startText],
            alpha: { from: 1, to: 0.5 },
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        startButtonBg.on("pointerdown", () => {
            this.startGame()
        })

        this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

        this.enterKey.once("down", () => {
            this.startGame()
        })

        //Controls Button
        const controlButtonBg = this.add.rectangle(400, 580, buttonWidth, buttonHeight, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        controlButtonBg.on("pointerdown", () => this.scene.start("controls"));

        //Control button text
        this.add.text(400, 580, "CONTROLS", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: `#ffffff`,
        })
        .setOrigin(0.5)

        //Bottom Text
        this.add.text(400, 650, "Created by Kevin Lo", {
            fontSize: "16px",
            fontFamily: `Georgia, serif`,
            color: `#ffcc00`
        }).setOrigin(0.5)
    }

    moveCharOutline(sprite: Phaser.GameObjects.Sprite) {
        this.tweens.add({
            targets: this.charOutline,
            x: sprite.x,
            y: sprite.y,
            duration: 150,
            ease: "Power2"
        })
    }

    moveSkillOutline(icon: Phaser.GameObjects.Image) {
        this.tweens.add({
            targets: this.skillOutline,
            x: icon.x,
            y: icon.y,
            duration: 150,
            ease: "Power2"
        })
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0)

        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start("game", {
                    characterKey: this.selectedCharacter,
                    startingSkill: this.selectedSkillKey
                })
            }
        )
    }
}