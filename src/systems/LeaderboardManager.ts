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

    initializeSampleData(): void {

        const isEmpty = 
        this.leaderboards.cave.length === 0 &&
        this.leaderboards.snow.length === 0 &&
        this.leaderboards.tower.length === 0;
        
        if (!isEmpty) return

        this.leaderboards.cave = [
        { name: "Champion", score: 2500 },
        { name: "Elite", score: 2000 },
        { name: "Warrior", score: 1500 },
        { name: "Squire", score: 1000 },
        { name: "Recruit", score: 500 },
        ];

        this.leaderboards.snow = [
            { name: "Archmage", score: 2500 },
            { name: "Sorceror", score: 2000 },
            { name: "Mystic", score: 1500 },
            { name: "Apprentice", score: 1000 },
            { name: "Novice", score: 500 },
        ];

        this.leaderboards.tower = [
            { name: "Assassin", score: 2500 },
            { name: "Shadow", score: 2000 },
            { name: "Stalker", score: 1500 },
            { name: "Rogue", score: 1000 },
            { name: "Pickpocket", score: 500 },
        ];

        this.save();
    }
}