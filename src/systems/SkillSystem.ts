import Phaser from "phaser";
import Skill from "../skills/Skill";
import Player from "../entities/Player";
import GameScene from "../scenes/GameScene";
import { createSkill } from "./createSkill";
import { createPassive } from "./createPassive";

export default class SkillSystem {
    scene: Phaser.Scene;
    player: Player;
    skills: Skill[] = [];
    passives: any[] = [];

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene;
        this.player = player;
    }

    unlockSkill(key: string) {
        const skill = createSkill(key, this.scene, this.player);
        if (!skill) return;

        this.skills.push(skill);

        const gameScene = this.scene.scene.get("game") as GameScene;
        gameScene.uiSystem.createSkillUI();
    }

    useSkill(index: number) {
        const skill = this.skills[index];
        if (!skill) return;
        skill.use();
    }

    addPassive(passiveKey: string) {
        const passive = createPassive(passiveKey, this.player);
        this.passives.push(passive);

        const gameScene = this.scene.scene.get("game") as GameScene;
        gameScene.uiSystem.createPassiveUI();
    }

    pauseAll() {
        this.skills.forEach(skill => {
            skill.enabled = false;
        });
    }

    resumeAll() {
        this.skills.forEach(skill => {
            skill.enabled = true;
        });
    }
}