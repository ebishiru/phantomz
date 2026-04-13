import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss16MechB extends BossMechanic {

    config = {
        id: "dash-triple-screen",
        name: "Advanced Pack Tactics",
        castTime: 1200,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: true,
        damage: 20,
        range: 650,
        width: 400 / 3,
    }

    onCastStart() {
        const scene = this.scene
        const bounds = scene.physics.world.bounds
        const worldWidth = bounds.width
        const worldHeight = bounds.height

        const laneHeight = worldHeight / 3

        const laneCenters = [
            bounds.top + laneHeight * 0.5,
            bounds.top + laneHeight * 1.5,
            bounds.top + laneHeight * 2.5,
        ]

        //Randomize first lane and second lane
        const firstLaneIndex = Phaser.Math.Between(0, 2)

        const otherLanes = [0, 1, 2].filter(i => i !== firstLaneIndex)

        const secondLaneIndex = Phaser.Utils.Array.GetRandom(otherLanes)
        const thirdLaneIndex = [0, 1, 2].find(i => i !== firstLaneIndex && i !== secondLaneIndex)!

        const indicators: (WallIndicator | null)[] = [null, null, null]
        const telegraphs: LineTelegraph[] = []

        const createIndicator = (laneIndex: number) => {
            const y = laneCenters[laneIndex]

            const indicator = new WallIndicator(
                scene,
                165,
                y,
                0,
                15,
            )
            indicators[laneIndex] = indicator
        }

        const fireLane = (laneIndex: number) => {
            const y = laneCenters[laneIndex]

            //remove indicator
            const indicator = indicators[laneIndex]
            if (indicator) {
                indicator.destroy()
                indicators[laneIndex] = null
            }

            const telegraph = new LineTelegraph(
                scene,
                bounds.left,
                y,
                0,
                worldWidth,
                laneHeight,
            )
            telegraphs.push(telegraph)

            //Damage check
            const playerY = this.player.y

            if (Math.abs(playerY - y) <= laneHeight / 2 + this.player.hurtboxRadius) {
                this.player.takeDamage?.(this.config.damage)
            }

            scene.time.delayedCall(300, () => {
                telegraph.destroy()
            })
        }

        //First indicator
        createIndicator(firstLaneIndex)

        //Second indicator after 400ms
        scene.time.delayedCall(400, () => {
            createIndicator(secondLaneIndex)
        })

        //Third indicator after 800ms
        scene.time.delayedCall(800, () => {
            createIndicator(thirdLaneIndex)
        })

        //Fire first lane after 1200ms
        scene.time.delayedCall(1200, () => {
            fireLane(firstLaneIndex)
        })

        //Fire second lane after 1600ms
        scene.time.delayedCall(1600, () => {
            fireLane(secondLaneIndex)
        })

        //Fire third lane after 2000ms
        scene.time.delayedCall(2000, () => {
            fireLane(thirdLaneIndex)
        })
    }
}