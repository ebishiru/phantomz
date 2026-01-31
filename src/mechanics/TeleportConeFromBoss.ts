import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class TeleportConeFromBoss extends BossMechanic {

    config = {
        id: "teleport-cone-boss",
        name: "Megasonic",
        castTime: 1500,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 450,
        width: 0,
    }

    coneAngle = Math.PI / 3

    onCastStart() {
        //Teleport to corners
        const bossManager = (this.scene as any).bossManager as any
        const corners: { x: number; y: number }[] = bossManager.getCenteredSquareCorners(0.6)

        const location = Phaser.Utils.Array.GetRandom(corners)

        this.boss.body?.stop()

        this.scene.tweens.add({
            targets: this.boss,
            x: location.x,
            y: location.y,
            duration: 300,
            ease: "Sine.easeInOut",
            onStart: () => this.boss.body?.stop(),
            onComplete: () => {
                //Aim towards center
                const bounds = this.scene.physics.world.bounds

                const angle = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    bounds.centerX,
                    bounds.centerY,
                )

                //Draw Telegraph
                this.telegraph = new ConeTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    angle,
                    this.config.range,
                    this.coneAngle,
                )
            }
        })
    }

    execute() {
        //Check Hit
        let hit = false

        const dist = Phaser.Math.Distance.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )

        if (dist <= this.config.range + this.player.hurtboxRadius) {
            const angleToPlayer = Phaser.Math.Angle.Between(
                this.boss.x,
                this.boss.y,
                this.player.x,
                this.player.y,
            )

            const angleDiff = Phaser.Math.Angle.Wrap(
                angleToPlayer - this.telegraph.angle
            )

            if (Math.abs(angleDiff) <= this.coneAngle / 2) {
                hit = true
            }
        }

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}