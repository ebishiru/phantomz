import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import WallIndicator from "../entities/WallIndicator";

export default class Boss12MechC extends BossMechanic {

    config = {
        id: "chase-minion-player",
        name: "Explodling",
        castTime: 1000,
        castDuration: 1000,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    minion: Phaser.Physics.Arcade.Sprite | undefined

    onCastStart() {
        //Randomize spawn location
        const { x, y, angle } = this.getRandomCorner();

        //Spawn indicator
        const indicator = new WallIndicator(this.scene, x, y, angle, 15);

        //Spawn minion
        this.scene.time.delayedCall(800, () => {
            indicator.destroy()

            this.minion = this.scene.physics.add.sprite(x, y, "zombie-minion");
            this.minion.setScale(2);
            this.minion.setOffset(0, 0);
            this.minion.setAlpha(0);
            this.minion.setCollideWorldBounds(true);

            this.scene.tweens.add({
                targets: this.minion,
                alpha: { from: 0, to: 1 },
                duration: 200,
                ease: "Back.Out",
                onComplete: () => {
                    this.handleMinion(this.player, this.minion!)
                }
            });
        })
    }

    getRandomCorner() {
        const { width, height } = this.scene.scale
        const corners = [
            { x: 165 , y: 80},
            { x: 165 , y: 460},
            { x: 795 , y: 80 },
            { x: 795 , y: 460 },
        ]
        const corner = Phaser.Utils.Array.GetRandom(corners);
        const angle = Phaser.Math.Angle.Between(
            corner.x,
            corner.y,
            width / 2,
            height / 2
        )
        return { ...corner, angle };
    }

    handleMinion(player: any, minion: Phaser.Physics.Arcade.Sprite) {
        const speed = 150

        //Delayed chasing direction
        const chaseEvent = this.scene.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                if (!minion.active) return;
                this.scene.physics.moveToObject(minion, player, speed);
            }
        })

        //Collision
        const overlap = this.scene.physics.add.overlap(minion, player, () => {
            player.takeDamage(this.config.damage);
            minion.destroy()
            chaseEvent.remove()
            overlap.destroy()
        })

        //Despawn
        this.scene.time.delayedCall(8000, () => {
            if (!minion.active) return
            minion.destroy()
            chaseEvent.remove()
            overlap.destroy()
        })
    }

    destroy() {
        this.indicator?.destroy()
        this.minion?.destroy()
    }
}