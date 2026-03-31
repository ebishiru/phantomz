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

export const Bosses = [
    {
        name: "Wyrm",
        spriteKey: "boss12",
        speed: 25,
        hurtRadius: 80,
        mechanics: [
            // Boss1MechA,
            // Boss1MechB,
            // Boss1MechC,
            // Boss1MechD,
            Boss12MechA,
            Boss12MechB,
        ]
    },
    {
        name: "Shrieker",
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
        spriteKey: "boss10",
        speed: 80,
        hurtRadius: 75,
        mechanics: [
            Boss10MechA,
            Boss10MechB,
            Boss10MechC
        ]
    },
    {
        name: "Dire Wolf",
        spriteKey: "boss11",
        speed: 70,
        hurtRadius: 60,
        mechanics: [
            Boss11MechA,
            Boss11MechB,
            Boss11MechC,
        ]
    },
]