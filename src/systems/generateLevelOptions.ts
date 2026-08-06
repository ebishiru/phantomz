import Phaser from "phaser";
import SkillSystem from "./SkillSystem";
import { skills } from "../data/skills";
import SaveManager from "./SaveManager";
import { passives } from "../data/passives";
import { passiveUpgrades } from "../data/passiveUpgrades";

export function generateLevelOptions(skillSystem: SkillSystem) {
    const unlockedCount = skillSystem.skills.length
    const saveManager = new SaveManager()
    const options: {
        title: string
        desc: string
        iconKey: string
        type: string
        apply: () => void 
    }[] = []

    skills.forEach(skillData => {
        const existingSkill = skillSystem.skills.find(s => s.id === skillData.key)

        //Unlock options
        // only offer a new skill if unlock conditions (if any) are met
        const unlock = skillData.unlock
        let unlockMet = true

        if (unlock) {
            // if skill already permanently unlocked in save, allow
            if (saveManager.isSkillUnlocked(skillData.key)) {
                unlockMet = true
            } else if (unlock.type === "caveTotalScore") {
                unlockMet = saveManager.getTotalScore("cave") >= Number(unlock.value)
            } else if (unlock.type === "snowTotalScore") {
                unlockMet = saveManager.getTotalScore("snow") >= Number(unlock.value)
            } else if (unlock.type === "towerTotalScore") {
                unlockMet = saveManager.getTotalScore("tower") >= Number(unlock.value)
            } else if (unlock.type === "bossKills") {
                // unlock.value may be an object mapping boss keys to required counts
                const req = unlock.value
                if (typeof req === "string") {
                    try {
                        // attempt to parse stringified object
                        // e.g. "{ [boss10]: 5 }" is non-standard, so fall back to false
                        // Prefer proper object in data; here we try JSON parse as a last resort
                        const parsed = JSON.parse(req)
                        for (const bossKey in parsed) {
                            if (saveManager.getBossKills(bossKey) < Number(parsed[bossKey])) {
                                unlockMet = false
                                break
                            }
                        }
                    } catch (e) {
                        unlockMet = false
                    }
                } else if (typeof req === "object") {
                    for (const bossKey in req) {
                        if (saveManager.getBossKills(bossKey) < Number((req as any)[bossKey])) {
                            unlockMet = false
                            break
                        }
                    }
                } else {
                    unlockMet = false
                }
            }
        }

        if (!existingSkill && unlockedCount < 4 && unlockMet) {
            options.push({
                title: `LEARN SKILL: ${skillData.name}`,
                desc: skillData.desc,
                iconKey: skillData.iconKey,
                type: "newSkill",
                apply: () => { skillSystem.unlockSkill(skillData.key)}
            })
        }

        //Upgrade options
        else if (existingSkill) {

            const upgrade = Phaser.Utils.Array.GetRandom(skillData.upgrades)

            options.push({
                title: `ENHANCE SKILL: ${skillData.name}`,
                desc: upgrade.desc,
                iconKey: skillData.iconKey,
                type: "skillUpgrade",
                apply: () => {
                    existingSkill.level += 1
                    upgrade.apply(existingSkill)
                }
            })
        }
    })

    passives.forEach(passive => {

        const owned = skillSystem.passives.find(p => p.key === passive.key)

        // only offer a new passive if its unlock conditions (if any) are met
        const unlock = (passive as any).unlock
        let unlockMet = true

        if (unlock) {
            if (unlock.type === "caveTotalScore") {
                unlockMet = saveManager.getTotalScore("cave") >= Number(unlock.value)
            } else if (unlock.type === "snowTotalScore") {
                unlockMet = saveManager.getTotalScore("snow") >= Number(unlock.value)
            } else if (unlock.type === "towerTotalScore") {
                unlockMet = saveManager.getTotalScore("tower") >= Number(unlock.value)
            } else if (unlock.type === "bossKills") {
                const req = unlock.value
                if (typeof req === "object") {
                    for (const bossKey in req) {
                        if (saveManager.getBossKills(bossKey) < Number((req as any)[bossKey])) {
                            unlockMet = false
                            break
                        }
                    }
                } else {
                    unlockMet = false
                }
            }
        }

        // Unlock new passive
        if (!owned && skillSystem.passives.length < 4 && unlockMet) {

            options.push({
                title: `GET PASSIVE: ${passive.name}`,
                desc: passive.desc,
                iconKey: passive.iconKey,
                type: "newPassive",
                apply: () => {
                    skillSystem.addPassive(passive.key)
                }
            })
        }

        // Upgrade passive
        else if (owned && owned.level < passive.maxLevel) {

            const upgrade = passiveUpgrades[passive.key as keyof typeof passiveUpgrades]

            options.push({
                title: `UPGRADE PASSIVE: ${passive.name}`,
                desc: upgrade?.desc ?? passive.desc,
                iconKey: passive.iconKey,
                type: "passiveUpgrade",
                apply: () => {
                    owned.level += 1
                    passive.apply(skillSystem.player)
                }
            })
        }

    })

    const finalOptions = Phaser.Utils.Array.Shuffle(options).slice(0, 3);

    //Add skip for option 4
    finalOptions.push({
        title: "Skip",
        desc: "Gain no upgrades this level.",
        iconKey: "skip-icon",
        type: "none",
        apply: () => {}
    })

    return finalOptions
}