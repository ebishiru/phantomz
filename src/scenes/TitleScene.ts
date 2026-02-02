import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    enterKey!: Phaser.Input.Keyboard.Key

    constructor() {
        super("title")
    }

    preload() {
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 16,
            frameHeight: 16
        })
    }

    create() {
        this.add.text(400, 150, "Project PhantomZ", {
            fontSize: "48px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        const playerSprite = this.add.sprite(400, 300, "player", 0)
        playerSprite.setScale(4)

        const startText = this.add.text(400, 450, "Press [ Enter ] to Start", {
            fontSize: "24px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: `#ffffff`,
        }).setOrigin(0.5)

        this.tweens.add({
            targets: startText,
            alpha: { from: 1, to: 0.3 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
        });

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

        this.add.text(400, 650, "WASD to move, [J], [K], [L], [;] for skills", {
            fontSize: "16px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: `#ffcc00`,
        }).setOrigin(0.5)
    }

}