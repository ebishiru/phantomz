import Phaser from "phaser"

export default class GameSetupScene extends Phaser.Scene {

    characters = ["player1", "player2", "player3"]
    skills = [
        { key: "slash", icon: "slash-icon"},
        { key: "arrow", icon: "arrow-icon"},
        { key: "javelin", icon: "javelin-icon"}
    ]

    selectedCharacter: string = "player1"
    selectedSkillKey: string = "slash"
    selectedLevel!: string

    charOutline!: Phaser.GameObjects.Rectangle
    skillOutline!: Phaser.GameObjects.Rectangle

    constructor() {
        super("gamesetup")
    }

    create(data: { level: string}) {

        // Pass level info
        this.selectedLevel = data.level

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);
        
        const { width } = this.scale

        this.add.text(width/2, 50, "Game Setup", {
            fontSize: "40px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00"
        }).setOrigin(0.5)

        this.add.text(width/2, 130, "Select your Character and Starting Skill", {
            fontSize: "24px",
            fontFamily: "Georgia, serif",
            color: "#ffffff"
        }).setOrigin(0.5)

        //Character selection
        const startCharX = 330
        const charSpacing = 150
        const charY = 230

        const sprites: Phaser.GameObjects.Sprite[] = []

        this.characters.forEach((key, index) => {
            const sprite = this.add.sprite(startCharX + index * charSpacing, charY, key, 0)
            .setScale(4)
            .setInteractive({ useHandCursor: true})

            sprites.push(sprite)

            sprite.on("pointerdown", () => {
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

        //Starting Skill Selection
        const startSkillX = 330
        const skillSpacing = 150
        const skillY = 335

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

        //Start Game Button
        const startBg = this.add.rectangle(width * 2/3, 490, 260, 70, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setInteractive({ useHandCursor: true})

        this.add.text(width * 2/3, 490, "START GAME",{
            fontSize:"24px",
            fontFamily:"Georgia, serif",
            color:"#ffffff"
        }).setOrigin(0.5)

        startBg.on("pointerdown",()=>{
            this.scene.start("game",{
                characterKey:this.selectedCharacter,
                startingSkill:this.selectedSkillKey,
                level:this.selectedLevel,
            })
        })

        // BACK BUTTON
        const backBg = this.add.rectangle(width / 3, 490, 260, 70, 0x222222)
        .setStrokeStyle(3,0xffcc00)
        .setInteractive({useHandCursor:true})

        this.add.text(width/3, 490, "BACK",{
            fontSize:"24px",
            fontFamily:"Georgia, serif",
            color:"#ffffff"
        }).setOrigin(0.5)

        backBg.on("pointerdown",()=>{
            this.scene.start("levelselect")
        })
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
}