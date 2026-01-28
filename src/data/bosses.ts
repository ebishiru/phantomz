import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";
import CirclesAroundBoss from "../mechanics/CirclesAroundBoss";

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
]