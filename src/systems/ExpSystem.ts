import Phaser from "phaser";
import ExpOrb from "../entities/ExpOrb";
import Player from "../entities/Player";

export default class ExpSystem {
    scene: Phaser.Scene
    expOrbs: ExpOrb[] = []

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    spawn(x: number, y: number, count: number = 15) {
        for (let i = 0; i < count; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
            const distance = Phaser.Math.FloatBetween(80, 120)

            const spawnX = x + Math.cos(angle) * distance
            const spawnY = y + Math.sin(angle) * distance

            const orb = new ExpOrb(this.scene, spawnX, spawnY, 1)
            orb.setScale(0)

            this.scene.tweens.add({
                targets: orb,
                scale: 0.5,
                duration: 800,
                ease: "Back.Out"
            })

            this.expOrbs.push(orb)
        }
    }

    update(player: Player, time: number) {
        this.expOrbs.forEach((orb, index) => {
            if (!orb.active) return

            const distance = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                orb.x,
                orb.y
            )

            if (distance < 20) {
                player.gainExp(orb.expValue)
                orb.destroy()
                this.expOrbs.splice(index, 1)
            } else {
                orb.update(player, time)
            }
        })
    }
}