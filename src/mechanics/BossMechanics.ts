import Phaser from "phaser";

export default class BossMechanic {
    scene: Phaser.Scene
    boss: any
    player: any
    active: boolean = true

    constructor(scene: Phaser.Scene, boss: any, player: any) {
        this.scene = scene
        this.boss = boss
        this.player = player
    }

    trigger() {
        //initialized
    }

    destroy() {
        this.active = false
    }
}