import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import Skill from "../skills/Skill";
import Player from "../entities/Player";
import { createSkill } from "./createSkill"

export default class SkillSystem {
    scene: Phaser.Scene
    player: Player
    skills: Skill[] = []

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene
        this.player = player
    }

    unlockSkill(key: string) {
        const skill = createSkill(key, this.scene, this.player) 
        if (!skill) return
            
        this.skills.push(skill)

        const gameScene = this.scene.scene.get("game") as GameScene
        gameScene.uiSystem.createSkillUI()
    }

    useSkill(index: number, time: number) {
        const skill = this.skills[index]
        if (!skill) return
        skill.use(time)
    }

    pauseAll(time: number) {
        this.skills.forEach(skill => skill.pause(time))
    }

    resumeAll(time: number) {
        this.skills.forEach(skill => skill.resume(time))
    }
}