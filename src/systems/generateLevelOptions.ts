import Phaser from "phaser";
import SkillSystem from "./SkillSystem";
import { skills } from "../data/skills";

export function generateLevelOptions(skillSystem: SkillSystem) {
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
                title: `${skillData.name} Unlock`,
                desc: skillData.desc,
                iconKey: skillData.iconKey,
                apply: () => { skillSystem.unlockSkill(skillData.key)}
            })
        }

        //Upgrade options
        else if (existingSkill) {

            const upgrade = Phaser.Utils.Array.GetRandom(skillData.upgrades)

            options.push({
                title: `${skillData.name} Upgrade`,
                desc: upgrade.desc,
                iconKey: skillData.iconKey,
                apply: () => {
                    upgrade.apply(existingSkill)
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