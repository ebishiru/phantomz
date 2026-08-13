import Phaser from "phaser";
import Boss from "../entities/Boss";
import { Bosses } from "../data/bosses";
import BossMechanic from "../mechanics/BossMechanic";
import HealthBar from "../ui/HealthBar";
import CastBar from "../ui/CastBar";
import ExpSystem from "../systems/ExpSystem";

export default class BossManager {
    scene: Phaser.Scene;
    player: any
    boss: Boss | null = null;
    currentLevel: string = "cave"
    bossHealthBar: HealthBar | null = null
    bossMechanics: BossMechanic[] = [];
    bossMechanicTimer: Phaser.Time.TimerEvent | null = null;
    castBar: CastBar | null = null
    mechanicNameText?: Phaser.GameObjects.Text
    expSystem: ExpSystem

    // Buff system
    activeBuffs: string[] = [];
    baseBuffPool: string[] = ["HP", "HP", "HP", "CD", "CD", "CD"];
    buffPool: string[] = []
    baseBossHealth = 150
    nextBossMaxHealth = this.baseBossHealth

    // Global timer UI
    globalTimerSeconds = 0;
    globalTimerText!: Phaser.GameObjects.Text;
    halfTimeTriggered: boolean = false;
    timeOverTriggered: boolean = false;

    // Gourmet Bread Passive
    gourmetBreads: Phaser.Physics.Arcade.Image[] = [];
    gourmetPickupRadius = 24;

    // Boss Progression
    currentMaxBossIndex = 0
    lastBossIndex: number | null = null

    // Kill Count
    bossesKilled = 0
    bossKillsThisRun: { [key: string]: number } = {}
    extraExpPerBoss = 0
    bossKillText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, player: any, expSystem: ExpSystem, level: string = "cave") {
        this.scene = scene;
        this.player = player;
        this.expSystem = expSystem;
        this.currentLevel = level;

        this.resetBuffPool();
        this.startBuffTimer();
        this.createTimerText();
        this.createBossKillText();
        this.scene.events.on("update", this.updateGourmetBread, this);
    }

    resetBuffPool() {
        this.buffPool = [...this.baseBuffPool]
    }

    createTimerText() {
        this.globalTimerText = this.scene.add.text(850, 70, "Time: 00:00", { 
            fontSize: "16px", 
            fontFamily: `"Old English Text MT", Georgia, serif`, 
            color: "#ffffff" 
        });

        // 1-second timer to update UI
        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.timeOverTriggered) return;

                this.globalTimerSeconds++;
                const min = Math.floor(this.globalTimerSeconds / 60).toString().padStart(2, "0");
                const sec = (this.globalTimerSeconds % 60).toString().padStart(2, "0");
                this.globalTimerText.setText(`Time: ${min}:${sec}`);

                // Introduce harder bosses every minute
                this.currentMaxBossIndex = Math.min(Bosses.length - 1, Math.floor(this.globalTimerSeconds / 60))

                if (this.globalTimerSeconds > 0 && this.globalTimerSeconds % 60 === 0) {
                    this.spawnGourmetBread()
                }

                // Update Revive disable past 10 minutes
                if (this.globalTimerSeconds >= 600 && !this.halfTimeTriggered) {
                    this.halfTimeTriggered = true
                    this.scene.registry.set("halfTime", true)
                }

                // Trigger Game Over at 20 minutes (1200 seconds)
                if (this.globalTimerSeconds >= 1200 && !this.timeOverTriggered) {
                    this.timeOverTriggered = true
                    const score = this.globalTimerSeconds + this.bossesKilled * 60
                    // Pause the main game and launch the Game Over scene with a 'time' reason
                    this.scene.scene.pause("game")
                    this.scene.scene.launch("game-over", {
                        score,
                        bossesKilled: this.bossesKilled,
                        bossKills: this.bossKillsThisRun,
                        level: this.currentLevel,
                        reason: "time",
                    })
                }
            }
        });

        //healing passive +1 every 10seconds
        this.scene.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => {
                if (this.player && this.player.health < this.player.maxHealth) {
                    this.player.health += 1
                }
            }
        })
    }

    spawnGourmetBread() {
        const gourmetLevel = this.player?.statModifiers?.gourmetLevel ?? 0
        if (gourmetLevel < 1) return

        const bounds = this.scene.physics.world.bounds
        const spawnX = Phaser.Math.Between(bounds.left + 40, bounds.right - 40)
        const spawnY = Phaser.Math.Between(bounds.top + 40, bounds.bottom - 40)

        const bread = this.scene.physics.add.image(spawnX, spawnY, "gourmet-vfx")
        bread.setScale(2)
        bread.setDepth(8)
        bread.setData("healAmount", 20 + (gourmetLevel - 1) * 10)
        bread.setData("gourmetLevel", gourmetLevel)

        this.gourmetBreads.push(bread)
    }

    updateGourmetBread() {
        this.gourmetBreads = this.gourmetBreads.filter(bread => {
            if (!bread.active) return false

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                bread.x,
                bread.y
            )

            if (distance < this.gourmetPickupRadius) {
                const healAmount = bread.getData("healAmount") as number
                this.player.heal(healAmount)
                bread.destroy()
                return false
            }

            return true
        })
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
        this.bossKillText = this.scene.add.text(850, 100, "Bosses: 0", {
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
        this.nextBossMaxHealth = this.baseBossHealth + hpCount * 25

        // Giving Boss attacks lower delay
        const newDelay = Math.max(3000, 4500 - 150 * cdCount)

        if (this.bossMechanicTimer) {
            this.bossMechanicTimer.remove(false)
            this.bossMechanicTimer = this.scene.time.addEvent({
                delay: newDelay,
                loop: true,
                callback: () => this.triggerMechanics(),
            })
        }
    }

    spawnBoss(x = 480, y = 220, respawnDelay = 2000) {
        // If a boss exists, destroy it first
        if (this.boss) {
            const bossX = this.boss.x;
            const bossY = this.boss.y;

            // Increase kill count
            this.bossesKilled++
            this.bossKillText.setText(`Bosses: ${this.bossesKilled}`)

            // Track boss kills for this run
            const bossKey = this.boss.config.spriteKey

            if (!this.bossKillsThisRun[bossKey]) {
                this.bossKillsThisRun[bossKey] = 0
            }

            this.bossKillsThisRun[bossKey] += 1

            // Destroy old boss & mechanics
            this.destroyAllMechanics();

            // Increase bonus exp per 5 bosses killed
            if (this.bossesKilled % 5 === 0) {
                this.extraExpPerBoss++
            }

            // Spawn EXP at old boss position
            const isMilestone = this.bossesKilled > 0 && this.bossesKilled % 10 === 0

            const baseExp = isMilestone ? 45 : 15
            const orbCount: number = baseExp + this.extraExpPerBoss;

            this.expSystem.spawn(bossX, bossY, orbCount);

            // Respawn after delay
            this.scene.time.delayedCall(respawnDelay, () => {
                this.createBoss(x, y);
            });
        } else {
            this.createBoss(x, y);
        }
    }

    createBoss(x: number, y: number) {
        // Filter bosses by current level
        const levelBosses = Bosses.filter(b => b.level === this.currentLevel)
        
        // Randomize Bosses with No Repeats
        const maxIndex = Math.min(this.currentMaxBossIndex, levelBosses.length - 1)
        const minIndex = Math.max(0, maxIndex - 4)

        let bossIndex: number

        if (minIndex === maxIndex) {
            bossIndex = maxIndex
        } else {
            do {
                bossIndex = Phaser.Math.Between(minIndex, maxIndex)
            } while (bossIndex === this.lastBossIndex)
        }

        this.lastBossIndex = bossIndex

        const bossConfig = levelBosses[bossIndex]
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
        this.bossHealthBar = new HealthBar(this.scene, 155, 10, 300, 15, this.boss, 0xff0000)

        // Boss attack timer
        this.bossMechanicTimer = this.scene.time.addEvent({
            delay: 4500,
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

        const castDuration = mechanic.config.castDuration ?? mechanic.config.castTime ?? 0

        if (castDuration > 0) {
            this.scene.time.delayedCall(castDuration, () => {
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

        const x = 680
        const y = 35

        this.mechanicNameText = this.scene.add.text( x, y, mechanic.config.name, {
            fontSize: "32px",
            fontFamily: `"Old English Text MT", Georgia, serif`,
            color: "#ffcc00",
        }).setOrigin(0.5)
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
        if (this.boss) {
            this.scene.tweens.killTweensOf(this.boss)
        }

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
