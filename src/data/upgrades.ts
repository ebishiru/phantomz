import Player from "../entities/Player";

export const upgrades = {
    slash: [
        {
            desc: "Damage x1.5",
            apply: (player: Player) => player.slashSkill.buffDamage(player.slashSkill.damage * 0.5)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.slashSkill.buffCooldown(player.slashSkill.cooldown * 0.25)
        },
        {
            desc: "+20 Range",
            apply: (player: Player) => player.slashSkill.buffRange(20)
        }
    ],

    arrow: [
        {
            desc: "Damage x1.5",
            apply: (player: Player) => player.arrowSkill.buffDamage(player.arrowSkill.damage * 0.5)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.arrowSkill.buffCooldown(player.arrowSkill.cooldown * 0.25)
        }
    ],

    pulse: [
        {
            desc: "Damage x1.25",
            apply: (player: Player) => player.pulseSkill.buffDamage(player.pulseSkill.damage * 0.25)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.pulseSkill.buffCooldown(player.pulseSkill.cooldown * 0.25)
        },
        {
            desc: "+15 Range",
            apply: (player: Player) => player.pulseSkill.buffRange(15)
        }
    ],

    thrust: [
        {
            desc: "Damage x1.5",
            apply: (player: Player) => player.thrustSkill.buffDamage(player.thrustSkill.damage * 0.5)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.thrustSkill.buffCooldown(player.thrustSkill.cooldown * 0.25)
        }
    ],

    caltrops: [
        {
            desc: "Damage x1.25",
            apply: (player: Player) => player.caltropsSkill.buffDamage(player.caltropsSkill.damage * 0.25)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.caltropsSkill.buffCooldown(player.caltropsSkill.cooldown * 0.25)
        },
        {
            desc: "+15 Range",
            apply: (player: Player) => player.caltropsSkill.buffRange(15)
        }
    ],

    fireball: [
        {
            desc: "Damage x1.25",
            apply: (player: Player) => player.fireballSkill.buffDamage(player.fireballSkill.damage * 0.25)
        },
        {
            desc: "Cooldown x0.75",
            apply: (player: Player) => player.fireballSkill.buffCooldown(player.fireballSkill.cooldown * 0.25)
        },
    ],
}