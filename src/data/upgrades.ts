import Skill from "../skills/Skill";

export const upgrades = {
    slash: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 600ms",
            apply: (skill: Skill) => skill.buffCooldown(600)
        },
    ],

    arrow: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 750ms",
            apply: (skill: Skill) => skill.buffCooldown(750)
        }
    ],

    pulse: [
        {
            desc: "Damage +2",
            apply: (skill: Skill) => skill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 900ms",
            apply: (skill: Skill) => skill.buffCooldown(900)
        },
    ],

    thrust: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        }
    ],

    caltrops: [
        {
            desc: "Damage +3",
            apply: (skill: Skill) => skill.buffDamage(3)
        },
        {
            desc: "Cooldown reduced by 700ms",
            apply: (skill: Skill) => skill.buffCooldown(700)
        },
    ],

    fireball: [
        {
            desc: "Damage +12",
            apply: (skill: Skill) => skill.buffDamage(12)
        },
        {
            desc: "Cooldown reduced by 1000ms",
            apply: (skill: Skill) => skill.buffCooldown(1000)
        },
    ],

    devour: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 900ms",
            apply: (skill: Skill) => skill.buffCooldown(900)
        },
        {
            desc: "Heal +2",
            apply: (skill: Skill) => skill.buffHeal(2)
        },
    ],

    hook: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 700ms",
            apply: (skill: Skill) => skill.buffCooldown(700)
        }
    ],

    volt: [
        {
            desc: "Damage +8",
            apply: (skill: Skill) => skill.buffDamage(8)
        },
        {
            desc: "Cooldown reduced by 900ms",
            apply: (skill: Skill) => skill.buffCooldown(900)
        }
    ],

    restoration: [
        {
            desc: "Heal + 2",
            apply: (skill: Skill) => skill.buffHeal(2)
        },
        {
            desc: "Cooldown reduced by 700ms",
            apply: (skill: Skill) => skill.buffCooldown(700)
        }
    ],

    ward: [
        {
            desc: "Shield duration + 250ms",
            apply: (skill: Skill) => skill.buffShieldDuration(250)
        },
        {
            desc: "Cooldown reduced by 1500ms",
            apply: (skill: Skill) => skill.buffCooldown(1500)
        }
    ],

    javelin: [
        {
            desc: "Damage +3",
            apply: (skill: Skill) => skill.buffDamage(3)
        }
    ],

    gust: [
        {
            desc: "Damage +4",
            apply: (skill: Skill) => skill.buffDamage(4)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        }
    ],

    zephyr: [
        {
            desc: "Damage +2",
            apply: (skill: Skill) => skill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        }
    ],

    mirage: [
        {
            desc: "Damage +9",
            apply: (skill: Skill) => skill.buffDamage(9)
        },
        {
            desc: "Cooldown reduced by 900ms",
            apply: (skill: Skill) => skill.buffCooldown(900)
        }
    ],

    quasar: [
        {
            desc: "Damage +10",
            apply: (skill: Skill) => skill.buffDamage(10)
        },
        {
            desc: "Cooldown reduced by 1000ms",
            apply: (skill: Skill) => skill.buffCooldown(1000)
        }
    ],

    yoyo: [
        {
            desc: "Damage + 3",
            apply: (skill: Skill) => skill.buffDamage(3)
        },
        {
            desc: "Cooldown reduced by 600ms",
            apply: (skill: Skill) => skill.buffCooldown(600)
        }
    ],

    blitzkrieg: [
        {
            desc: "Damage + 3",
            apply: (skill: Skill) => skill.buffDamage(3)
        },
        {
            desc: "Cooldown reduced by 700ms",
            apply: (skill: Skill) => skill.buffCooldown(700)
        }
    ],

    kraken: [
        {
            desc: "Damage + 15",
            apply: (skill: Skill) => skill.buffDamage(15)
        },
        {
            desc: "Cooldown reduced by 1200ms",
            apply: (skill: Skill) => skill.buffCooldown(1200)
        }
    ],

    nexus: [
        {
            desc: "Damage + 2",
            apply: (skill: Skill) => skill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 1000ms",
            apply: (skill: Skill) => skill.buffCooldown(1000)
        }
    ],
}