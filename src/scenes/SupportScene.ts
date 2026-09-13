import Phaser from "phaser";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const SUPPORT_URL = "https://www.buymeacoffee.com/ebishiru";

export default class SupportScene extends Phaser.Scene {
    constructor() {
        super("support");
    }

    create() {
        //Fade in from black
        this.cameras.main.fadeIn(500, 0, 0, 0);

        const width = this.scale.width;
        const centerX = width / 2;

        this.add.text(centerX, 50, "Support the Developer", {
            fontSize: "32px",
            fontFamily: `Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)

        this.add.text(centerX, 120, "I hope you enjoyed playing The Last Phantom Z.", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            align: "center",
        }).setOrigin(0.5, 0)

        this.add.text(centerX, 180, "You can support me by buying me a coffee at the link below.\nYour support helps fund future updates and new projects.", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            align: "center",
        }).setOrigin(0.5, 0)

        const supportLink = this.add.text(centerX, 260, SUPPORT_URL, {
            fontSize: "28px",
            fontFamily: `Georgia, serif`,
            color: "#ffcc00",
            align: "center",
        }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true })

        supportLink.on("pointerup", () => {
            void this.openSupportLink()
        })

        this.add.text(centerX, 330, "I am a solo developer looking to make it big.\nThank you for your support!", {
            fontSize: "24px",
            fontFamily: `Georgia, serif`,
            color: "#ffffff",
            align: "center",
        }).setOrigin(0.5, 0)

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

    private async openSupportLink(): Promise<void> {
        if (Capacitor.isNativePlatform()) {
            await Browser.open({ url: SUPPORT_URL })
            return
        }

        window.open(SUPPORT_URL, "_blank", "noopener,noreferrer")
    }
}