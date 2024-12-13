export class StatsManager {
    async resetStats() {
      await chrome.storage.local.set({
        analyzedReviews: 0,
        suspiciousReviews: 0,
        settings: {
          autoAnalyze: false,
          notifyOnSuspicious: true
        }
      });
    }
  
    async updateStats(stats) {
      const currentStats = await chrome.storage.local.get([
        'analyzedReviews',
        'suspiciousReviews'
      ]);
      
      await chrome.storage.local.set({
        analyzedReviews: (currentStats.analyzedReviews || 0) + stats.analyzed,
        suspiciousReviews: (currentStats.suspiciousReviews || 0) + stats.suspicious
      });
    }
  }