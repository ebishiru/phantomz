import Phaser from "phaser";
import BossMechanic from "./BossMechanic";
import LineTelegraph from "../entities/LineTelegraph";
import DirectionIndicator from "../entities/DirectionIndicator";

export default class Boss18MechC extends BossMechanic {

    config = {
        id: "quad-clone-swipe",
        name: "Quad Mirage Swipe",
        castTime: 2300,
        castDuration: 2300,
        cooldown: 2500,
        showCastBar: false,
        damage: 20,
        range: 400,
        width: 600,
    }

    clones: any[] = []
    indicators: any[] = []
    fakeHurtBoxes: Phaser.GameObjects.Graphics[] = []
    realIndex: number = 0
    attackAngle: number = 0
    sidekickIndex: number = 0
    sidekickAngle: number = 0
    positions: { x: number, y: number }[] = []


    onCastStart() {
        if (!this.boss || this.boss.health <= 0 ||!this.active) return

        const { width, height } = this.scene.scale

        this.positions = [
            { x: width/2 - 60, y: height/2 - 60 },
            { x: width/2 + 60, y: height/2 - 60 },
            { x: width/2 + 60, y: height/2 + 60 },
            { x: width/2 - 60, y: height/2 + 60 },
        ]

        //Boss goes invisible
        this.boss.setVisible(false)

        //Choose real position
        this.realIndex = Phaser.Math.Between(0, 3)

        //Choose sidekick position
        const clockwise = (this.realIndex + 1) % 4
        const counterClockwise = (this.realIndex + 3) % 4

        this.sidekickIndex = Phaser.Math.Between(0, 1) === 0
            ? clockwise
            : counterClockwise

        this.positions.forEach((pos, index) => {
            let entity

            if (index === this.realIndex) {
                entity = this.boss
                entity.setPosition(pos.x, pos.y)
                entity.setVisible(true)
            } else {
                //create clones
                const clone = this.scene.add.sprite(pos.x, pos.y, "boss18-clone") as any

                clone.hurtRadius = this.boss.hurtRadius
                clone.setScale(3)
                clone.setOrigin(0.5)
                clone.setDepth(10)
                this.clones.push(clone)
                entity = clone

                //create fake hurtbox
                const fakeHurtBox = this.scene.add.graphics()
                fakeHurtBox.lineStyle(2, 0xffcc00, 0.5)
                fakeHurtBox.strokeCircle(pos.x, pos.y, this.boss.hurtRadius)
                this.fakeHurtBoxes.push(fakeHurtBox)

                //Create ? icon for sidekick
                if (index === this.sidekickIndex) {
                    const container = this.scene.add.container(pos.x, pos.y)

                    const follow = () => {
                        container.x = pos.x
                        container.y = pos.y
                    }

                    this.scene.events.on('update', follow)

                    const fakeoutVFX = this.scene.add.sprite(0, -40, "boss18-fakeout")

                    fakeoutVFX.setOrigin(0.5, 0.5)
                    fakeoutVFX.setScale(2)
                    fakeoutVFX.setDepth(20)
                    container.add(fakeoutVFX)

                    this.scene.time.delayedCall(this.config.castTime, () => container.destroy())
                }
            }

            //Face center
            const angleToCenter = Phaser.Math.Angle.Between(
                pos.x,
                pos.y,
                width/2,
                height/2,
            )

            //Create indicator towards center
            const indicator = new DirectionIndicator(
                this.scene,
                entity,
                angleToCenter,
                15,
            )
            this.indicators.push(indicator)

            // Save actual telegraph directions
            if (index === this.realIndex) {
                this.attackAngle = angleToCenter
            }

            if (index === this.sidekickIndex) {
                this.sidekickAngle = angleToCenter
            }
        })
    }

    execute() {
        const realPos = this.positions[this.realIndex]
        const sidePos = this.positions[this.sidekickIndex]

        this.indicators.forEach(i => i.destroy())
        this.indicators = []

        const tele1 = new LineTelegraph(
            this.scene,
            realPos.x,
            realPos.y,
            this.attackAngle,
            this.config.range,
            this.config.width
        )

        const tele2 = new LineTelegraph(
            this.scene,
            sidePos.x,
            sidePos.y,
            this.sidekickAngle,
            this.config.range,
            this.config.width
        )

        if (this.hitCheck(realPos.x, realPos.y, this.attackAngle)) {
            this.player.takeDamage(this.config.damage)
        }

        if (this.hitCheck(sidePos.x, sidePos.y, this.sidekickAngle)) {
            this.player.takeDamage(this.config.damage)
        }

        this.scene.time.delayedCall(300, () => {
            tele1?.destroy()
            tele2?.destroy()

            this.clones.forEach(c => c.destroy())
            this.clones = []

            this.fakeHurtBoxes.forEach(f => f.destroy())
            this.fakeHurtBoxes = []
        })
    }

    hitCheck(x: number, y: number, angle: number) {
        const dx = this.player.x - x
        const dy = this.player.y - y

        const fx = Math.cos(angle)
        const fy = Math.sin(angle)

        const along = dx * fx + dy * fy
        if (along < 0 || along > this.config.range) return false

        const perp = Math.abs(dx * -fy + dy * fx)

        return perp <=
            (this.config.width / 2) +
            this.player.hurtboxRadius
    }

    destroy() {
        this.clones.forEach(c => c.destroy())
        this.clones = []

        this.fakeHurtBoxes.forEach(f => f.destroy())
        this.fakeHurtBoxes = []

        this.indicators.forEach(i => i.destroy())
        this.indicators = []
    }
}