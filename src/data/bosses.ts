import Boss1MechA from "../mechanics/Boss1MechA";
import Boss1MechB from "../mechanics/Boss1MechB";
import Boss1MechC from "../mechanics/Boss1MechC";
import Boss1MechD from "../mechanics/Boss1MechD";
import Boss2MechA from "../mechanics/Boss2MechA";
import Boss2MechB from "../mechanics/Boss2MechB";
import Boss2MechC from "../mechanics/Boss2MechC";
import Boss2MechD from "../mechanics/Boss2MechD";
import Boss3MechA from "../mechanics/Boss3MechA";
import Boss3MechB from "../mechanics/Boss3MechB";
import Boss3MechC from "../mechanics/Boss3MechC";
import Boss4MechA from "../mechanics/Boss4MechA";
import Boss4MechB from "../mechanics/Boss4MechB";
import Boss5MechA from "../mechanics/Boss5MechA";
import Boss5MechB from "../mechanics/Boss5MechB";
import Boss5MechC from "../mechanics/Boss5MechC";
import Boss6MechA from "../mechanics/Boss6MechA";
import Boss6MechB from "../mechanics/Boss6MechB";
import Boss6MechC from "../mechanics/Boss6MechC";
import Boss7MechA from "../mechanics/Boss7MechA";
import Boss7MechB from "../mechanics/Boss7MechB";
import Boss7MechC from "../mechanics/Boss7MechC";
import Boss8MechA from "../mechanics/Boss8MechA";
import Boss8MechB from "../mechanics/Boss8MechB";
import Boss8MechC from "../mechanics/Boss8MechC";
import Boss9MechA from "../mechanics/Boss9MechA";
import Boss9MechB from "../mechanics/Boss9MechB";
import Boss9MechC from "../mechanics/Boss9MechC";
import Boss10MechA from "../mechanics/Boss10MechA";
import Boss10MechB from "../mechanics/Boss10MechB";
import Boss10MechC from "../mechanics/Boss10MechC";
import Boss11MechA from "../mechanics/Boss11MechA";
import Boss11MechB from "../mechanics/Boss11MechB";
import Boss11MechC from "../mechanics/Boss11MechC";
import Boss12MechA from "../mechanics/Boss12MechA";
import Boss12MechB from "../mechanics/Boss12MechB";
import Boss12MechC from "../mechanics/Boss12MechC";
import Boss13MechA from "../mechanics/Boss13MechA";
import Boss13MechB from "../mechanics/Boss13MechB";
import Boss13MechC from "../mechanics/Boss13MechC";
import Boss14MechA from "../mechanics/Boss14MechA";
import Boss14MechB from "../mechanics/Boss14MechB";
import Boss14MechC from "../mechanics/Boss14MechC";
import Boss14MechD from "../mechanics/Boss14MechD";
import Boss15MechA from "../mechanics/Boss15MechA";
import Boss15MechB from "../mechanics/Boss15MechB";
import Boss15MechC from "../mechanics/Boss15MechC";
import Boss16MechA from "../mechanics/Boss16MechA";
import Boss16MechB from "../mechanics/Boss16MechB";
import Boss16MechC from "../mechanics/Boss16MechC";
import Boss17MechA from "../mechanics/Boss17MechA";
import Boss17MechB from "../mechanics/Boss17MechB";
import Boss17MechC from "../mechanics/Boss17MechC";
import Boss18MechA from "../mechanics/Boss18MechA";
import Boss18MechB from "../mechanics/Boss18MechB";
import Boss18MechC from "../mechanics/Boss18MechC";
import Boss19MechA from "../mechanics/Boss19MechA";
import Boss19MechB from "../mechanics/Boss19MechB";
import Boss19MechC from "../mechanics/Boss19MechC";
import Boss20MechA from "../mechanics/Boss20MechA";
import Boss20MechB from "../mechanics/Boss20MechB";
import Boss20MechC from "../mechanics/Boss20MechC";
import Boss21MechA from "../mechanics/Boss21MechA";
import Boss21MechB from "../mechanics/Boss21MechB";

export const Bosses = [

    //CAVE BOSSES
    {
        name: "Wyrm",
        level: "cave",
        spriteKey: "boss1",
        speed: 40,
        hurtRadius: 80,
        mechanics: [
            Boss1MechA,
            Boss1MechB,
            Boss1MechC,
            Boss1MechD,
        ]
    },
    {
        name: "Shrieker",
        level: "cave",
        spriteKey: "boss2",
        speed: 120,
        hurtRadius: 70,
        mechanics: [
            Boss2MechA,
            Boss2MechB,
            Boss2MechD,
            Boss2MechC,
        ]
    },
    {
        name: "Titanus",
        level: "cave",
        spriteKey: "boss3",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            Boss3MechA,
            Boss3MechB,
            Boss3MechC
        ]
    },
    {
        name: "Buzzerax",
        level: "cave",
        spriteKey: "boss4",
        speed: 80,
        hurtRadius: 65,
        mechanics: [
            Boss4MechA,
            Boss4MechB
        ]
    },
    {
        name: "Dark Knight",
        level: "cave",
        spriteKey: "boss5",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            Boss5MechA,
            Boss5MechB,
            Boss5MechC
        ]
    },
    {
        name: "Naga",
        level: "cave",
        spriteKey: "boss6",
        speed: 60,
        hurtRadius: 75,
        mechanics: [
            Boss6MechA,
            Boss6MechB,
            Boss6MechC
        ]
    },
    {
        name: "Vrykolakas",
        level: "cave",
        spriteKey: "boss7",
        speed: 100,
        hurtRadius: 70,
        mechanics: [
            Boss7MechA,
            Boss7MechB,
            Boss7MechC
        ]
    },
    {
        name: "Titanus Prime",
        level: "cave",
        spriteKey: "boss8",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            Boss8MechA,
            Boss8MechB,
            Boss8MechC
        ]
    },
    {
        name: "Hive Lord",
        level: "cave",
        spriteKey: "boss9",
        speed: 80,
        hurtRadius: 60,
        mechanics: [
            Boss9MechA,
            Boss9MechB,
            Boss9MechC
        ]
    },
    {
        name: "Pure Knight",
        level: "cave",
        spriteKey: "boss10",
        speed: 80,
        hurtRadius: 75,
        mechanics: [
            Boss10MechA,
            Boss10MechB,
            Boss10MechC
        ]
    },

    //SNOW BOSSES
    {
        name: "Dire Wolf",
        level: "snow",
        spriteKey: "boss11",
        speed: 75,
        hurtRadius: 60,
        mechanics: [
            Boss11MechA,
            Boss11MechB,
            Boss11MechC,
        ]
    },
    {
        name: "Rot Belcher",
        level: "snow",
        spriteKey: "boss12",
        speed: 60,
        hurtRadius: 70,
        mechanics: [
            Boss12MechA,
            Boss12MechB,
            Boss12MechC,
        ]
    },
    {
        name: "Hag",
        level: "snow",
        spriteKey: "boss13",
        speed: 65,
        hurtRadius: 60,
        mechanics: [
            Boss13MechA,
            Boss13MechB,
            Boss13MechC,
        ]
    },
    {
        name: "Drake",
        level: "snow",
        spriteKey: "boss14",
        speed: 75,
        hurtRadius: 75,
        mechanics: [
            Boss14MechA,
            Boss14MechB,
            Boss14MechC,
            Boss14MechD,
        ]
    },
    {
        name: "Fallen Knight",
        level: "snow",
        spriteKey: "boss15",
        speed: 80,
        hurtRadius: 75,
        mechanics: [
            Boss15MechA,
            Boss15MechB,
            Boss15MechC,
        ]
    },
    {
        name: "Lycanthrope",
        level: "snow",
        spriteKey: "boss16",
        speed: 80,
        hurtRadius: 60,
        mechanics: [
            Boss16MechA,
            Boss16MechB,
            Boss16MechC,
        ]
    },
    {
        name: "Rot Bloater",
        level: "snow",
        spriteKey: "boss17",
        speed: 65,
        hurtRadius: 70,
        mechanics: [
            Boss17MechA,
            Boss17MechB,
            Boss17MechC,
        ]
    },
    {
        name: "Hex Matriarch",
        level: "snow",
        spriteKey: "boss18",
        speed: 70,
        hurtRadius: 55,
        mechanics: [
            Boss18MechA,
            Boss18MechB,
            Boss18MechC
        ]
    },
    {
        name: "Frost Wyvern",
        level: "snow",
        spriteKey: "boss19",
        speed: 75,
        hurtRadius: 75,
        mechanics: [
            Boss19MechA,
            Boss19MechB,
            Boss19MechC,
        ]
    },
    {
        name: "Undying Knight",
        level: "snow",
        spriteKey: "boss20",
        speed: 85,
        hurtRadius: 70,
        mechanics: [
            Boss20MechA,
            Boss20MechB,
            Boss20MechC,
        ]
    },

    //TOWER BOSSES
    {
        name: "Coeurl",
        level: "tower",
        spriteKey: "boss21",
        speed: 100,
        hurtRadius: 50,
        mechanics: [
            Boss21MechA,
            Boss21MechB,
        ]
    },
    {
        name: "Headless Guard",
        level: "tower",
        spriteKey: "boss22",
        speed: 85,
        hurtRadius: 60,
        mechanics: [
            Boss1MechA,
            Boss1MechC,
        ]
    },
    {
        name: "Warmech MK I",
        level: "tower",
        spriteKey: "boss23",
        speed: 120,
        hurtRadius: 70,
        mechanics: [
            Boss1MechA,
            Boss1MechC,
        ]
    },
    {
        name: "Reaper",
        level: "tower",
        spriteKey: "boss24",
        speed: 105,
        hurtRadius: 50,
        mechanics: [
            Boss1MechA,
            Boss1MechC,
        ]
    },
    {
        name: "Demon Knight",
        level: "tower",
        spriteKey: "boss25",
        speed: 100,
        hurtRadius: 70,
        mechanics: [
            Boss1MechA,
            Boss1MechC,
        ]
    },
]