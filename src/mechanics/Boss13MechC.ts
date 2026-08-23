import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import ConeTelegraph from "../entities/ConeTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss13MechC extends BossMechanic {

    config = {
        id: "triple-clone-cone",
        name: "Frontal Sweep",
        castTime: 2000,
        castDuration: 2000,
        cooldown: 2000,
        showCastBar: false,
        damage: 20,
        range: 400,
        width: 0,
    }

    coneAngle = Math.PI

    clones: any[] = []
    indicators: any[] = []
    fakeHurtBoxes: Phaser.GameObjects.Graphics[] = []
    realIndex: number = 0
    attackAngle: number = 0

    positions = [
        { x: 480, y: 270 - 100 },
        { x: 480 - 140, y: 270 + 100 },
        { x: 480 + 140, y: 270 + 100 },
    ]

    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        //Boss goes invisible
        this.boss.setVisible(false)

        //Choose real position
        this.realIndex = Phaser.Math.Between(0, 2)

        this.positions.forEach((pos, index) => {
            let entity

            if (index === this.realIndex) {
                entity = this.boss
                entity.setPosition(pos.x, pos.y)
                entity.setVisible(true)
            } else {
                //create clone
                const clone = this.scene.add.sprite(pos.x, pos.y, "boss13-clone") as any
                clone.hurtRadius = this.boss.hurtRadius
                clone.setScale(3)
                clone.setOrigin(0.5)
                clone.setDepth(10)
                this.clones.push(clone)
                entity = clone

                //Create fake hurtbox
                const fakeHurtBox = this.scene.add.graphics()
                fakeHurtBox.lineStyle(2, 0xffcc00, 0.5)
                fakeHurtBox.strokeCircle(pos.x, pos.y, this.boss.hurtRadius)
                this.fakeHurtBoxes.push(fakeHurtBox)
            }

            //Face center
            const angleToCenter = Phaser.Math.Angle.Between(
                pos.x,
                pos.y,
                480,
                270,
            )

            const indicator = new DirectionIndicator(
                this.scene,
                entity,
                angleToCenter,
                15,
            )
            this.indicators.push(indicator)
            
            //Real attack angle
            if (index === this.realIndex) {
                this.attackAngle = angleToCenter
            }
        })
    }

    execute() {
        const realPos = this.positions[this.realIndex]

        this.indicators.forEach(indicator => indicator.destroy())
        this.indicators = []

        //Draw Telegraph
        const telegraph = new ConeTelegraph(
            this.scene,
            realPos.x,
            realPos.y,
            this.attackAngle,
            this.config.range,
            this.coneAngle,
        )

        //Hit Check
        const hit = this.hitCheck(realPos.x, realPos.y, this.attackAngle)

        if (hit) {
            this.player.takeDamage(this.config.damage)
        }

        this.scene.time.delayedCall(300, () => {
            telegraph?.destroy()
            this.clones.forEach( clone => clone.destroy())
            this.clones = []
            this.fakeHurtBoxes.forEach( hurtbox => hurtbox.destroy())
            this.fakeHurtBoxes = []
        })
    }

    hitCheck(x: number, y: number, angle: number) {
        const dist = Phaser.Math.Distance.Between(
            x,
            y,
            this.player.x,
            this.player.y
        )

        if (dist > this.config.range + this.player.hurtboxRadius) return false

        const angleToPlayer = Phaser.Math.Angle.Between(
            x,
            y,
            this.player.x,
            this.player.y
        )

        const angleDiff = Phaser.Math.Angle.Wrap(angleToPlayer - angle)

        return Math.abs(angleDiff) <= (this.coneAngle / 2) 
    }

    destroy() {
        this.clones.forEach(clone => clone.destroy())
        this.clones = []
        this.fakeHurtBoxes.forEach( hurtbox => hurtbox.destroy())
        this.fakeHurtBoxes = []
        this.indicators.forEach(indicator => indicator.destroy())
        this.indicators = []
    }
}