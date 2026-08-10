import Phaser from "phaser";
import Player from "../entities/Player";

import SlashSkill from "../skills/SlashSkill";
import ArrowSkill from "../skills/ArrowSkill";
import PulseSkill from "../skills/PulseSkill";
import ThrustSkill from "../skills/ThrustSkill";
import CaltropsSkill from "../skills/CaltropsSkill";
import FireballSkill from "../skills/FireballSkill";
import DevourSkill from "../skills/DevourSkill";
import HookSkill from "../skills/HookSkill";
import VoltSkill from "../skills/VoltSkill";
import RestorationSkill from "../skills/RestorationSkill";
import WardSkill from "../skills/WardSkill";
import JavelinSkill from "../skills/JavelinSkill";
import GustSkill from "../skills/GustSkill";
import ZephyrSkill from "../skills/ZephyrSkill";
import MirageSkill from "../skills/MirageSkill";
import QuasarSkill from "../skills/QuasarSkill";
import YoyoSkill from "../skills/YoyoSkill";
import BlitzkriegSkill from "../skills/BlitzkriegSkill";
import KrakenSkill from "../skills/KrakenSkill";

export function createSkill(
    key: string,
    scene: Phaser.Scene,
    player: Player
) {
    switch (key) {
        case "slash": return new SlashSkill(scene, player)
        case "arrow": return new ArrowSkill(scene, player)
        case "pulse": return new PulseSkill(scene, player)
        case "thrust": return new ThrustSkill(scene, player)
        case "caltrops": return new CaltropsSkill(scene, player)
        case "fireball": return new FireballSkill(scene, player)
        case "devour": return new DevourSkill(scene, player)
        case "hook": return new HookSkill(scene, player)
        case "volt": return new VoltSkill(scene, player)
        case "restoration": return new RestorationSkill(scene, player)
        case "ward": return new WardSkill(scene, player)
        case "javelin": return new JavelinSkill(scene, player)
        case "gust": return new GustSkill(scene, player)
        case "zephyr": return new ZephyrSkill(scene, player)
        case "mirage": return new MirageSkill(scene, player)
        case "quasar": return new QuasarSkill(scene, player)
        case "yoyo": return new YoyoSkill(scene, player)
        case "blitzkrieg": return new BlitzkriegSkill(scene, player)
        case "kraken": return new KrakenSkill(scene, player)
        default: return null
    }
}