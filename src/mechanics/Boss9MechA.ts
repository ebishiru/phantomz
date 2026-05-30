import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss9MechA extends BossMechanic {

    config = {
        id: "cardinal-twice-rectangle-room",
        name: "",
        castTime: 2000,
        castDuration: 2300,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    direction: string = "North"
    firstTelegraph?: RectangleTelegraph
    secondTelegraph?: RectangleTelegraph

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const directions = ["North", "South", "East", "West"]
        const firstDirection = Phaser.Utils.Array.GetRandom(directions)

        const perpendicular = this.getPerpendicularDirections(firstDirection)
        const secondDirection = Phaser.Utils.Array.GetRandom(perpendicular)

        this.config.name = `${firstDirection}ern Reinforcements`

        const firstRect = this.getRectangleFromDirection(firstDirection)
        const secondRect = this.getRectangleFromDirection(secondDirection)

        // SpawnArrow Telegraph
        this.spawnWallIndicators(secondDirection)

        // First Rectangle Telegraph
        this.scene.time.delayedCall(this.config.castTime - 300, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.firstTelegraph = new RectangleTelegraph(
                this.scene,
                firstRect.x,
                firstRect.y,
                firstRect.width,
                firstRect.height
            )
        })

        //First Hit Check
        this.scene.time.delayedCall(this.config.castTime, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return
            this.checkHit(firstRect)
            this.firstTelegraph?.destroy()
            this.firstTelegraph = undefined

            //Spawn 2nd Telegraph
            this.secondTelegraph = new RectangleTelegraph(
                this.scene,
                secondRect.x,
                secondRect.y,
                secondRect.width,
                secondRect.height
            )
        })

        //Second Hit Check
        this.scene.time.delayedCall(this.config.castDuration, () => {
            if (!this.boss || this.boss.health <= 0 ||!this.active) return

            this.checkHit(secondRect)
            this.secondTelegraph?.destroy()
            this.secondTelegraph = undefined
        })
    }

    getRectangleFromDirection(direction: string) {
        const bounds = this.scene.physics.world.bounds
        let x = bounds.x
        let y = bounds.y
        let width = bounds.width
        let height = bounds.height

        const roomPercent = 0.6 

        switch( direction ) {
            case "North":
                height = bounds.height * roomPercent
                break
            case "South":
                y += bounds.height * ( 1 - roomPercent)
                height = bounds.height * roomPercent
                break
            case "East":
                x += bounds.width * ( 1 - roomPercent)
                width = bounds.width * roomPercent
                break
            case "West":
                width = bounds.width * roomPercent
                break
        }

        return {x, y, width, height}
    }

    getPerpendicularDirections(dir: string): string[] {
        if (dir === "North" || dir === "South") {
            return ["East", "West"]
        } else {
            return ["North", "South"]
        }
    }

    spawnWallIndicators(direction: string) {
        const bounds = this.scene.physics.world.bounds
        const indicators: WallIndicator[] = []

        const count = 5
        const spacingX = bounds.width / count
        const spacingY = bounds.height / count

        let angle = 0

        switch (direction) {
            case "North":
                angle = Phaser.Math.DegToRad(90)
                for (let i = 0; i < count; i++) {
                    const x = bounds.x + i * spacingX
                    const y = bounds.y
                    indicators.push(new WallIndicator(this.scene, x, y, angle, 16))
                }
                break

            case "South":
                angle = Phaser.Math.DegToRad(-90)
                for (let i = 0; i < count; i++) {
                    const x = bounds.x + i * spacingX
                    const y = bounds.bottom
                    indicators.push(new WallIndicator(this.scene, x, y, angle, 16))
                }
                break

            case "East":
                angle = Phaser.Math.DegToRad(180)
                for (let i = 0; i < count; i++) {
                    const x = bounds.right
                    const y = bounds.y + i * spacingY
                    indicators.push(new WallIndicator(this.scene, x, y, angle, 16))
                }
                break

            case "West":
                angle = 0
                for (let i = 0; i < count; i++) {
                    const x = bounds.x
                    const y = bounds.y + i * spacingY
                    indicators.push(new WallIndicator(this.scene, x, y, angle, 16))
                }
                break
        }

        // Auto-destroy indicators after 800ms
        this.scene.time.delayedCall(this.config.castTime, () => {
            indicators.forEach(i => i.destroy())
        })
    }

    checkHit(rect: { x: number, y: number, width: number, height: number }) {
        const { x: rx, y: ry, width: rw, height: rh } = rect

        const px = this.player.x
        const py = this.player.y
        const pr = this.player.hurtboxRadius

        let closestX = Phaser.Math.Clamp(px, rx, rx + rw)
        let closestY = Phaser.Math.Clamp(py, ry, ry + rh)

        const dx = px - closestX
        const dy = py - closestY

        if (dx * dx + dy * dy <= pr * pr) {
            this.player.takeDamage(this.config.damage)
        }
    }

    execute() {
    }

    destroy() {
        this.firstTelegraph?.destroy()
        this.secondTelegraph?.destroy()
        super.destroy?.()
    }
}