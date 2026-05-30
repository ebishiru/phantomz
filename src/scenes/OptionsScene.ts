import Phaser from "phaser";
import GameScene from "./GameScene";

export default class OptionsScene extends Phaser.Scene {

    fromGame = false

    constructor() {
        super("options")
    }

    init(data: { fromGame? : boolean}) {
        this.fromGame = !!data.fromGame
    }

    create() {
        this.input.setDefaultCursor("default");

        const { width, height } = this.scale;
        this.scene.bringToTop();

        // Dim background
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.45)
            .setOrigin(0)
            .setInteractive({ useHandCursor: false });

        overlay.on("pointerdown", () => this.close());

        const panelWidth = width * 0.75;
        const panelHeight = height * 0.75;

        const panel = this.add.rectangle(width/2, height/2, panelWidth, panelHeight, 0x1e1e1e)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: false });

        panel.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            pointer.event.stopPropagation();
        });

        // Title
        this.add.text(width/2, height/2 - panelHeight/2 + 80, "OPTIONS", {
            fontSize: "32px",
            fontFamily: "Georgia",
            color: "#ffcc00"
        }).setOrigin(0.5);

        // Volume controls
        const volumeIcon = this.add.image(width/2 - 175, height/2 - 70, "audio-icon")
            .setScale(2);

        this.createVolumeSlider(width/2, height/2 - 70, volumeIcon);

        //Back Button
        const backButtonBg = this.add.rectangle(width/2, panelHeight, 220, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.close())

        this.add.text(width/2, panelHeight, "BACK", {
            fontSize: "24px",
            fontFamily: "Georgia, serif",
            color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        if (this.fromGame) {
            // Quit Button - top-left outside the options box
            const quitButtonBg = this.add.rectangle(100, 70, 160, 50, 0x222222)
                .setStrokeStyle(3, 0xffcc00)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true})

            quitButtonBg.on("pointerup", () => this.quit())

            this.add.text(100, 70, "QUIT", {
                fontSize: "20px",
                fontFamily: "Georgia, serif",
                color: "#ff0000",
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            this.displaySkillSummary();
        }

        this.input.keyboard?.once("keydown-ESC", () => this.close());
    }

    createVolumeSlider(x: number, y: number, icon: Phaser.GameObjects.Image) {
        const sliderWidth = 250

        const bar = this.add.rectangle(x, y, sliderWidth, 8, 0x555555)
        bar.setInteractive({ useHandCursor: true })

        const knob = this.add.circle(x + sliderWidth/2, y, 10, 0xffcc00)
            .setInteractive({ draggable: true, useHandCursor: true})
        
            const updateVolume = (pointerX: number) => {

                const left = x - sliderWidth / 2
                const right = x + sliderWidth / 2

                const clamped = Phaser.Math.Clamp(pointerX, left, right)

                knob.x = clamped

                const volume = (clamped-left)/sliderWidth

                this.sound.setVolume(volume)

                // change icon
                if (volume <= 0.01) {
                    icon.setTexture("mute-icon")
                } else {
                    icon.setTexture("audio-icon")
                }
            }

        knob.on("drag", (_pointer: Phaser.Input.Pointer, dragX:number) => {
            updateVolume(dragX)
        })

        bar.on("pointerdown",(pointer:Phaser.Input.Pointer)=>{
            pointer.event.stopPropagation()
            updateVolume(pointer.x)
        })
    }

    displaySkillSummary() {

        const gameScene = this.scene.get("game") as GameScene
        const { width, height } = this.scale;

        const panelWidth = width * 0.75;
        const startY = height/2 - 25; // Start position between volume bar and back button
        const centerX = width / 2;
        let currentY = startY;

        gameScene.skillSystem.skills.forEach((skill:any)=>{

            if(!skill.enabled) return

            // Image positioned on the left
            const imageX = centerX - 120;
            this.add.image(imageX, currentY, skill.iconKey)
                .setScale(2);

            // Skill name in yellow
            this.add.text(centerX - 60, currentY, skill.name, {
                fontSize: "16px",
                color: "#ffcc00",
                fontFamily: "Georgia"
            }).setOrigin(0, 0.5);

            // Stats in white
            const stats = `  Dmg:${skill.getDamage().toFixed(0)}  CD:${(skill.getCooldown()/1000).toFixed(2)}`;
            
            this.add.text(centerX + 30, currentY, stats, {
                fontSize: "16px",
                color: "#ffffff",
                fontFamily: "Georgia"
            }).setOrigin(0, 0.5);

            currentY += 35;
        })
    }

    close() {
        if (this.fromGame) {
            const game = this.scene.get("game") as any;
            game.skillSystem.resumeAll();
            this.scene.resume("game");
        }
        this.scene.stop();
    }

    quit() {
        // Hide mobile controls
        const controlsEl = document.getElementById("mobile-controls") as HTMLDivElement | null;
        if (controlsEl) controlsEl.style.display = "none";

        // Stop all game-related scenes
        this.scene.stop("options");
        this.scene.stop("level-up");
        this.scene.stop("game");

        // Start main menu
        this.scene.start("mainmenu");
    }
}