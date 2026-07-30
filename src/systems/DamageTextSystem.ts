import Phaser from "phaser"

export function showFloatingDamage(
    scene: Phaser.Scene,
    x: number,
    y: number,
    amount: number,
    color = "#ff4d4d"
) {
    const value = Math.max(1, Math.round(amount))

    let valueText = `${value}`

    if (value > 49) {
        valueText = `${value}!!`
    }

    const text = scene.add.text(x, y, `${valueText}`, {
        fontSize: "20px",
        fontFamily: "Georgia, serif",
        color,
        fontStyle: "bold",
        align: "center",
    })
        .setOrigin(0.5)
        .setDepth(1000)
        .setStroke("#000000", 4)

    scene.tweens.add({
        targets: text,
        y: y - 40,
        alpha: 0,
        duration: 700,
        ease: "Cubic.Out",
        onComplete: () => text.destroy(),
    })

    scene.tweens.add({
        targets: text,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 120,
        yoyo: true,
        repeat: 0,
    })
}
