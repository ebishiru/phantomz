import Phaser from "phaser";
import BossMechanic from "./BossMechanics";
import LineTelegraph from "../entities/LineTelegraph";

export default class LineTelegraphFromBoss extends BossMechanic {
    trigger() {
        const angle = Phaser.Math.Angle.Between(
            this.boss.x,
            this.boss.y,
            this.player.x,
            this.player.y
        )
        
        const telegraph = new LineTelegraph(
            this.scene,
            this.boss.x,
            this.boss.y,
            angle,
            700,
            100
        )

        this.scene.time.delayedCall(1000, () => {
            telegraph.resolveAttack(this.player)
        })
    }
}