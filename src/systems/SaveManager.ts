import { skills } from "../data/skills"
import { passives } from "../data/passives"

const SAVE_KEY = "phantomz_save_data"

export default class SaveManager {
    data: {
        caveHighscore: number,
        caveTotalScore: number,
        snowHighscore: number,
        snowTotalScore: number,
        towerHighscore: number,
        towerTotalScore: number,
        bossKills: { [key: string]: number },
        unlockedSkills: string[]
    }

    constructor() {
        this.data = this.load()
    }

    private getDefaultData() {
        return {
            caveHighscore: 0,
            caveTotalScore: 0,
            snowHighscore: 0,
            snowTotalScore: 0,
            towerHighscore: 0,
            towerTotalScore: 0,
            bossKills: {},
            unlockedSkills: []
        }
    }

    load() {
        const raw = localStorage.getItem(SAVE_KEY)

        if (!raw) {
            return this.getDefaultData()
        }

        return JSON.parse(raw)
    }

    save() {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.data))
    }

    //SCORE MANAGEMENT:

    getHiScore(level?: string): number {
        if (level === "snow") {
            return Number(this.data.snowHighscore || 0)
        }
        if (level === "tower") {
            return Number(this.data.towerHighscore || 0)
        }
        return Number(this.data.caveHighscore || 0)
    }

    getTotalScore(level?: string): number {
        if (level === "snow") {
            return Number(this.data.snowTotalScore || 0)
        }
        if (level === "tower") {
            return Number(this.data.towerTotalScore || 0)
        }
        return Number(this.data.caveTotalScore || 0)
    }

    updateScore(score: number, level?: string) {
        const currentHiScore = this.getHiScore(level)
        if (score > currentHiScore) {
            if (level === "snow") {
                this.data.snowHighscore = score
            } else if (level === "tower") {
                this.data.towerHighscore = score
            } else {
                this.data.caveHighscore = score
            }
        }

        if (level === "snow") {
            this.data.snowTotalScore += score
        } else if (level === "tower") {
            this.data.towerTotalScore += score
        } else {
            this.data.caveTotalScore += score
        }

        this.save()
    }

    //BOSS DATA MANAGEMENT:

    addBossKill(bossKey: string, count: number) {
        if (!this.data.bossKills[bossKey]) {
            this.data.bossKills[bossKey] = 0
        }

        this.data.bossKills[bossKey] += count
        this.save()
    }

    getBossKills(bossKey: string): number {
        return this.data.bossKills[bossKey] || 0
    }

    //SKILLS DATA MANAGEMENT:

    unlockSkill(skillKey: string) {
        if (!this.data.unlockedSkills.includes(skillKey)) {
            this.data.unlockedSkills.push(skillKey)
            this.save()
        }
    }

    isSkillUnlocked(skillKey: string): boolean {
        return this.data.unlockedSkills.includes(skillKey)
    }

    //DATA RESET:
    reset() {
        localStorage.removeItem(SAVE_KEY)
        this.data = this.getDefaultData()
    }

    //REVEAL NEW UNLOCKS:
    revealNewUnlocks(): string[] {
        const newlyUnlocked: string[] = []
        const unlockables = [...skills, ...passives]

        for (const item of unlockables) {
            //No unlock condition
            if (!item.unlock) {
                continue
            }

            //Already unlocked skill or passive
            if (this.isSkillUnlocked(item.key)) {
                continue
            }

            let unlocked = false

            switch (item.unlock.type) {

                case "caveTotalScore":
                    unlocked = 
                        this.getTotalScore("cave") >= (item.unlock.value as number)
                    break

                case "snowTotalScore":
                    unlocked =
                        this.getTotalScore("snow") >= (item.unlock.value as number)
                    break
                
                case "towerTotalScore":
                    unlocked =
                        this.getTotalScore("tower") >= (item.unlock.value as number)
                    break

                case "bossKills":
                    unlocked = Object.entries(item.unlock.value).every(
                        ([bossKey, requiredKills]) =>
                            this.getBossKills(bossKey) >= requiredKills
                    )
                    break
            }

            if (unlocked) {
                this.data.unlockedSkills.push(item.key)
                newlyUnlocked.push(item.key)
            }

        }

        if (newlyUnlocked.length > 0) {
            this.save()
        }

        return newlyUnlocked
    }
}