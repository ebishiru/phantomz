import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import WallIndicator from "../entities/WallIndicator";

export default class Boss24MechC extends BossMechanic {

    config = {
        id: "Right-side-minions-walk",
        name: "Funeral Procession",
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
    minions: Phaser.Physics.Arcade.Sprite[] = []

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
            const indicator = new WallIndicator(
                this.scene,
                this.bounds.x + 10,
                lane,
                0,
                10,
            )

            this.indicators.push(indicator)
        })

        this.scene.time.delayedCall(this.config.castTime, () => {
            this.indicators.forEach(i => i.destroy())
            this.indicators = []

            //Choose 6 / 7 lanes only
            const chosenCoordinates = laneCenters.sort(() => Math.random() - 0.5 ).slice(0, 6)

            //Spawn minions on left side
            chosenCoordinates.forEach(coordinate => {
                const minion = this.scene.physics.add.sprite(this.bounds.x + 50, coordinate, "boss24-minion");
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

                this.minions.push(minion)
            })
        } )
    }

    handleLeftMinion(player: any, minion: Phaser.Physics.Arcade.Sprite) {
        const speed = 175

        //March Right
        minion.setVelocityX(speed)

        //Collision
        const overlap = this.scene.physics.add.overlap(minion, player, () => {
            player.takeDamage(this.config.damage)

            const index = this.minions.indexOf(minion)
            if (index > -1) this.minions.splice(index, 1)
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

                    const index = this.minions.indexOf(minion)
                    if (index > -1) {
                        this.minions.splice(index, 1);
                    }
                }
            }
        })
    }

    destroy() {
        this.indicators.forEach(i => i.destroy())
        this.indicators = []
        this.minions.forEach(m => m.destroy())
        this.minions = []
        super.destroy()
    }
}