import { Capacitor } from "@capacitor/core";
import { registerPlugin } from "@capacitor/core";
import { CapacitorGameConnect } from "@osmanraifgunes/capacitor-game-connect";

export type LeaderboardLevel = "cave" | "snow" | "tower";

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
}

interface GoogleTopScoresPlugin {
    loadTopScores(options: { leaderboardID: string }): Promise<{ scores: LeaderboardEntry[] }>;
}

const GoogleTopScores = registerPlugin<GoogleTopScoresPlugin>("GoogleTopScores");

const SAMPLE_TOP_SCORES: Record<LeaderboardLevel, LeaderboardEntry[]> = {
    cave: [
        { rank: 1, name: "Nightshade", score: 3500 },
        { rank: 2, name: "Moonwalker", score: 3040 },
        { rank: 3, name: "Gravekeeper", score: 2580 },
        { rank: 4, name: "PhantomFox", score: 2210 },
        { rank: 5, name: "Duskwalker", score: 1940 },
        { rank: 6, name: "VoidRunner", score: 1770 },
        { rank: 7, name: "CryptKnight", score: 1400 },
        { rank: 8, name: "AshenOne", score: 1230 },
        { rank: 9, name: "BoneSinger", score: 765 },
        { rank: 10, name: "LanternWisp", score: 420 }
    ],
    snow: [
        { rank: 1, name: "Frostbite", score: 3300 },
        { rank: 2, name: "Icebound", score: 2930 },
        { rank: 3, name: "Snowblind", score: 2660 },
        { rank: 4, name: "WhiteWalker", score: 2390 },
        { rank: 5, name: "Glacier", score: 2020 },
        { rank: 6, name: "ColdSnap", score: 1850 },
        { rank: 7, name: "Winterborn", score: 1480 },
        { rank: 8, name: "Icicle", score: 1110 },
        { rank: 9, name: "RimeLord", score: 740 },
        { rank: 10, name: "Sleet", score: 370 }
    ],
    tower: [
        { rank: 1, name: "Skybreaker", score: 3420 },
        { rank: 2, name: "HighClimber", score: 3030 },
        { rank: 3, name: "Stormbound", score: 2760 },
        { rank: 4, name: "CloudReaper", score: 2490 },
        { rank: 5, name: "PeakSeeker", score: 2120 },
        { rank: 6, name: "ThunderZ", score: 1850 },
        { rank: 7, name: "Rooftop", score: 1480 },
        { rank: 8, name: "WindWalker", score: 1110 },
        { rank: 9, name: "BellTower", score: 640 },
        { rank: 10, name: "Updraft", score: 290 }
    ]
};

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

    async getTopScores(level: LeaderboardLevel): Promise<LeaderboardEntry[]> {
        if (!Capacitor.isNativePlatform()) {
            return SAMPLE_TOP_SCORES[level];
        }

        try {
            const result = await GoogleTopScores.loadTopScores({
                leaderboardID: this.leaderboardIds[level]
            });

            return result.scores;
        } catch (error) {
            console.error(`Failed to get top ${level} scores:`, error);
            return [];
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