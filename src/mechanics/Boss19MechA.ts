import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss19MechA extends BossMechanic {

    config = {
        id: "double-cone-boss",
        name: "Swinge-Swinge",
        castTime: 1200,
        castDuration: 2200,
        cooldown: 2400,
        showCastBar: false,
        damage: 20,
        range: 200,
        width: 0,
    }

    