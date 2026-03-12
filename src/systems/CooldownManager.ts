
export const CooldownManager = {
    cooldowns: {} as { [skillName: string]: number }, // simple object mapping skill name to ready time
    pausedCooldowns: {} as { [skillName: string]: number }, // remaining time when paused
    pausedTime: 0, // timestamp when paused

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
    },

    pauseAll() {
        // Save the current remaining time for each active cooldown
        for (const skillName in this.cooldowns) {
            this.pausedCooldowns[skillName] = this.getRemaining(skillName);
        }
        this.pausedTime = Date.now();
    },

    resumeAll() {
        // Restore cooldowns by calculating new ready times based on paused remaining time
        const now = Date.now();
        for (const skillName in this.pausedCooldowns) {
            const remaining = this.pausedCooldowns[skillName];
            if (remaining > 0) {
                this.cooldowns[skillName] = now + remaining;
            }
        }
        this.pausedCooldowns = {};
        this.pausedTime = 0;
    }
};