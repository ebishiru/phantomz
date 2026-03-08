import Phaser from "phaser";

export function createMusicToggle(scene: Phaser.Scene) {

    const button = scene.add.image(
        30,
        30,
        scene.sound.mute ? "mute-icon" : "audio-icon"
    )
    .setOrigin(0.5)
    .setScale(2)
    .setInteractive({ useHandCursor: true})
    
    button.on("pointerdown", () => {

        scene.sound.mute = !scene.sound.mute

        button.setTexture(
            scene.sound.mute ? "mute-icon" : "audio-icon"
        )
    })

    return button
}