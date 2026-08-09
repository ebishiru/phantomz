import { upgrades } from "./upgrades";

export const skills = [
    {
        key: "slash",
        name: "Slash",
        iconKey: "slash-icon",
        desc: "Attack in a frontal arc.",
        upgrades: upgrades.slash
    },
    {
        key: "arrow",
        name: "Arrow",
        iconKey: "arrow-icon",
        desc: "Fire a guaranteed missile.",
        upgrades: upgrades.arrow
    },
    {
        key: "pulse",
        name: "Pulse",
        iconKey: "pulse-icon",
        desc: "Unleash an energy pulse repeatedly.",
        upgrades: upgrades.pulse
    },
    {
        key: "thrust",
        name: "Thrust",
        iconKey: "thrust-icon",
        desc: "Propel and strike forward.",
        upgrades: upgrades.thrust
    },
    {
        key: "caltrops",
        name: "Caltrops",
        iconKey: "caltrops-icon",
        desc: "Drop spikes behind that hits periodically.",
        upgrades: upgrades.caltrops
    },
    {
        key: "fireball",
        name: "Fireball",
        iconKey: "fireball-icon",
        desc: "Cast down an explosion of flame.",
        upgrades: upgrades.fireball
    },
    {
        key: "devour",
        name: "Devour",
        iconKey: "devour-icon",
        desc: "Chew on the flesh of your enemy.",
        upgrades: upgrades.devour
    },
    {
        key: "hook",
        name: "Hook",
        iconKey: "hook-icon",
        desc: "Reel yourself to the boss' location.",
        upgrades: upgrades.hook
    },
    {
        key: "volt",
        name: "Volt",
        iconKey: "volt-icon",
        desc: "Supercharge yourself and strike with lightning.",
        upgrades: upgrades.volt
    },
    {
        key: "restoration",
        name: "Restoration",
        iconKey: "restoration-icon",
        desc: "Fix your wounds and restore your health.",
        upgrades: upgrades.restoration,
        // unlock: {
        //     type: "caveTotalScore",
        //     value: 2000,
        //     text: "Score 2000 pts in cave.",
        // }
    },
    {
        key: "ward",
        name: "Ward",
        iconKey: "ward-icon",
        desc: "Create a temporary shield that reflects damage.",
        upgrades: upgrades.ward,
        // unlock: {
        //     type: "bossKills",
        //     value: { boss5: 1},
        //     text: "Defeat Black Knight. (cave)",
        // }
    },
    {
        key: "javelin",
        name: "Javelin",
        iconKey: "javelin-icon",
        desc: "Throw a javelin that can be picked up again.",
        upgrades: upgrades.javelin,
        // unlock: {
        //     type: "bossKills",
        //     value: { boss10: 1 },
        //     text: "Defeat Pure Knight. (cave)",
        // }
    },
    {
        key: "gust",
        name: "Gust",
        iconKey: "gust-icon",
        desc: "Unleash a gust of wind that knocks you back.",
        upgrades: upgrades.gust,
        // unlock: {
        //     type: "caveTotalScore",
        //     value: 4000,
        //     text: "Score 4000 pts in cave.",
        // }
    },
    {
        key: "zephyr",
        name: "Zephyr",
        iconKey: "zephyr-icon",
        desc: "Perform a maneuvre with your rapier",
        upgrades: upgrades.zephyr,
        // unlock: {
        //     type: "caveTotalScore",
        //     value: 8000,
        //     text: "Score 8000 pts in cave.",
        // }
    },
    {
        key: "mirage",
        name: "Mirage",
        iconKey: "mirage-icon",
        desc: "Leave a water clone behind and teleport away",
        upgrades: upgrades.mirage,
        // unlock: {
        //     type: "snowTotalScore",
        //     value: 6000,
        //     text: "Score 6000 pts in snow.",
        // }
    },
    {
        key: "quasar",
        name: "Quasar",
        iconKey: "quasar-icon",
        desc: "Fire a beam in a given direction",
        upgrades: upgrades.quasar,
        // unlock: {
        //     type: "snowTotalScore",
        //     value: 8000,
        //     text: "Score 8000 pts in snow.",
        // }
    },
    {
        key: "yoyo",
        name: "Yo-yo",
        iconKey: "yoyo-icon",
        desc: "Swing forward then backwards",
        upgrades: upgrades.yoyo,
    }
]