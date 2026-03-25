import Phaser from "phaser";
import Skill from "./Skill";

export default class JavelinSkill extends Skill {
    player: any

    constructor(scene: Phaser.Scene, player: any) {
        super(scene, player, "javelin", "Javelin", 15, 0, 65)
        this.iconKey = "javelin-icon"
        this.player = player
    }
}