import { upgrades } from "./upgrades";

export const skills = [
    {
        key: "slash",
        name: "Slash",
        iconKey: "slash-icon",
        desc: "Attack in a frontal arc",
        upgrades: upgrades.slash
    },
    {
        key: "arrow",
        name: "Arrow",
        iconKey: "arrow-icon",
        desc: "Fire a guaranteed missile",
        upgrades: upgrades.arrow
    },
    {
        key: "pulse",
        name: "Pulse",
        iconKey: "pulse-icon",
        desc: "Unleash an energy pulse repeatedly",
        upgrades: upgrades.pulse
    },
    {
        key: "thrust",
        name: "Thrust",
        iconKey: "thrust-icon",
        desc: "Propel and strike forward",
        upgrades: upgrades.thrust
    },
    {
        key: "caltrops",
        name: "Caltrops",
        iconKey: "caltrops-icon",
        desc: "Drop spikes behind",
        upgrades: upgrades.caltrops
    },
    {
        key: "fireball",
        name: "Fireball",
        iconKey: "fireball-icon",
        desc: "Cast down an explosion of flame",
        upgrades: upgrades.fireball
    },
    {
        key: "devour",
        name: "Devour",
        iconKey: "devour-icon",
        desc: "Chew on the flesh of your enemy",
        upgrades: upgrades.devour
    },
    {
        key: "hook",
        name: "Hook",
        iconKey: "hook-icon",
        desc: "Reel yourself to the boss' location",
        upgrades: upgrades.hook
    },
    {
        key: "volt",
        name: "Volt",
        iconKey: "volt-icon",
        desc: "Supercharge yourself and exhaust after",
        upgrades: upgrades.volt
    },
    {
        key: "restoration",
        name: "Restoration",
        iconKey: "restoration-icon",
        desc: "Fix your wounds and restore health",
        upgrades: upgrades.restoration,
        unlock: {
            type: "caveTotalScore",
            value: 3000,
            text: "Score 3000 pts in cave.",
        }
    },
    {
        key: "ward",
        name: "Ward",
        iconKey: "ward-icon",
        desc: "Create a temporary shield that blocks all damage",
        upgrades: upgrades.ward,
        unlock: {
            type: "snowTotalScore",
            value: 3000,
            text: "Score 3000 pts in snow.",
        }
    },
    {
        key: "javelin",
        name: "Javelin",
        iconKey: "javelin-icon",
        desc: "Throw a javelin that can be picked up again",
        upgrades: upgrades.javelin,
        unlock: {
            type: "bossKills",
            value: { boss10: 5 },
            text: "Defeat Pure Knight 5 times.",
        }
    }
]