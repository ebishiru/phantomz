
export const passives = [
    {
        key: "vitality",
        name: "Vitality",
        iconKey: "",
        desc: "Permanently increase your health pool by 30.",
        apply: (player) => {
            player.maxHP += 30
            player.health += 30
        }
    },
    {
        key: "strength",
        name: "Strength",
        iconKey: "",
        desc: "Deal an extra +2 damage to all skills.",
        apply: () => {}
    },
    {
        key: "swiftness",
        name: "Swiftness",
        iconKey: "",
        desc: "Move quicker 25% faster.",
        apply: () => {}
    },
    {
        key: "amplifier",
        name: "Amplifier",
        iconKey: "",
        desc: "Increase the size of all aoe skills by 10%.",
        apply: () => {}
    },
    {
        key: "haste",
        name: "Haste",
        iconKey: "",
        desc: "Decrease the cooldown of all skills by 5%.",
        apply: () => {}
    },
    {
        key: "executioner",
        name: "Executioner",
        iconKey: "",
        desc: "Increase damage by 25% when Boss is lower than 25% HP.",
        apply: () => {}
    },
    {
        key: "fortify",
        name: "Fortify",
        iconKey: "",
        desc: "Reduce all damage taken by 2.",
        apply: () => {}
    },
    {
        key: "echo",
        name: "Echo",
        iconKey: "",
        desc: "Skills have a 2.5% chance of triggering twice.",
        apply: () => {}
    }
]