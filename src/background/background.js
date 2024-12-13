import { StatsManager } from './statsManager.js';

const statsManager = new StatsManager();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    statsManager.resetStats();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateStats') {
    statsManager.updateStats(message.stats);
  }
});