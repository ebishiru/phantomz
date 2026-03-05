
export const passives = [
    {
        key: "vitality",
        name: "Vitality",
        iconKey: "",
        desc: "Permanently increase your health pool by 30.",
        maxLevel: 5,
        apply: (player: any) => {
            player.maxHP += 30
            player.health += 30
        }
    },
    {
        key: "strength",
        name: "Strength",
        iconKey: "",
        desc: "Deal an extra +2 damage to all skills.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.flatDamage += 2
        }
    },
    {
        key: "swiftness",
        name: "Swiftness",
        iconKey: "",
        desc: "Move quicker 15% faster.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.speedMultiplier += 0.15
        }
    },
    {
        key: "amplifier",
        name: "Amplifier",
        iconKey: "",
        desc: "Increase the size of all aoe skills by 15%.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.aoeMultiplier += 0.15
        }
    },
    {
        key: "haste",
        name: "Haste",
        iconKey: "",
        desc: "Decrease the cooldown of all skills by 10%.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.cooldownMultiplier *= 0.9
        }
    },
    {
        key: "executioner",
        name: "Executioner",
        iconKey: "",
        desc: "Increase damage by 25% when Boss is lower than 25% HP.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.executionerLevel += 1
        }
    },
    {
        key: "fortify",
        name: "Fortify",
        iconKey: "",
        desc: "Reduce all damage taken by 1.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.damageReductionFlat += 1
        }
    },
    {
        key: "echo",
        name: "Echo",
        iconKey: "",
        desc: "Skills have a 5% chance of triggering twice.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.echoChance += 0.05
        }
    }
]