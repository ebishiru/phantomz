import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import RectangleTelegraph from "../entities/RectangleTelegraph";

export default class Boss27MechC extends BossMechanic {

    config = {
        id: "boss-line-rectangle-columns-rows",
        name: "Murder Matrix",
        castTime: 1400,
        castDuration: 1400,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 100,
    }

    numberOfRows = 4
    numberOfCols = 5
    rowTelegraphs: RectangleTelegraph[] = []
    colTelegraphs: RectangleTelegraph[] = []
    lineDist: number = 0

    onCastStart() {
        const bounds = this.scene.physics.world.bounds
        const rowHeight = bounds.height / this.numberOfRows
        const colWidth = bounds.width / this.numberOfCols

        //Boss jumps to random corner
        const corners = [
            {x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 1/8},
            {x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 1/8},
            {x: bounds.x + bounds.width * 1/8, y: bounds.y + bounds.height * 7/8},
            {x: bounds.x + bounds.width * 7/8, y: bounds.y + bounds.height * 7/8},
        ]
        const corner = Phaser.Utils.Array.GetRandom(corners)

        this.scene.tweens.add({
            targets: this.boss,
            x: corner.x,
            y: corner.y,
            duration: 200,
            ease: "Power2",
            onComplete: () => {

                //Aim 1 line telegraph towards player
                const angle = Phaser.Math.Angle.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                this.lineDist = 2 * Phaser.Math.Distance.Between(
                    this.boss.x,
                    this.boss.y,
                    this.player.x,
                    this.player.y
                )

                this.telegraph = new LineTelegraph(
                    this.scene,
                    this.boss.x,
                    this.boss.y,
                    angle,
                    this.lineDist,
                    this.config.width
                )

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
                })
    }

    execute() {
        let hit = false

        //Check grid hit
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

        //Check line hit
        const angle = this.telegraph.angle
        const startX = this.boss.x
        const startY = this.boss.y
        const endX = startX + Math.cos(angle) * this.lineDist
        const endY = startY + Math.sin(angle) * this.lineDist

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        const lineLen = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const t = Phaser.Math.Clamp(((px - startX) * (endX - startX) + (py - startY) * (endY - startY)) / (lineLen * lineLen), 0, 1);
        const closestX = startX + t * (endX - startX);
        const closestY = startY + t * (endY - startY);

        const distanceToLine = Phaser.Math.Distance.Between(px, py, closestX, closestY);

        if (distanceToLine <= pr + this.config.width / 2) {
            hit = true
        }

        //Resolve damage
        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        //Remove telegraphs
        this.rowTelegraphs.forEach(telegraph => {
            telegraph?.destroy()
        })
        this.rowTelegraphs = []
        this.colTelegraphs.forEach(telegraph => {
            telegraph?.destroy()
        })
        this.colTelegraphs = []
        this.telegraph?.destroy()
        this.telegraph = undefined
    }

    destroy() {
        this.rowTelegraphs.forEach(t => t.destroy())
        this.rowTelegraphs = []
        this.colTelegraphs.forEach(t => t.destroy())
        this.colTelegraphs = []
        this.telegraph?.destroy()
        this.telegraph = undefined
    }
}