
export const passives = [
    {
        key: "vitality",
        name: "Vitality",
        iconKey: "vitality-icon",
        desc: "Permanently increase your health pool by 30.",
        maxLevel: 5,
        apply: (player: any) => {
            player.maxHealth += 30
            player.health += 30 * 0.5
        }
    },
    {
        key: "strength",
        name: "Power",
        iconKey: "strength-icon",
        desc: "Deal an extra +2 damage to all skills.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.flatDamage += 2
        }
    },
    {
        key: "swiftness",
        name: "Swiftness",
        iconKey: "swiftness-icon",
        desc: "Move 15% faster.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.speedMultiplier += 0.15
        }
    },
    {
        key: "amplifier",
        name: "Amplifier",
        iconKey: "amplifier-icon",
        desc: "Increase the size of all aoe skills by 15%.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.aoeMultiplier += 0.15
        }
    },
    {
        key: "haste",
        name: "Haste",
        iconKey: "haste-icon",
        desc: "Decrease the cooldown of all skills by 10%.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.cooldownMultiplier *= 0.9
        }
    },
    {
        key: "executioner",
        name: "Executioner",
        iconKey: "executioner-icon",
        desc: "Deal 25% more dmg when Boss is under 25% HP.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.executionerLevel += 1
        },
        unlock: {
            type: "caveTotalScore",
            value: 5000,
            text: "Score 5000 pts in cave.",
        }
    },
    {
        key: "fortify",
        name: "Fortify",
        iconKey: "fortify-icon",
        desc: "Reduce all damage taken by 2.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.damageReductionFlat += 2
        },
        unlock: {
            type: "snowTotalScore",
            value: 3000,
            text: "Score 3000 pts in snow.",
        }
    },
    {
        key: "echo",
        name: "Lucky",
        iconKey: "echo-icon",
        desc: "Skills have a 5% chance to deal double damage.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.echoChance += 0.05
        },
        unlock: {
            type: "bossKills",
            value: { boss20: 1 },
            text: "Defeat Undying Knight. (snow)",
        }
    },
    {
        key: "gourmet",
        name: "Gourmet",
        iconKey: "gourmet-icon",
        desc: "Spawns a bread every minute that heals 20 HP.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.gourmetLevel += 1
        },
        unlock: {
            type: "towerTotalScore",
            value: 3000,
            text: "Score 3000 pts in tower.",
        }
    },
    {
        key: "desperation",
        name: "Desperation",
        iconKey: "desperation-icon",
        desc: "Gain 50% damage and 20% speed at critical HP.",
        maxLevel: 5,
        apply: (player: any) => {
            player.statModifiers.desperationLevel += 1
        },
        unlock: {
            type: "bossKills",
            value: { boss30: 1 },
            text: "Defeat Arisen Knight. (tower)",
        }
    }
]