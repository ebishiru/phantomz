export interface LeaderboardEntry {
    name: string;
    score: number;
}

export type LeaderboardLevel = "cave" | "snow" | "tower"

export default class LeaderboardManager {

    private static instance: LeaderboardManager;

    private readonly STORAGE_KEY = "phantomz_leaderboards";
    private readonly MAX_ENTRIES = 10;

    private leaderboards: Record<LeaderboardLevel, LeaderboardEntry[]> = {
        cave: [],
        snow: [],
        tower: [],
    }

    private constructor() {
        this.load();
    }

    public static getInstance(): LeaderboardManager {
        if (!LeaderboardManager.instance) {
            LeaderboardManager.instance = new LeaderboardManager();
        }

        return LeaderboardManager.instance;
    }

    private load(): void {
        const data = localStorage.getItem(this.STORAGE_KEY);

        if (!data) return

        try {
            const parsed = JSON.parse(data)

            this.leaderboards = {
                cave: parsed.cave ?? [],
                snow: parsed.snow ?? [],
                tower: parsed.tower ?? [],
            };
        } catch (error) {
            console.error("Failed to load leaderboards:", error);
        }
    }

    private save(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.leaderboards))
    }

    getLeaderboard(level: LeaderboardLevel): LeaderboardEntry[] {
        return [...this.leaderboards[level]];
    }

    submitScore( level: LeaderboardLevel, name: string, score: number): boolean {
        const entries = this.leaderboards[level];

        entries.push({ name , score});

        entries.sort((a,b) => b.score - a.score);

        const isTop10 = entries.indexOf(
            entries.find(entry =>
                entry.name === name &&
                entry.score === score
            )! 
        ) < this.MAX_ENTRIES;

        this.leaderboards[level] = entries.slice(0, this.MAX_ENTRIES);

        this.save();

        return isTop10
    }

    getRank( level: LeaderboardLevel, name: string, score: number): number {
        const entries = this.leaderboards[level];

        return entries.findIndex(entry => entry.name === name && entry.score === score) + 1;
    }

    clearLeaderboard(level: LeaderboardLevel): void {
        this.leaderboards[level] = [];
        this.save();
    }
}