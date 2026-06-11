import Skill from "../skills/Skill";

export const upgrades = {
    slash: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(300)
        },
    ],

    arrow: [
        {
            desc: "Damage +4",
            apply: (skill: Skill) => skill.buffDamage(4)
        },
        {
            desc: "Cooldown reduced by 400ms",
            apply: (skill: Skill) => skill.buffCooldown(400)
        }
    ],

    pulse: [
        {
            desc: "Damage +2",
            apply: (skill: Skill) => skill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        },
    ],

    thrust: [
        {
            desc: "Damage +6",
            apply: (skill: Skill) => skill.buffDamage(6)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(300)
        }
    ],

    caltrops: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        },
    ],

    fireball: [
        {
            desc: "Damage +8",
            apply: (skill: Skill) => skill.buffDamage(8)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
        },
    ],

    devour: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (skill: Skill) => skill.buffCooldown(500)
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
            desc: "Cooldown reduced by 400ms",
            apply: (skill: Skill) => skill.buffCooldown(400)
        }
    ],

    volt: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 400ms",
            apply: (skill: Skill) => skill.buffCooldown(400)
        }
    ],

    restoration: [
        {
            desc: "Heal + 3",
            apply: (skill: Skill) => skill.buffHeal(3)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(300)
        }
    ],

    ward: [
        {
            desc: "Shield duration + 250ms",
            apply: (skill: Skill) => skill.buffShieldDuration(250)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(300)
        }
    ],

    javelin: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        }
    ],

    gust: [
        {
            desc: "Damage +5",
            apply: (skill: Skill) => skill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(300)
        }
    ],

    zephyr: [
        {
            desc: "Damage +2",
            apply: (skill: Skill) => skill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 200ms",
            apply: (skill: Skill) => skill.buffCooldown(200)
        }
    ]
}