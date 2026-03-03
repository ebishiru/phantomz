
export default class ScoreManager {
    constructor() {
    }

    getHiScore(): number {
        return Number(localStorage.getItem(`hiScore`) || 0)
    }

    getTotalScore(): number {
        return Number(localStorage.getItem(`totalScore`) || 0)
    }

    updateScore(score: number) {

        const currentHiScore = this.getHiScore()
        if (score > currentHiScore) {
            localStorage.setItem(`hiScore`, String(score))
        }

        const total = this.getTotalScore() + score
        localStorage.setItem(`totalScore`, String(total))
    }

    resetScores() {
        localStorage.removeItem(`hiScore`)
        localStorage.removeItem(`totalScore`)
    }
}