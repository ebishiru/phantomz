import { upgrades } from "./upgrades";

export const skills = [
    {
        key: "slash",
        name: "Slash",
        iconKey: "slash-icon",
        desc: "Cleave foes before you in a sweeping arc.",
        upgrades: upgrades.slash
    },
    {
        key: "arrow",
        name: "Arrow",
        iconKey: "arrow-icon",
        desc: "Loose a sure-shot arrow that never misses.",
        upgrades: upgrades.arrow
    },
    {
        key: "pulse",
        name: "Pulse",
        iconKey: "pulse-icon",
        desc: "Unleash a pulse of arcane force again and again.",
        upgrades: upgrades.pulse
    },
    {
        key: "thrust",
        name: "Thrust",
        iconKey: "thrust-icon",
        desc: "Lunge forth and pierce all who stand before you.",
        upgrades: upgrades.thrust
    },
    {
        key: "caltrops",
        name: "Caltrops",
        iconKey: "caltrops-icon",
        desc: "Scatter spikes that strikes foes thrice.",
        upgrades: upgrades.caltrops
    },
    {
        key: "fireball",
        name: "Fireball",
        iconKey: "fireball-icon",
        desc: "Hurl a delayed blazing orb a fixed distance in front of you.",
        upgrades: upgrades.fireball
    },
    {
        key: "devour",
        name: "Devour",
        iconKey: "devour-icon",
        desc: "Feast upon your foe and gain their health.",
        upgrades: upgrades.devour
    },
    {
        key: "hook",
        name: "Hook",
        iconKey: "hook-icon",
        desc: "Lash forth your hook and pull yourself toward your prey.",
        upgrades: upgrades.hook
    },
    {
        key: "volt",
        name: "Volt",
        iconKey: "volt-icon",
        desc: "Surge with thunderous might and strike with lightning.",
        upgrades: upgrades.volt
    },
    {
        key: "restoration",
        name: "Restoration",
        iconKey: "restoration-icon",
        desc: "Mend your wounds and reclaim your lost vitality.",
        upgrades: upgrades.restoration,
    },
    {
        key: "ward",
        name: "Ward",
        iconKey: "ward-icon",
        desc: "Summon a temporary shield that reflects and heals on hit.",
        upgrades: upgrades.ward,
        unlock: {
            type: "caveTotalScore",
            value: 1000,
            text: "Score 1000 pts in cave.",
        }
    },
    {
        key: "javelin",
        name: "Javelin",
        iconKey: "javelin-icon",
        desc: "Hurl a mighty javelin, and reclaim it from the battlefield.",
        upgrades: upgrades.javelin,
        unlock: {
            type: "bossKills",
            value: { boss10: 1 },
            text: "Defeat Pure Knight. (cave)",
        }
    },
    {
        key: "gust",
        name: "Gust",
        iconKey: "gust-icon",
        desc: "Unleash a violent gust of wind that hurls you backwards.",
        upgrades: upgrades.gust,
        unlock: {
            type: "caveTotalScore",
            value: 3000,
            text: "Score 3000 pts in cave.",
        }
    },
    {
        key: "zephyr",
        name: "Zephyr",
        iconKey: "zephyr-icon",
        desc: "Dance in the wind with a flurry of three rapier strikes",
        upgrades: upgrades.zephyr,
        unlock: {
            type: "bossKills",
            value: { boss5: 1},
            text: "Defeat Black Knight. (cave)",
        }
    },
    {
        key: "mirage",
        name: "Mirage",
        iconKey: "mirage-icon",
        desc: "Leave behind a watery phantom and vanish from sight.",
        upgrades: upgrades.mirage,
        unlock: {
            type: "bossKills",
            value: { boss15: 1 },
            text: "Defeat Fallen Knight. (snow)",
        }
    },
    {
        key: "quasar",
        name: "Quasar",
        iconKey: "quasar-icon",
        desc: "Unleash a searing beam of celestial power.",
        upgrades: upgrades.quasar,
        unlock: {
            type: "snowTotalScore",
            value: 1000,
            text: "Score 1000 pts in snow.",
        }
    },
    {
        key: "yoyo",
        name: "Yo-yo",
        iconKey: "yoyo-icon",
        desc: "Swing forward and back with a relentless orb of steel.",
        upgrades: upgrades.yoyo,
        unlock: {
            type: "snowTotalScore",
            value: 5000,
            text: "Score 5000 pts in snow.",
        }
    },
    {
        key: "blitzkrieg",
        name: "Blitzkrieg",
        iconKey: "blitzkrieg-icon",
        desc: "Charge like a war beast, then shake the earth beneath your feet.",
        upgrades: upgrades.blitzkrieg,
        unlock: {
            type: "towerTotalScore",
            value: 1000,
            text: "Score 1000 pts in tower.",
        }
    },
    {
        key: "kraken",
        name: "Kraken",
        iconKey: "kraken-icon",
        desc: "Call upon the depths and summon the Kraken's wrath.",
        upgrades: upgrades.kraken,
        unlock: {
            type: "bossKills",
            value: { boss25: 1 },
            text: "Defeat Demon Knight. (tower)",
        }
    },
    {
        key: "nexus",
        name: "Nexus",
        iconKey: "nexus-icon",
        desc: "Channel a mystic crystal and unleash its power upon your foe.",
        upgrades: upgrades.nexus,
        unlock: {
            type: "towerTotalScore",
            value: 5000,
            text: "Score 5000 pts in tower.",
        }
    },
]