import Phaser from "phaser";

export function LeaderboardButton (scene: Phaser.Scene) {

    const button = scene.add.image(920, 120, "trophy-icon")
        .setOrigin(0.5)
        .setScale(2.5)
        .setInteractive({ useHandCursor: true})

    button.on("pointerup", () => {

        scene.scene.start("leaderboard")
    })

    return button;
}