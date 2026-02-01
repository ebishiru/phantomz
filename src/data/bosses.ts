import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";
import CirclesAroundBoss from "../mechanics/CirclesAroundBoss";
import ConeFromBoss from "../mechanics/ConeFromBoss";
import TeleportConeFromBoss from "../mechanics/TeleportConeFromBoss";
import ExpandDonutFromBoss from "../mechanics/ExpandDonutFromBoss";

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
        spriteKey: "boss2",
        speed: 120,
        hurtRadius: 80,
        mechanics: [
            ConeFromBoss,
            CircleTelegraphOnPlayer,
            CirclesAroundBoss,
            TeleportConeFromBoss,
        ]
    },
    {
        name: "Cave Ogre",
        spriteKey: "boss3",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            ExpandDonutFromBoss
        ]
    }
]