import Phaser from "phaser";

export function SupportButton (scene: Phaser.Scene) {

    const button = scene.add.image(920, 200, "coffee-icon")
        .setOrigin(0.5)
        .setScale(2.5)
        .setInteractive({ useHandCursor: true})

    button.on("pointerup", () => {

        scene.scene.start("support")
    })
}