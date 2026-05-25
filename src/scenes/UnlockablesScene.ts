import Phaser from "phaser";
import { skills } from "../data/skills";
import { passives } from "../data/passives";
import SaveManager from "../systems/SaveManager";

export default class UnlockablesScene extends Phaser.Scene {
    
    unlockables: { 
        key: string,
        name: string,
        iconKey: string,
        desc: string,
        unlock?: {
            type: string,
            value: any,
            text: string,
            }
        }[] = [...skills, ...passives]

    saveManager!: SaveManager
    selectedUnlockable: string = "slash"
    unlockableOutline!: Phaser.GameObjects.Rectangle

    constructor() {
        super("unlocks");
    }

    create() {
        // Reload SaveManager from localStorage every time we enter this scene
        this.saveManager = new SaveManager()

        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const width = this.scale.width;
        const centerX = width/2;

        this.add.text(centerX, 50, "Unlockables", {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        //Display all unlockables in a grid
        const startX = 150
        const startY = 120
        const spacingX = 150
        const spacingY = 120
        const iconsPerRow = 5

        this.unlockables.forEach((unlockable, index) => {
            const x = startX + (index % iconsPerRow) * spacingX
            const y = startY + Math.floor(index / iconsPerRow) * spacingY

            // Add unlockable icon
            const unlockIcon = this.add.image(x, y, unlockable.iconKey)
                .setOrigin(0.5)
                .setScale(3)
                .setInteractive({ useHandCursor: true })
                .on("pointerdown", () => {
                    this.selectedUnlockable = unlockable.key;
                    this.updateUnlockableOutline(unlockIcon);
                });
        });

        //Unlockable chosen outline
        this.unlockableOutline = this.add.rectangle(
            startX,
            startY,
            100,
            100,
        )
        .setStrokeStyle(4, 0xffcc00)
        .setDepth(20)

        //Back button
        const backButtonBg = this.add.rectangle(centerX, 475, 220, 60, 0x222222)
        .setStrokeStyle(3, 0xffcc00)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true})

        backButtonBg.on("pointerdown", () => this.scene.start("mainmenu"))

        this.add.text(centerX, 475, "HOME", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
        }).setOrigin(0.5)
    }

    updateUnlockableOutline(unlockable: Phaser.GameObjects.Image) {
        this.tweens.add({
            targets: this.unlockableOutline,
            x: unlockable.x,
            y: unlockable.y,
            duration: 150,
            ease: "Power2"
        })
    }
}