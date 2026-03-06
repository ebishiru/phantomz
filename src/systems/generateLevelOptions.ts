import Phaser from "phaser";
import SkillSystem from "./SkillSystem";
import { skills } from "../data/skills";
import { passives } from "../data/passives";
import { passiveUpgrades } from "../data/passiveUpgrades";

export function generateLevelOptions(skillSystem: SkillSystem) {
    const player = skillSystem.player
    const unlockedCount = skillSystem.skills.length
    const options: {
        title: string
        desc: string
        iconKey: string
        apply: () => void 
    }[] = []

    skills.forEach(skillData => {
        const existingSkill = skillSystem.skills.find(s => s.id === skillData.key)

        //Unlock options
        if (!existingSkill && unlockedCount < 4) {
            options.push({
                title: `LEARN SKILL: ${skillData.name}`,
                desc: skillData.desc,
                iconKey: skillData.iconKey,
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
                apply: () => {
                    upgrade.apply(existingSkill)
                }
            })
        }
    })

    passives.forEach(passive => {

        const owned = skillSystem.passives.find(p => p.key === passive.key)

        // Unlock new passive
        if (!owned && skillSystem.passives.length < 4) {

            options.push({
                title: `GET PASSIVE: ${passive.name}`,
                desc: passive.desc,
                iconKey: passive.iconKey,
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
        desc: "Gain no upgrades this level",
        iconKey: "skip-icon",
        apply: () => {}
    })

    return finalOptions
}