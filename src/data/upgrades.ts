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
        {
            desc: "+15 Range",
            apply: (skill: Skill) => skill.buffRange(15)
        }
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
        {
            desc: "Range increased by 10%",
            apply: (skill: Skill) => skill.buffRange(skill.range * 0.1)
        }
    ],

    thrust: [
        {
            desc: "Damage +6",
            apply: (skill: Skill) => skill.buffDamage(6)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (skill: Skill) => skill.buffCooldown(400)
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
        {
            desc: "+15 Range",
            apply: (skill: Skill) => skill.buffRange(15)
        }
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
}