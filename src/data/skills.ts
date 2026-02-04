import { upgrades } from "./upgrades";

export const skills = [
    {
        key: "slashSkill",
        name: "Slash",
        iconKey: "slash-icon",
        desc: "Attack in a frontal arc",
        upgrades: upgrades.slash
    },
    {
        key: "arrowSkill",
        name: "Arrow",
        iconKey: "arrow-icon",
        desc: "Fire a guaranteed missile",
        upgrades: upgrades.arrow
    },
    {
        key: "pulseSkill",
        name: "Pulse",
        iconKey: "pulse-icon",
        desc: "Unleash an energy pulse repeatedly",
        upgrades: upgrades.pulse
    },
    {
        key: "thrustSkill",
        name: "Thrust",
        iconKey: "thrust-icon",
        desc: "Propel and strike forward",
        upgrades: upgrades.thrust
    },
    {
        key: "caltropsSkill",
        name: "Caltrops",
        iconKey: "caltrops-icon",
        desc: "Drop spikes behind",
        upgrades: upgrades.caltrops
    },
    {
        key: "fireballSkill",
        name: "Fireball",
        iconKey: "fireball-icon",
        desc: "Cast down an explosion of flame",
        upgrades: upgrades.fireball
    },
    {
        key: "hookSkill",
        name: "Hook",
        iconKey: "hook-icon",
        desc: "Reel yourself to the boss' location",
        upgrades: upgrades.hook
    }
]