import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";
import CirclesAroundBoss from "../mechanics/CirclesAroundBoss";
import ConeFromBoss from "../mechanics/ConeFromBoss";

export const Bosses = [
    {
        name: "Cave Worm",
        spriteKey: "boss1",
        speed: 0,
        hurtRadius: 80,
        mechanics: [
            CircleTelegraphOnBoss,
            CircleTelegraphOnPlayer,
            LineTelegraphFromBoss,
            CirclesAroundBoss,
        ]
    },
    {
        name: "Cave Bat",
        spriteKey: "boss1",
        speed: 0,
        hurtRadius: 80,
        mechanics: [
            ConeFromBoss,
        ]
    }
]