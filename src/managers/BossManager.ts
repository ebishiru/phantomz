import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import Boss from "../entities/Boss";
import HealthBar from "../ui/HealthBar";
import Player from "../entities/Player";
import BossMechanic from "../mechanics/BossMechanics";
import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";

export default class BossManager {
    scene: Phaser.Scene
    boss!: Boss
    bossHealthBar!: HealthBar
    isRespawning = false
    player: Player
    bossMechanics!: BossMechanic[]
    bossMechanicTimer!: Phaser.Time.TimerEvent

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene
        this.player = player
    }

    spawnBoss(x = 400, y = 350, respawnDelay = 800) {
        if (this.isRespawning) return

        if (this.boss) {
            this.isRespawning = true
            this.destroyAllMechanics();
            (this.scene as GameScene).spawnExp(this.boss.x, this.boss.y)
            this.boss.destroyBoss()
            this.bossHealthBar.destroy()

            this.scene.time.delayedCall(respawnDelay, () => {
                this.createBoss(x, y)
                this.isRespawning = false
            })
        } else if (!this.boss) {
            this.createBoss(x, y)
        }
    }

    createBoss(x: number, y: number) {
        this.boss = new Boss(this.scene, x, y)
        this.bossHealthBar = new HealthBar(
            this.scene,
            150, 30,
            500, 20,
            this.boss,
            0xff0000
        )

        this.player.slashSkill.boss = this.boss
        this.player.arrowSkill.boss = this.boss
        this.player.pulseSkill.boss = this.boss

        this.bossMechanics = [
            new CircleTelegraphOnBoss(this.scene, this.boss, this.player),
            new CircleTelegraphOnPlayer(this.scene, this.boss, this.player),
            new LineTelegraphFromBoss(this.scene, this.boss, this.player),
        ]

        this.bossMechanicTimer = this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                const mechanic = Phaser.Utils.Array.GetRandom(this.bossMechanics)
                mechanic.trigger()
            }
        })
    }

    destroyAllMechanics() {
        if (this.bossMechanicTimer) {
            this.bossMechanicTimer.remove(false)
            this.bossMechanicTimer = null as any
        }
        if (this.bossMechanics) {
            this.bossMechanics.forEach((mechanic) => {
                if (mechanic.destroy) {
                    mechanic.destroy()
                }
            })
            this.bossMechanics = []
        }
    }
}