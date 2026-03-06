import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import Skill from "../skills/Skill";
import Player from "../entities/Player";
import { createSkill } from "./createSkill"
import { createPassive } from "./createPassive"

export default class SkillSystem {
    scene: Phaser.Scene
    player: Player
    skills: Skill[] = []
    passives: any[] = []

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

    addPassive(passiveKey: string) {
        const passive = createPassive(passiveKey, this.player)
        console.log("passivs", this.passives)
        this.passives.push(passive)

        const gameScene = this.scene.scene.get("game") as GameScene
        gameScene.uiSystem.createPassiveUI()
    }

    pauseAll(time: number) {
        this.skills.forEach(skill => skill.pause(time))
    }

    resumeAll(time: number) {
        this.skills.forEach(skill => skill.resume(time))
    }
}