import Player from "../entities/Player";
import SkillSystem from "./SkillSystem";

export default class MobileControls {
    player: Player;
    skillSystem: SkillSystem
    joystickBase!: HTMLDivElement;
    joystickThumb!: HTMLDivElement;
    skillButtons!: NodeListOf<HTMLDivElement>;
    vector = { x: 0, y: 0 };
    joystickRadius = 100;
    activePointer: number | null = null;

    constructor(player: Player, skillSystem: SkillSystem) {
        this.player = player;
        this.skillSystem = skillSystem

        const controls = document.getElementById("mobile-controls") as HTMLDivElement;
        if (!controls) return;
        controls.style.display = "block";

        this.joystickBase = document.getElementById("joystick-base") as HTMLDivElement;
        this.joystickThumb = document.getElementById("joystick-thumb") as HTMLDivElement;
        this.skillButtons = document.querySelectorAll("#skill-buttons .skill-btn") as NodeListOf<HTMLDivElement>;

        this.initJoystick();
        this.initButtons();
        this.updateButtonLabels();
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

        const maxRadius = ((rect.width / 2) - (this.joystickThumb.offsetWidth / 2)) * 1;

        if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius
        dy = (dy / dist) * maxRadius
        }

        this.vector.x = dx / maxRadius;
        this.vector.y = dy / maxRadius;

        this.joystickThumb.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    initButtons() {
        this.skillButtons.forEach((btn, index) => {

            const originalTransform = btn.style.transform;

            btn.addEventListener("touchstart", e => {
                e.preventDefault();

                // Reduce size when pressed on and reduce brightness too
                btn.style.transform = originalTransform + " scale(0.88)";
                btn.style.filter = "brightness(0.8)";

                this.skillSystem.useSkill(index)
            });

            const resetButton = () => {
                btn.style.transform = originalTransform;
                btn.style.filter = "";
            };

            btn.addEventListener("touchend", resetButton);
            btn.addEventListener("touchcancel", resetButton);
        });
    }

    updateButtonLabels() {
        this.skillButtons.forEach((btn, index) => {
            //Remove old skills
            const oldIcon = btn.querySelector(".skill-icon")
            if (oldIcon) {
                oldIcon.remove();
            }

            //Update to current skill
            const skill = this.skillSystem.skills[index]

            if (!skill) return

            const img = document.createElement("img");

            img.className = "skill-icon";
            img.src = `./assets/${skill.iconKey}.png`

            btn.appendChild(img);
        })
    }

    getMovementVector() {
        return { ...this.vector };
    }

    destroy() {
        const controls = document.getElementById("mobile-controls");
        if (controls) {
            controls.style.display = "none";
        }

        this.joystickBase.replaceWith(this.joystickBase.cloneNode(true));

        this.skillButtons.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
    }
}