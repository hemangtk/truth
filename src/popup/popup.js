import { updateStats } from './statsManager.js';
import { MessageTypes } from '../utils/constants.js';

let isAnalyzing = false;

document.addEventListener('DOMContentLoaded', () => {
  const startAnalysisButton = document.getElementById('start-analysis');
  
  // Load initial stats
  chrome.storage.local.get(['analyzedReviews', 'suspiciousReviews'], (result) => {
    updateStats(result.analyzedReviews || 0, result.suspiciousReviews || 0);
  });

  startAnalysisButton.addEventListener('click', () => {
    isAnalyzing = !isAnalyzing;
    updateButtonState(startAnalysisButton, isAnalyzing);
    
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: isAnalyzing ? MessageTypes.START_ANALYSIS : MessageTypes.STOP_ANALYSIS
        });
      }
    });
  });
});

function updateButtonState(button, analyzing) {
  button.textContent = analyzing ? 'Stop Analysis' : 'Start Analysis';
  button.classList.toggle('analyzing', analyzing);
}