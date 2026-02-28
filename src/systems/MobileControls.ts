import Player from "../entities/Player";

export default class MobileControls {
    player: Player;
    joystickBase!: HTMLDivElement;
    joystickThumb!: HTMLDivElement;
    skillButtons!: NodeListOf<HTMLDivElement>;
    vector = { x: 0, y: 0 };
    joystickRadius = 90;
    activePointer: number | null = null;

    constructor(player: Player) {
        this.player = player;

        const controls = document.getElementById("mobile-controls") as HTMLDivElement;
        if (!controls) return;
        controls.style.display = "block";

        this.joystickBase = document.getElementById("joystick-base") as HTMLDivElement;
        this.joystickThumb = document.getElementById("joystick-thumb") as HTMLDivElement;
        this.skillButtons = document.querySelectorAll("#skill-buttons .skill-btn") as NodeListOf<HTMLDivElement>;

        this.initJoystick();
        this.initButtons();
    }

    initJoystick() {
        this.joystickBase.addEventListener("touchstart", e => this.onTouchStart(e));
        this.joystickBase.addEventListener("touchmove", e => this.onTouchMove(e));
        this.joystickBase.addEventListener("touchend", e => this.onTouchEnd(e));
    }

    onTouchStart(e: TouchEvent) {
        e.preventDefault();
        if (this.activePointer !== null) return;
        const touch = e.changedTouches[0];
        this.activePointer = touch.identifier;
        this.updateJoystick(touch.clientX, touch.clientY);
    }

    onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (this.activePointer === null) return;
        const touch = Array.from(e.changedTouches).find(t => t.identifier === this.activePointer);
        if (!touch) return;
        this.updateJoystick(touch.clientX, touch.clientY);
    }

    onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        const touch = Array.from(e.changedTouches).find(t => t.identifier === this.activePointer);
        if (!touch) return;
        this.activePointer = null;
        this.vector.x = 0;
        this.vector.y = 0;
        this.joystickThumb.style.transform = `translate(0px, 0px)`;
    }

    updateJoystick(clientX: number, clientY: number) {
        const rect = this.joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > this.joystickRadius) {
        dx = (dx / dist) * this.joystickRadius;
        dy = (dy / dist) * this.joystickRadius;
        }

        this.vector.x = dx / this.joystickRadius;
        this.vector.y = dy / this.joystickRadius;

        this.joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    initButtons() {
        this.skillButtons.forEach((btn, index) => {
        btn.addEventListener("touchstart", e => {
            e.preventDefault();
            const skill = this.player.skills[index];
            if (skill) skill.use(performance.now());
        });
        });
    }

    getMovementVector() {
        return { ...this.vector };
    }
    }