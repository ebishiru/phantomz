export function setupEscapeMenu(scene: Phaser.Scene) {

    const esc = scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
    )

    esc.on("down", () => {

        const optionsOpen = scene.scene.isActive("options")

        if (optionsOpen) {
            scene.scene.stop("options")
            return
        }

        if (scene.scene.key === "game") {

            const game = scene as any
            game.skillSystem.pauseAll()
            scene.scene.pause()
        }

        scene.scene.launch("options", {
            fromGame: scene.scene.key === "game"
        })

        scene.scene.bringToTop("options")
    })
}