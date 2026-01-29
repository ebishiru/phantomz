import Phaser from "phaser";
import Boss from "../entities/Boss";
import { Bosses } from "../data/bosses";
import BossMechanic from "../mechanics/BossMechanic";
import HealthBar from "../ui/HealthBar";

export default class BossManager {
    scene: Phaser.Scene;
    player: any
    boss: Boss | null = null;
    bossHealthBar: HealthBar | null = null
    bossMechanics: BossMechanic[] = [];
    bossMechanicTimer: Phaser.Time.TimerEvent | null = null;

    // Buff system
    activeBuffs: string[] = [];
    baseBuffPool: string[] = ["HP", "HP", "HP", "CD", "CD", "CD"];
    buffPool: string[] = []

    // Global timer UI
    globalTimerSeconds = 0;
    globalTimerText!: Phaser.GameObjects.Text;

    // Kill Count
    bossesKilled = 0
    bossKillText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, player: any) {
        this.scene = scene;
        this.player = player;

        this.resetBuffPool();
        this.startBuffTimer();
        this.createTimerText();
        this.createBossKillText();
    }

    resetBuffPool() {
        this.buffPool = [...this.baseBuffPool]
    }

    createTimerText() {
        this.globalTimerText = this.scene.add.text(700, 10, "Time: 00:00", { 
            fontSize: "16px", 
            fontFamily: `"Old English Text MT", Georgia, serif`, 
            color: "#ffffff" 
        });

        // 1-second timer to update UI
        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                this.globalTimerSeconds++;
                const min = Math.floor(this.globalTimerSeconds / 60).toString().padStart(2, "0");
                const sec = (this.globalTimerSeconds % 60).toString().padStart(2, "0");
                this.globalTimerText.setText(`Time: ${min}:${sec}`);
            }
        });
    }

    createBossKillText() {
        this.bossKillText = this.scene.add.text(700, 30, "Bosses: 0", {
            fontSize: "16px",
            fontFamily: `"Old English Text MT", Georgia, serif`, 
            color: "#ffffff" 
        });
    }

    startBuffTimer() {
        this.scene.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                if (this.buffPool.length === 0) {
                    this.resetBuffPool()
                }
                const buff = Phaser.Utils.Array.RemoveRandomElement(this.buffPool) as unknown as string;
                this.activeBuffs.push(buff);
                this.applyBuffToBoss();
            }
        });
    }

    applyBuffToBoss() {
        if (!this.boss) return

        const hpCount = this.activeBuffs.filter(b => b === "HP").length
        const cdCount = this.activeBuffs.filter(b => b === "CD").length

        // Giving Boss more HP
        this.boss.maxHealth += 50 * hpCount
        this.boss.health = this.boss.maxHealth

        // Giving Boss attacks lower delay
        const newDelay = Math.max(800, 5000 - 200 * cdCount)

        if (this.bossMechanicTimer) {
            this.bossMechanicTimer.remove(false)
            this.bossMechanicTimer = this.scene.time.addEvent({
                delay: newDelay,
                loop: true,
                callback: () => this.triggerMechanics(),
            })
        }
    }

    spawnBoss(x = 400, y = 350, respawnDelay = 2000) {
        // If a boss exists, destroy it first
        if (this.boss) {
            const bossX = this.boss.x;
            const bossY = this.boss.y;

            // Increase kill count
            this.bossesKilled++
            this.bossKillText.setText(`Bosses: ${this.bossesKilled}`)

            // Destroy old boss & mechanics
            this.destroyAllMechanics();

            // Spawn EXP at old boss position
            (this.scene as any).spawnExp(bossX, bossY);

            // Respawn after delay
            this.scene.time.delayedCall(respawnDelay, () => {
                this.createBoss(x, y);
            });
        } else {
            this.createBoss(x, y);
        }
    }

    createBoss(x: number, y: number) {
        // Create boss
        const bossConfig = Bosses[1]
        this.boss = new Boss(this.scene, x, y, bossConfig);

        // Mechanics
        this.bossMechanics = bossConfig.mechanics.map(MechClass => new MechClass(this.scene, this.boss, this.player))

        // Apply boss buffs
        this.applyBuffToBoss()

        // Boss Health bar
        this.bossHealthBar = new HealthBar(this.scene, 150, 30, 500, 20, this.boss, 0xff0000)

        // Boss attack timer
        this.bossMechanicTimer = this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => this.triggerMechanics()
        })
    }

    triggerMechanics() {
        if (!this.boss) return

        //Only choose from mechanics that are not on cooldown and enabled
        const availableMechanics = this.bossMechanics.filter( m => 
            m.active && !m.isCasting && !m.isOnCooldown()
        )

        if (availableMechanics.length === 0) return
        
        const mechanic = Phaser.Utils.Array.GetRandom(availableMechanics)
        mechanic.trigger()

        //Animation sync
        this.boss.play("boss-attack")

        const castTime = mechanic.config.castTime || 0

        if (castTime > 0) {
            this.scene.time.delayedCall(castTime, () => {
                if (this.boss) this.boss.play("boss-idle")
            })
        } else {
            this.boss.play("boss-idle")
        }
    }

    destroyAllMechanics() {
        this.bossMechanicTimer?.remove(false);
        this.bossMechanicTimer = null;

        this.bossMechanics.forEach(m => m.destroy());
        this.bossMechanics = [];

        this.boss?.destroyBoss();
        this.boss = null;

        this.bossHealthBar?.destroy()
        this.bossHealthBar = null
    }
}
