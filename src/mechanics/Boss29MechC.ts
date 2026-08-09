import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import WallIndicator from "../entities/WallIndicator";

export default class Boss29MechC extends BossMechanic {

    config = {
        id: "right-and-left-minions-walk",
        name: "Graveyard Procession",
        castTime: 400,
        castDuration: 600,
        cooldown: 3000,
        showCastBar: false,
        damage: 20,
        range: 0,
        width: 0,
    }

    bounds = this.scene.physics.world.bounds

    indicators: WallIndicator[] = []
    rightMinions: Phaser.Physics.Arcade.Sprite[] = []
    leftMinions: Phaser.Physics.Arcade.Sprite[] = []

    onCastStart() {
        const laneHeight = this.bounds.height / 7
        const laneCenters = [
            this.bounds.y + laneHeight * 0.5,
            this.bounds.y + laneHeight * 1.5,
            this.bounds.y + laneHeight * 2.5,
            this.bounds.y + laneHeight * 3.5,
            this.bounds.y + laneHeight * 4.5,
            this.bounds.y + laneHeight * 5.5,
            this.bounds.y + laneHeight * 6.5,
        ]

        //Spawn indicator
        laneCenters.forEach(lane=> {

            //Left indicators
            this.indicator = new WallIndicator(
                this.scene,
                this.bounds.x + 10,
                lane,
                0,
                10,
            )
            this.indicators.push(this.indicator)

            //Right indicators
            this.indicator = new WallIndicator(
                this.scene,
                this.bounds.x + this.bounds.width - 10,
                lane,
                Math.PI,
                10,
            )
            this.indicators.push(this.indicator)
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            this.indicators.forEach(i => i.destroy())
            this.indicators = []

            //Choose 6/7 lanes for left
            const chosenLeftCoordinates = Phaser.Utils.Array.Shuffle([...laneCenters]).slice(0, 6)

            //Spawn minions on left side
            chosenLeftCoordinates.forEach(coordinate => {
                const minion = this.scene.physics.add.sprite(this.bounds.x + 50, coordinate, "boss29-minion");
                minion.setScale(3)
                minion.setOffset(0, 0)
                minion.setAlpha(0)
                minion.setCollideWorldBounds(true)

                this.scene.tweens.add({
                    targets: minion,
                    alpha: { from: 0, to: 1},
                    duration: 200,
                    ease: "Back.Out",
                    onComplete: () => {
                        this.handleLeftMinion(this.player, minion)
                    }
                })

                this.leftMinions.push(minion)
            })

            //Choose 6/7 lanes for right
            const chosenRightCoordinates = Phaser.Utils.Array.Shuffle([...laneCenters]).slice(0, 6)

            //Spawn minions on right side
            chosenRightCoordinates.forEach(coordinate => {
                const minion = this.scene.physics.add.sprite(this.bounds.x + this.bounds.width - 50, coordinate, "boss29-minion");
                minion.setScale(3)
                minion.setOffset(0, 0)
                minion.setAlpha(0)
                minion.setCollideWorldBounds(true)
                minion.setFlipX(true)

                this.scene.tweens.add({
                    targets: minion,
                    alpha: { from: 0, to: 1},
                    duration: 200,
                    ease: "Back.Out",
                    onComplete: () => {
                        this.handleRightMinion(this.player, minion)
                    }
                })

                this.rightMinions.push(minion)
            })
        })
    }

    handleLeftMinion(player: any, minion: Phaser.Physics.Arcade.Sprite) {
        const speed = 200

        //March Right
        minion.setVelocityX(speed)

        //Collision
        const overlap = this.scene.physics.add.overlap(minion, player, () => {
            player.takeDamage(this.config.damage)

            const index = this.leftMinions.indexOf(minion)
            if (index > -1) this.leftMinions.splice(index, 1)
            minion.destroy()
            overlap.destroy()
            checkPosition.destroy()
        })

        //Despawn condition
        const checkPosition = this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                const rightEdge = minion.x + minion.width / 2

                if (rightEdge >= this.bounds.right - 40) {
                    minion.destroy()
                    checkPosition.remove()

                    const index = this.leftMinions.indexOf(minion)
                    if (index > -1) {
                        this.leftMinions.splice(index, 1);
                    }
                }
            }
        })
    }

    handleRightMinion(player: any, minion: Phaser.Physics.Arcade.Sprite) {
        const speed = 200

        //March Right
        minion.setVelocityX(-speed)

        //Collision
        const overlap = this.scene.physics.add.overlap(minion, player, () => {
            player.takeDamage(this.config.damage)

            const index = this.rightMinions.indexOf(minion)
            if (index > -1) this.rightMinions.splice(index, 1)
            minion.destroy()
            overlap.destroy()
            checkPosition.destroy()
        })

        //Despawn condition
        const checkPosition = this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                const leftEdge = minion.x - minion.width / 2

                if (leftEdge <= this.bounds.x + 40) {
                    minion.destroy()
                    checkPosition.remove()

                    const index = this.rightMinions.indexOf(minion)
                    if (index > -1) {
                        this.rightMinions.splice(index, 1);
                    }
                }
            }
        })
    }

    destroy() {
        this.indicators.forEach(i => i.destroy())
        this.indicators = []
        this.leftMinions.forEach(m => m.destroy())
        this.leftMinions = []
        this.rightMinions.forEach(m => m.destroy())
        this.rightMinions = []
        super.destroy()
    }
}