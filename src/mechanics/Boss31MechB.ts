import BossMechanic from "./BossMechanic";
import RectangleTelegraph from "../entities/RectangleTelegraph";
import WallIndicator from "../entities/WallIndicator";

export default class Boss31MechB extends BossMechanic {

    config = {
        id: "rectangle-random-two-quadrants",
        name: "Thunder Pillars",
        castTime: 1200,
        castDuration: 1200,
        cooldown: 3000,
        showCastBar: true,
        damage: 20,
        range: 0,
        width: 0,
    }

    indicators: WallIndicator[] = []
    selectedPositions: {x: number, y: number}[] = []
    bounds = this.scene.physics.world.bounds
    positions = [
        {x: this.bounds.x + this.bounds.width / 4, y: this.bounds.y + this.bounds.height / 4},
        {x: this.bounds.x + 3 * this.bounds.width / 4, y: this.bounds.y + 3 * this.bounds.height / 4},
        {x: this.bounds.x + 3 * this.bounds.width / 4, y: this.bounds.y + this.bounds.height / 4},
        {x: this.bounds.x + this.bounds.width / 4, y: this.bounds.y + 3 * this.bounds.height / 4},
    ]

    rectangleTelegraphs: RectangleTelegraph[] = []
    
    onCastStart() {
        //Reset selected positions
        this.selectedPositions = []

        //Choose 2 random quadrants
        const shuffled = [...this.positions].sort(() => 0.5 - Math.random());
        this.selectedPositions = shuffled.slice(0, 2);

        //Spawn indicators
        this.selectedPositions.forEach(pos => {
            this.indicator = new WallIndicator(
                this.scene,
                pos.x,
                pos.y,
                Math.PI / 2,
                10,
            )
            this.indicators.push(this.indicator)
        });

        this.scene.time.delayedCall(this.config.castTime, () => {
            //Remove indicators
            this.indicators.forEach(indicator => indicator.destroy())
            this.indicators = []
        })

        this.scene.time.delayedCall(this.config.castTime - 800, () => {
            //Spawn rectangle telegraphs
            this.selectedPositions.forEach(pos => {
                const rectTelegraph = new RectangleTelegraph(
                    this.scene,
                    pos.x - this.bounds.width / 4,
                    pos.y - this.bounds.height / 4,
                    this.bounds.width / 2,
                    this.bounds.height / 2,
                )
                this.rectangleTelegraphs.push(rectTelegraph)
            })

            this.scene.time.delayedCall(800, () => {
                if (!this.boss || this.boss.health <= 0 ||!this.active) return

                //Check for player hit
                this.rectangleTelegraphs.forEach(rectTelegraph => {
                    const playerX = this.player.x;
                    const playerY = this.player.y;

                    if (playerX >= rectTelegraph.x &&
                        playerX <= rectTelegraph.x + rectTelegraph.width &&
                        playerY >= rectTelegraph.y &&
                        playerY <= rectTelegraph.y + rectTelegraph.height) {
                        this.player.takeDamage(this.config.damage);
                    }
                })

                //Remove rectangle telegraphs
                this.rectangleTelegraphs.forEach(rectTelegraph => rectTelegraph.destroy())
                this.rectangleTelegraphs = []
            })
        })
    }

    destroy() {
        this.indicators.forEach(indicator => indicator.destroy())
        this.indicators = []
        this.rectangleTelegraphs.forEach(rectTelegraph => rectTelegraph.destroy())
        this.rectangleTelegraphs = []
        this.selectedPositions = []
    }

}