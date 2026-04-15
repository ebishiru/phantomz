import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import CircleTelegraph from "../entities/CircleTelegraph";

export default class Boss17MechB extends BossMechanic {

    config = {
        id: "circle-stay-delay-explode-player",
        name: "Rot Grenade",
        castTime: 800,
        castDuration: 800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 60,
        width: 0,
    }

    
}