import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import Boss from "../entities/Boss";
import BossMechanic from "../mechanics/BossMechanic";
import HealthBar from "../ui/HealthBar";
import Player from "../entities/Player";
import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";

export default class BossManager {
    scene: Phaser.Scene;
    boss: Boss | null = null;
    bossHealthBar: HealthBar | null = null;
    player: Player;
    bossMechanics: BossMechanic[] = [];
    bossMechanicTimer: Phaser.Time.TimerEvent | null = null;
    bossesKilled = 0;

    // Buff system
    buffPool: string[] = ["INC_HP","INC_HP","INC_HP","LOW_ATK_CD","LOW_ATK_CD","LOW_ATK_CD"];
    activeBuffs: string[] = [];

    // Global timer UI
    globalTimerSeconds = 0;
    globalTimerText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;

        // Timer text
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

        // 30-second global buff timer
        this.scene.time.addEvent({
            delay: 30000,
            loop: true,
            callback: () => {
                if (this.buffPool.length === 0) return;
                const buff = Phaser.Utils.Array.RemoveRandomElement(this.buffPool) as unknown as string;
                this.activeBuffs.push(buff);
            }
        });
    }

    spawnBoss(x = 400, y = 350, respawnDelay = 2000) {
        // If a boss exists, destroy it first
        if (this.boss) {
            const bossX = this.boss.x;
            const bossY = this.boss.y;

            // Destroy old boss & mechanics
            this.destroyAllMechanics();

            // Spawn EXP at old boss position
            (this.scene as GameScene).spawnExp(bossX, bossY);

            this.bossesKilled++;

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
        this.boss = new Boss(this.scene, x, y, `BOSS ${this.bossesKilled}`);

        // Health bar
        this.bossHealthBar = new HealthBar(this.scene, 150, 30, 500, 20, this.boss, 0xff0000);

        // Assign boss to player skills
        this.player.slashSkill.boss = this.boss;
        this.player.arrowSkill.boss = this.boss;
        this.player.pulseSkill.boss = this.boss;

        // Mechanics
        this.bossMechanics = [
            new CircleTelegraphOnBoss(this.scene, this.boss, this.player),
            new CircleTelegraphOnPlayer(this.scene, this.boss, this.player),
            new LineTelegraphFromBoss(this.scene, this.boss, this.player)
        ];

        // Apply buffs
        const lowAtkCount = this.activeBuffs.filter(b => b === "LOW_ATK_CD").length;
        const hpCount = this.activeBuffs.filter(b => b === "INC_HP").length;
        this.boss.maxHealth += 50 * hpCount;
        this.boss.health = this.boss.maxHealth;

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

        this.bossHealthBar?.destroy();
        this.bossHealthBar = null;
    }
}
