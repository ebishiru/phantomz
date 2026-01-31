import Phaser from "phaser";
import Boss from "../entities/Boss";
import { Bosses } from "../data/bosses";
import BossMechanic from "../mechanics/BossMechanic";
import HealthBar from "../ui/HealthBar";
import CastBar from "../ui/CastBar";

export default class BossManager {
    scene: Phaser.Scene;
    player: any
    boss: Boss | null = null;
    bossHealthBar: HealthBar | null = null
    bossMechanics: BossMechanic[] = [];
    bossMechanicTimer: Phaser.Time.TimerEvent | null = null;
    castBar: CastBar | null = null
    mechanicNameText?: Phaser.GameObjects.Text

    // Buff system
    activeBuffs: string[] = [];
    baseBuffPool: string[] = ["HP", "HP", "HP", "CD", "CD", "CD"];
    buffPool: string[] = []
    baseBossHealth = 150
    nextBossMaxHealth = this.baseBossHealth

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

    getCenteredSquareCorners(scale = 0.6) {
        const bounds = this.scene.physics.world.bounds

        const size = Math.min(bounds.width, bounds.height) * scale
        const half = size / 2

        const centerX = bounds.centerX
        const centerY = bounds.centerY

        return [
            { x: centerX - half, y: centerY - half },
            { x: centerX + half, y: centerY - half },
            { x: centerX + half, y: centerY + half },
            { x: centerX - half, y: centerY + half }
        ]
    }

    moveToRandomCorner() {
        if (!this.boss) return

        const corners = this.getCenteredSquareCorners(0.6)
        const location = Phaser.Utils.Array.GetRandom(corners)

        this.scene.physics.moveTo(
            this.boss,
            location.x,
            location.y,
            300
        )
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
        this.nextBossMaxHealth = this.baseBossHealth + hpCount * 50

        // Giving Boss attacks lower delay
        const newDelay = Math.max(2000, 4000 - 200 * cdCount)

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
        // Random Boss
        const bossIndex = Phaser.Math.Between(0, 1)
        const bossConfig = Bosses[bossIndex]
        const spriteKey = bossConfig.spriteKey

        // Spawn Boss
        this.boss = new Boss(this.scene, x, y, bossConfig);

        //Create animations
        if (!this.scene.anims.exists(`${spriteKey}-idle`)) {
            this.scene.anims.create({
                key: `${spriteKey}-idle`,
                frames: [{ key: spriteKey, frame: 0}],
                frameRate: 1,
                repeat: -1
            })
        }

        if (!this.scene.anims.exists(`${spriteKey}-attack`)) {
            this.scene.anims.create({
                key: `${spriteKey}-attack`,
                frames: [{ key: spriteKey, frame: 1}],
                frameRate: 1,
                repeat: 0
            })
        }

        this.boss.play(`${spriteKey}-idle`)

        // Initialize Mechanics
        this.bossMechanics = bossConfig.mechanics.map(MechClass => new MechClass(this.scene, this.boss, this.player))

        // Apply boss buffs
        this.applyBuffToBoss()

        // Boss Health & Health bar
        this.boss.maxHealth = this.nextBossMaxHealth
        this.boss.health = this.nextBossMaxHealth
        this.bossHealthBar = new HealthBar(this.scene, 150, 30, 500, 20, this.boss, 0xff0000)

        // Boss attack timer
        this.bossMechanicTimer = this.scene.time.addEvent({
            delay: 4000,
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

        this.boss.isCasting = true

        // Activate mechanic
        mechanic.trigger()

        //Animation sync
        this.boss.play(`${this.boss.config.spriteKey}-attack`)

        // Display mechanic name
        this.displayMechanicName(mechanic)

        // Cast Bar if applicable
        if (mechanic.config.showCastBar && mechanic.config.castTime > 0) {
            this.showCastBar(mechanic.config.castTime)
        }

        const castTime = mechanic.config.castTime || 0

        if (castTime > 0) {
            this.scene.time.delayedCall(castTime, () => {
                if (this.boss) {
                    this.boss.isCasting = false
                    this.boss.play(`${this.boss.config.spriteKey}-idle`)
                }
            })
        } else {
            this.boss.isCasting = false
            this.boss.play(`${this.boss.config.spriteKey}-idle`)
        }
    }

    displayMechanicName(mechanic: any) {
        if (!mechanic?.config?.name || !this.bossHealthBar) return
        
        if (this.mechanicNameText) {
            this.mechanicNameText.destroy()
        }

        const x = this.bossHealthBar.x + this.bossHealthBar.width / 2
        const y = this.bossHealthBar.y + this.bossHealthBar.height + 12

        this.mechanicNameText = this.scene.add.text( x, y, mechanic.config.name, {
            fontSize: "20px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5, 0)
        .setAlpha(0)

        const duration = (mechanic.config.castTime || 0) + 1000

        this.scene.tweens.add({
            targets: this.mechanicNameText,
            alpha: 1,
            duration: 200,
            ease: "Linear",
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.mechanicNameText,
                    alpha: 0,
                    delay: duration - 200,
                    duration: 200,
                    ease: "Linear"
                })
            }
        })

        this.scene.time.delayedCall(duration, () => {
            this.mechanicNameText?.destroy()
            this.mechanicNameText = undefined
        })
    }

    showCastBar(castTime: number) {
        if (!this.boss) return

        this.castBar?.destroy()

        this.castBar = new CastBar(this.scene, this.boss.x, this.boss.y - 60)

        this.castBar.start(castTime)
    }

    destroyAllMechanics() {
        this.bossMechanicTimer?.remove(false);
        this.bossMechanicTimer = null;

        this.bossMechanics?.forEach(m => m.destroy());
        this.bossMechanics = [];

        this.boss?.destroyBoss();
        this.boss = null;

        this.bossHealthBar?.destroy()
        this.bossHealthBar = null

        this.castBar?.destroy()
        this.castBar = null;
    }
}
