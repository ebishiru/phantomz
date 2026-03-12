
export const CooldownManager = {
    cooldowns: {} as { [skillName: string]: number }, // simple object mapping skill name to ready time

    startCooldown(skillName: string, duration: number) {
        // store the timestamp when the skill will be ready
        this.cooldowns[skillName] = Date.now() + duration;
    },

    isOnCooldown(skillName: string) {
        const readyTime = this.cooldowns[skillName] || 0;
        return Date.now() < readyTime;
    },

    getRemaining(skillName: string) {
        const readyTime = this.cooldowns[skillName] || 0;
        return Math.max(0, readyTime - Date.now());
    }
};