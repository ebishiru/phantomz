import Phaser from "phaser";

export function OptionsButton (scene: Phaser.Scene) {

    const button = scene.add.image(
        920,
        40,
        "settings-icon"
    )
    .setOrigin(0.5)
    .setScale(2.5)
    .setInteractive({ useHandCursor: true})
    
    button.on("pointerup", () => {

        const isGameScene = scene.scene.key === "game"

        if (isGameScene) {
            scene.scene.pause("game")
        }

        scene.scene.launch("options", {
            fromGame: isGameScene
        })
        
    })

    return button
}