import Phaser from "phaser";
import Player from "../entities/Player";
import { skills } from "../data/skills";

export function generateLevelOptions(player: Player) {
    const unlockedCount = player.skills.length
    const options: {
        title: string
        desc: string
        iconKey: string
        apply: () => void 
    }[] = []

    skills.forEach(skill => {
        const skillObj = (player as any)[skill.key]
        if (!skillObj) return

        //Unlock options
        if (!skillObj.enabled && unlockedCount < 4) {
            options.push({
                title: `${skill.name} Unlock`,
                desc: skill.desc,
                iconKey: skill.iconKey,
                apply: () => { player.unlockSkill(skillObj)}
            })
        }

        //Upgrade options
        else if (skillObj.enabled) {
            const upgrade = skill.upgrades[Math.floor(Math.random() * skill.upgrades.length)]

            options.push({
                title: `${skill.name} Upgrade`,
                desc: upgrade.desc,
                iconKey: skill.iconKey,
                apply: () => upgrade.apply(player)
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