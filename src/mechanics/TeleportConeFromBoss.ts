import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";

export default class TeleportConeFromBoss extends BossMechanic {

    config = {
        id: "teleport-cone-boss",
        name: "Megasonic",
        castTime: 2000,
        cooldown: 6000,
        showCastBar: true,
        damage: 20,
        range: 700,
        width: 0,
    }

    coneAngle = Math.PI / 3

    onCastStart() {
        //Teleport to corners
        const location = Phaser.Utils.Array.GetRandom(
            (this.scene as any).bossManager.cornerCoordinates
        ) as { x: number; y: number }

        this.boss.setPosition(location.x, location.y)
        this.boss.body?.stop()

        //Aim towards center

        const centerX = this.scene.scale.width / 2
        const centerY = this.scene.scale.height / 2

        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            centerX,
            centerY,
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