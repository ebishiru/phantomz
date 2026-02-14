import Player from "../entities/Player";

export const upgrades = {
    slash: [
        {
            desc: "Damage +5",
            apply: (player: Player) => player.slashSkill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (player: Player) => player.slashSkill.buffCooldown(300)
        },
        {
            desc: "+15 Range",
            apply: (player: Player) => player.slashSkill.buffRange(15)
        }
    ],

    arrow: [
        {
            desc: "Damage +4",
            apply: (player: Player) => player.arrowSkill.buffDamage(4)
        },
        {
            desc: "Cooldown reduced by 400ms",
            apply: (player: Player) => player.arrowSkill.buffCooldown(400)
        }
    ],

    pulse: [
        {
            desc: "Damage +2",
            apply: (player: Player) => player.pulseSkill.buffDamage(2)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (player: Player) => player.pulseSkill.buffCooldown(500)
        },
        {
            desc: "Range increased by 10%",
            apply: (player: Player) => player.pulseSkill.buffRange(player.pulseSkill.range * 0.1)
        }
    ],

    thrust: [
        {
            desc: "Damage +6",
            apply: (player: Player) => player.thrustSkill.buffDamage(6)
        },
        {
            desc: "Cooldown reduced by 300ms",
            apply: (player: Player) => player.thrustSkill.buffCooldown(400)
        }
    ],

    caltrops: [
        {
            desc: "Damage +5",
            apply: (player: Player) => player.caltropsSkill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (player: Player) => player.caltropsSkill.buffCooldown(500)
        },
        {
            desc: "+15 Range",
            apply: (player: Player) => player.caltropsSkill.buffRange(15)
        }
    ],

    fireball: [
        {
            desc: "Damage +8",
            apply: (player: Player) => player.fireballSkill.buffDamage(8)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (player: Player) => player.fireballSkill.buffCooldown(500)
        },
    ],

    devour: [
        {
            desc: "Damage +5",
            apply: (player: Player) => player.devourSkill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 500ms",
            apply: (player: Player) => player.devourSkill.buffCooldown(500)
        },
        {
            desc: "Heal +2",
            apply: (player: Player) => player.devourSkill.buffHeal(player.devourSkill.healingValue + 2)
        },
    ],

    hook: [
        {
            desc: "Damage +5",
            apply: (player: Player) => player.hookSkill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 400ms",
            apply: (player: Player) => player.hookSkill.buffCooldown(400)
        }
    ],

    volt: [
        {
            desc: "Damage +5",
            apply: (player: Player) => player.voltSkill.buffDamage(5)
        },
        {
            desc: "Cooldown reduced by 400ms",
            apply: (player: Player) => player.voltSkill.buffCooldown(400)
        }
    ],
}