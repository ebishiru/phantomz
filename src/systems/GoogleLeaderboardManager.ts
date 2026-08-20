import { Capacitor } from "@capacitor/core";
import { CapacitorGameConnect } from "@osmanraifgunes/capacitor-game-connect";

export type LeaderboardLevel = "cave" | "snow" | "tower";

export default class GoogleLeaderboardManager {

    private static instance: GoogleLeaderboardManager;

    private leaderboardIds: Record<LeaderboardLevel, string> = {
        cave: "CgkI1buju6gREAIQAg",
        snow: "CgkI1buju6gREAIQAw",
        tower: "CgkI1buju6gREAIQBA",
    };

    private constructor() {}

    public static getInstance(): GoogleLeaderboardManager {
        if (!GoogleLeaderboardManager.instance) {
            GoogleLeaderboardManager.instance = new GoogleLeaderboardManager();
        }

        return GoogleLeaderboardManager.instance;
    }

    async signIn(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) {
            return false;
        }

        try {
            await CapacitorGameConnect.signIn();
            return true;
        } catch (error) {
            console.error("Google Play Games sign-in failed:", error);
            return false;
        }
    }

    async submitScore(level: LeaderboardLevel, score: number): Promise<void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        const leaderboardId = this.leaderboardIds[level];

        try {
            await CapacitorGameConnect.submitScore({
                leaderboardID: leaderboardId,
                totalScoreAmount: score
            });
        } catch (error) {
            console.error(`Failed to submit ${level} score:`, error);
        }
    }

    async getUserScore(level: LeaderboardLevel): Promise<number | null> {
        if (!Capacitor.isNativePlatform()) {
            return null
        }

        const leaderboardId = this.leaderboardIds[level];

        try {
            const result = await CapacitorGameConnect.getUserTotalScore({
                leaderboardID: leaderboardId
            });

            return result.player_score;
        } catch (error) {
            console.error(`Failed to get ${level} score:`, error);
            return null
        }
    }

    async showLeaderboard(level: LeaderboardLevel): Promise<void> {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        const leaderboardId = this.leaderboardIds[level]

        try {
            await CapacitorGameConnect.showLeaderboard({
                leaderboardID: leaderboardId
            });
        } catch (error) {
            console.error(`Failed to open ${level} leaderboard:`, error);
        }
    }
}