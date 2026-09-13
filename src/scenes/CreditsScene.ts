import Phaser from "phaser";
import SaveManager from "../systems/SaveManager";

export default class CreditsScene extends Phaser.Scene {
    saveManager!: SaveManager;

    constructor() {
        super("credits");
    }

    create() {
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.saveManager = new SaveManager();

        const width = this.scale.width;
        const centerX = width/2;

        this.add.text(centerX, 50, "Credits", {
            fontSize: "32px",
            fontFamily: `Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        this.add.text(centerX, 125,
            "Game Design, Programming & Art: \n",
            {
                fontSize: "20px",
                fontFamily: "Georgia, serif",
                color: "#ffcc00",
                align: "center",
            }
        ).setOrigin(0.5, 0)

        this.add.text(centerX, 155,
            "Kevin Lo",
            {
                fontSize: "24px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
                align: "center",
            }
        ).setOrigin(0.5, 0)

        this.add.text(centerX, 215, "Music made by:", {
            fontSize: "20px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00",
        }).setOrigin(0.5)

        this.add.text(centerX, 245, "xDeviruchi", {
            fontSize: "16px",
            fontFamily: "Georgia, serif",
            color: "#FFFFFF",
        }).setOrigin(0.5)

        this.add.text(centerX, 290, "Special thanks to our Playtesters:", {
            fontSize: "20px",
            fontFamily: "Georgia, serif",
            color: "#ffcc00",
        }).setOrigin(0.5)

        const playtesters = [
            "Bidi", "Callixtus", "Cameron2k131", "Conconuts", "Drez", "Endji",
            "Ephe", "Fiona", "Fornogg", "Fred", "Kelvang", "MichyMiche",
            "Mrs.Test", "Nalya", "NotGary", "RaveonGames", "Rftchy", "Starusman",
            "Sylliepie", "TataRora", "Tickle", "Tony_Ritz", "Xeiryn", "Yvonne"
        ]
        const columnCount = 4
        const rowCount = Math.ceil(playtesters.length / columnCount)
        const columnWidth = 150
        const gridStartX = centerX - (columnCount - 1) * columnWidth / 2
        const gridStartY = 310

        playtesters.forEach((name, index) => {
            const column = Math.floor(index / rowCount)
            const row = index % rowCount

            this.add.text(gridStartX + column * columnWidth, gridStartY + row * 18, name, {
                fontSize: "16px",
                fontFamily: "Georgia, serif",
                color: "#FFFFFF",
                align: "center",
                fixedWidth: columnWidth,
            }).setOrigin(0.5, 0)
        })

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

        //Save Reset Button
        // const resetButtonBg = this.add.rectangle(100, 70, 160, 50, 0x222222)
        // .setStrokeStyle(3, 0xffcc00)
        // .setOrigin(0.5)
        // .setInteractive({ useHandCursor: true})

        // resetButtonBg.on("pointerdown", () => {
        //     this.resetSaveData();
        // })

        // this.add.text(100, 70, "RESET SAVE", {
        //     fontSize: "20px",
        //     fontFamily: `Georgia, serif`,
        //     color: "#ff0000",
        // }).setOrigin(0.5)

        //Dev Save Button
        // const devButtonBg = this.add.rectangle(100, 140, 160, 55, 0x222222)
        // .setStrokeStyle(3, 0xffcc00)
        // .setOrigin(0.5)
        // .setInteractive({useHandCursor: true})

        // devButtonBg.on("pointerdown", () => {
        //     this.devSaveData();
        // })

        // this.add.text(100, 140, "DEV SAVE", {
        //     fontSize: "20px",
        //     fontFamily: `Georgia, serif`,
        //     color: "#ff0000",
        // }).setOrigin(0.5)
    }

    resetSaveData() {
        this.saveManager.reset()
        this.scene.start("mainmenu");
    }

    devSaveData() {
        const levels = ["cave", "snow", "tower"]
        levels.forEach(level => {
            this.saveManager.updateScore(9999, level)
        })

        for (let i = 1; i <= 30; i++) {
            this.saveManager.addBossKill(`boss${i}`, 3)
        }
        
        this.scene.start("mainmenu");
    }
}