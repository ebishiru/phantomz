import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss22MechC extends BossMechanic {

    config = {
        id: "rectangle-columns-rows",
        name: "Guillotine Grid",
        castTime: 1800,
        castDuration: 1800,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    numberOfRows = 4
    numberOfCols = 5
    rowTelegraphs: RectangleTelegraph[] = []
    colTelegraphs: RectangleTelegraph[] = []

    onCastStart() {
        const bounds = this.scene.physics.world.bounds
        const rowHeight = bounds.height / this.numberOfRows
        const colWidth = bounds.width / this.numberOfCols

        //Randomly choose 2 out of 4 rows
        const chosenRows = Phaser.Utils.Array.Shuffle([0, 1, 2, 3]).slice(0, 2)
        chosenRows.forEach(rowIndex => {
            const y = bounds.y + rowHeight * rowIndex
            const telegraph = new RectangleTelegraph(
                this.scene,
                bounds.x,
                y,
                bounds.width,
                rowHeight,
            )
            this.rowTelegraphs.push(telegraph)
        })

        //Randomly choose 3 out of 5 columns
        const chosenCols = Phaser.Utils.Array.Shuffle([0, 1, 2, 3, 4]).slice(0, 3)
        chosenCols.forEach(colIndex => {
            const x = bounds.x + colWidth * colIndex
            const telegraph = new RectangleTelegraph(
                this.scene,
                x,
                bounds.y,
                colWidth,
                bounds.height,
            )
            this.colTelegraphs.push(telegraph)
        })
    }

    execute() {
        //Check hit
        let hit = false

        this.rowTelegraphs.forEach(telegraph => {
            const dist = Math.abs(this.player.y - telegraph.y - telegraph.height / 2)
            if (dist < telegraph.height / 2) {
                hit = true
            }
        })

        this.colTelegraphs.forEach(telegraph => {
            const dist = Math.abs(this.player.x - telegraph.x - telegraph.width / 2)
            if (dist < telegraph.width / 2) {
                hit = true
            }
        })

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        //Remove telegraphs
        this.rowTelegraphs.forEach(telegraph => {
            telegraph.destroy()
        })
        this.rowTelegraphs = []
        this.colTelegraphs.forEach(telegraph => {
            telegraph.destroy()
        })
        this.colTelegraphs = []
    }

    destroy() {
        this.rowTelegraphs.forEach(t => t.destroy())
        this.rowTelegraphs = []
        this.colTelegraphs.forEach(t => t.destroy())
        this.colTelegraphs = []
    }
}