import CircleTelegraphOnBoss from "../mechanics/CircleTelegraphOnBoss";
import CircleTelegraphOnPlayer from "../mechanics/CircleTelegraphOnPlayer";
import LineTelegraphFromBoss from "../mechanics/LineTelegraphFromBoss";
import CirclesAroundBoss from "../mechanics/CirclesAroundBoss";
import ConeFromBoss from "../mechanics/ConeFromBoss";
import TeleportConeFromBoss from "../mechanics/TeleportConeFromBoss";
import ExpandDonutFromBoss from "../mechanics/ExpandDonutFromBoss";
import ShrinkDonutFromBoss from "../mechanics/ShrinkDonutFromBoss";
import TripleRectangleOnPlayer from "../mechanics/TripleRectangleOnPlayer";
import CardinalRoomSwipe from "../mechanics/CardinalRoomSwipe";
import TeleportConeAtPlayer from "../mechanics/TeleportConeAtPlayer";
import RandomCirclesAround from "../mechanics/RandomCirclesAround";
import HalfCircleFromBoss from "../mechanics/HalfCircleFromBoss";
import TeleportCircleAndBack from "../mechanics/TeleportCircleAndBack";
import DoubleDonutFromBoss from "../mechanics/DoubleDonutFromBoss";
import PersisLineTelegraphFromBoss from "../mechanics/PersistLineTelegraphFromBoss";
import CirclesSequenceAroundBoss from "../mechanics/CirclesSequenceAroundBoss";

export const Bosses = [
    {
        name: "Cave Worm",
        spriteKey: "boss1",
        speed: 25,
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
        hurtRadius: 70,
        mechanics: [
            ConeFromBoss,
            CircleTelegraphOnPlayer,
            CirclesAroundBoss,
            TeleportConeFromBoss,
        ]
    },
    {
        name: "Cave Titan",
        spriteKey: "boss3",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            ExpandDonutFromBoss,
            ShrinkDonutFromBoss,
            TripleRectangleOnPlayer
        ]
    },
    {
        name: "Cave Crawler",
        spriteKey: "boss4",
        speed: 80,
        hurtRadius: 65,
        mechanics: [
            CardinalRoomSwipe,
            TeleportConeAtPlayer
        ]
    },
    {
        name: "Iron Giant",
        spriteKey: "boss5",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            RandomCirclesAround,
            HalfCircleFromBoss,
            TeleportCircleAndBack
        ]
    },
    {
        name: "Naga",
        spriteKey: "boss6",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            DoubleDonutFromBoss,
            PersisLineTelegraphFromBoss,
            CirclesSequenceAroundBoss
        ]
    }
]