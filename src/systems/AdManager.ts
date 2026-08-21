import { AdMob } from "@capacitor-community/admob"
import { Capacitor } from "@capacitor/core"

class AdManager {
    private static instance: AdManager

    private initialized = false
    private rewardAdReady = false

    private readonly rewardAdId = "ca-app-pub-9551631345398184/2378864240"

    private constructor() {}

    static getInstance(): AdManager {
        if (!AdManager.instance) {
            AdManager.instance = new AdManager()
        }

        return AdManager.instance
    }

    async initialize() {
        if (this.initialized) return

        //Browser Fallback
        if (!Capacitor.isNativePlatform()) {
            this.initialized = true
            this.rewardAdReady = true
            return
        }

        try {
            await AdMob.initialize()
            this.initialized = true
            await this.loadRewardAd()
        } catch (error) {
            console.error("AdMob initialization failed:", error)
        }
    }

    async loadRewardAd() {
        if (!this.initialized || this.rewardAdReady) return
        try {
            await AdMob.prepareRewardVideoAd({
                adId: this.rewardAdId,
                isTesting: true,
            })
            this.rewardAdReady = true
        } catch (error) {
            console.error("Failed to load rewarded ad:", error)
        }
    }

    async showReviveAd(): Promise<boolean> {
        return this.showRewardAd()
    }

    async showRerollAd(): Promise<boolean> {
        return this.showRewardAd()
    }

    async showRewardAd(): Promise<boolean> {
        //Browser Fallback
        if (!Capacitor.isNativePlatform()) {
            return true
        }
        
        if (!this.rewardAdReady) {
            return false
        }
        //Mark next ad as not ready
        this.rewardAdReady = false
        try {
            const reward = await AdMob.showRewardVideoAd()
            //Prepare next ad
            this.loadRewardAd()

            if (reward && reward.amount > 0) {
                return true
            }
            return false

        } catch (error) {
            console.error("Rewarded ad failed:", error)
            //Try to get another ad
            this.loadRewardAd()
            return false
        }
    }
}

export default AdManager.getInstance()