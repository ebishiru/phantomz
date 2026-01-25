import Player from "../entities/Player";

export const upgrades = {
    slash: [
        {
            desc: "+10 Damage",
            apply: (player: Player) => player.slashSkill.buffDamage(10)
        },
        {
            desc: "-0.25s Cooldown",
            apply: (player: Player) => player.slashSkill.buffCooldown(250)
        },
        {
            desc: "+10 Range",
            apply: (player: Player) => player.slashSkill.buffRange(10)
        }
    ],

    arrow: [
        {
            desc: "+10 Damage",
            apply: (player: Player) => player.arrowSkill.buffDamage(10)
        },
        {
            desc: "-0.25s Cooldown",
            apply: (player: Player) => player.arrowSkill.buffCooldown(250)
        }
    ],

    pulse: [
        {
            desc: "+5 Damage",
            apply: (player: Player) => player.pulseSkill.buffDamage(5)
        },
        {
            desc: "-0.25s Cooldown",
            apply: (player: Player) => player.pulseSkill.buffCooldown(250)
        },
        {
            desc: "+5 Range",
            apply: (player: Player) => player.pulseSkill.buffRange(5)
        }
    ],
}