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
import ConeFrontBackFromBoss from "../mechanics/ConeFrontBackFromBoss";
import TeleportConeBiggerFromBoss from "../mechanics/TeleportConeBiggerFromBoss";
import TeleportClockwiseCones from "../mechanics/TeleportClockwiseCones";
import SuckExpandDonutFromBoss from "../mechanics/SuckExpandDonutFromBoss";
import SuckShrinkDonutFromBoss from "../mechanics/SuckShrinkDonutFromBoss";
import TeleportTripleRectangleOnPlayer from "../mechanics/TeleportTripleRectangleOnPlayer";
import DoubleCardinalRoomSwipe from "../mechanics/DoubleCardinalRoomSwipe";
import PersistCircleTelegraph from "../mechanics/PersistCircleTelegraph";
import CheckboardTelegraph from "../mechanics/CheckboardTelegraph";
import MoreRandomCirclesAround from "../mechanics/MoreRandomCirclesAround";

export const Bosses = [
    {
        name: "Wyrm",
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
        name: "Shrieker",
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
        name: "Titanus",
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
        name: "Buzzerax",
        spriteKey: "boss4",
        speed: 80,
        hurtRadius: 65,
        mechanics: [
            CardinalRoomSwipe,
            TeleportConeAtPlayer
        ]
    },
    {
        name: "Black Knight",
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
        hurtRadius: 75,
        mechanics: [
            DoubleDonutFromBoss,
            PersisLineTelegraphFromBoss,
            CirclesSequenceAroundBoss
        ]
    },
    {
        name: "Vrykolakas",
        spriteKey: "boss7",
        speed: 100,
        hurtRadius: 70,
        mechanics: [
            ConeFrontBackFromBoss,
            TeleportConeBiggerFromBoss,
            TeleportClockwiseCones
        ]
    },
    {
        name: "Titanus Prime",
        spriteKey: "boss8",
        speed: 60,
        hurtRadius: 80,
        mechanics: [
            SuckExpandDonutFromBoss,
            SuckShrinkDonutFromBoss,
            TeleportTripleRectangleOnPlayer
        ]
    },
    {
        name: "Hive Lord",
        spriteKey: "boss9",
        speed: 80,
        hurtRadius: 60,
        mechanics: [
            DoubleCardinalRoomSwipe,
            PersistCircleTelegraph,
            CheckboardTelegraph
        ]
    },
    {
        name: "Phantom Knight",
        spriteKey: "boss10",
        speed: 80,
        hurtRadius: 75,
        mechanics: [
            MoreRandomCirclesAround,
        ]
    },
]