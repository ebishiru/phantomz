import Phaser from "phaser";
import Player from "../entities/Player";

export default class MobileControlSystem {

    scene: Phaser.Scene
    player: Player

    joystickBase!: Phaser.GameObjects.Arc
    joystickThumb!: Phaser.GameObjects.Arc
    joystickVector = new Phaser.Math.Vector2()
    joystickActive = false
    joystickRadius = 60

    constructor(scene: Phaser.Scene, player: Player) {
        this.scene = scene
        this.player = player

        const isMobile = this.scene.sys.game.device.input.touch
        if (isMobile) {
            this.createControls()
        }
    }

    createControls() {

        const gameWidth = 800
        const gameHeight = 700

        const screenWidth = this.scene.scale.width
        const sideSpace = screenWidth - gameWidth

        const leftCenterX = sideSpace / 2
        const rightCenterX = gameWidth + sideSpace / 2
        const centerY = gameHeight / 2

        //Joystick on left side

        this.joystickBase = this.scene.add.circle(
            leftCenterX,
            centerY,
            90,
            0x000000,
            0.3
        ).setScrollFactor(0)

        this.joystickThumb = this.scene.add.circle(
            leftCenterX,
            centerY,
            50,
            0xffffff,
            0.6
        ).setScrollFactor(0)

        let pointerId: number | null = null

        this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {

            if (pointer.x < gameWidth && pointer.x < leftCenterX + 120) {
                this.joystickActive = true
                pointerId = pointer.id
            }
        })

        this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {

            if (!this.joystickActive || pointer.id !== pointerId) return

            const dx = pointer.x - this.joystickBase.x
            const dy = pointer.y - this.joystickBase.y

            const distance = Math.min(
                Math.sqrt(dx * dx + dy * dy),
                this.joystickRadius
            )

            this.joystickVector.set(dx, dy).normalize()

            this.joystickThumb.setPosition(
                this.joystickBase.x + this.joystickVector.x * distance,
                this.joystickBase.y + this.joystickVector.y * distance
            )
        })

        this.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {

            if (pointer.id === pointerId) {
                this.joystickActive = false
                pointerId = null
                this.joystickVector.set(0, 0)

                this.joystickThumb.setPosition(
                    this.joystickBase.x,
                    this.joystickBase.y
                )
            }
        })

        //Face buttons on right side

        const offset = 85
        const radius = 40

        const positions = [
            { x: rightCenterX - offset, y: centerY },
            { x: rightCenterX, y: centerY - offset },
            { x: rightCenterX, y: centerY + offset },
            { x: rightCenterX + offset, y: centerY },
        ]

        positions.forEach((pos, index) => {

            const btn = this.scene.add.circle(
                pos.x,
                pos.y,
                radius,
                0xffffff,
                0.4
            )
            .setScrollFactor(0)
            .setInteractive()

            btn.on("pointerdown", () => {
                const skill = this.player.skills[index]
                if (skill) {
                    skill.use(this.scene.time.now)
                }
            })
        })
    }

    getMovementVector() {
        return this.joystickVector.clone()
    }
}