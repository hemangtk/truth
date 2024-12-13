import { ReviewAnalyzer } from './reviewAnalyzer.js';
import { DOMUtils } from '../utils/domUtils.js';
import { MessageTypes } from '../utils/constants.js';

export class ReviewObserver {
  constructor() {
    this.observer = null;
    this.isAnalyzing = false;
    this.reviewsContainer = null;
    this.init();
  }

  init() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === MessageTypes.START_ANALYSIS) {
        this.start();
      } else if (message.action === MessageTypes.STOP_ANALYSIS) {
        this.stop();
      }
    });
  }

  start() {
    if (this.isAnalyzing) return;
    
    this.isAnalyzing = true;
    this.reviewsContainer = DOMUtils.getReviewsContainer();
    
    if (this.reviewsContainer) {
      this.observeReviews();
      this.processExistingReviews();
    }
  }

  stop() {
    this.isAnalyzing = false;
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    // Remove all indicators when stopping
    document.querySelectorAll('.review-indicator').forEach(el => el.remove());
  }

  observeReviews() {
    if (!this.reviewsContainer) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          this.processNewReviews(Array.from(mutation.addedNodes));
        }
      });
    });

    this.observer.observe(this.reviewsContainer, {
      childList: true,
      subtree: true
    });
  }

  async processExistingReviews() {
    if (!this.isAnalyzing || !this.reviewsContainer) return;

    const existingReviews = Array.from(document.querySelectorAll('.section-review, .gm-review'));
    for (const review of existingReviews) {
      await this.processReview(review);
    }
  }

  async processNewReviews(nodes) {
    if (!this.isAnalyzing) return;

    for (const node of nodes) {
      if (DOMUtils.isReviewElement(node)) {
        await this.processReview(node);
      }
    }
  }

  async processReview(reviewNode) {
    if (reviewNode.querySelector('.review-indicator')) return;
    
    const reviewData = DOMUtils.extractReviewData(reviewNode);
    const analysis = await ReviewAnalyzer.analyzeReview(reviewData);
    this.highlightReview(reviewNode, analysis);
    this.updateStats(analysis);
  }

  highlightReview(reviewNode, analysis) {
    const indicator = DOMUtils.createReviewIndicator(analysis);
    reviewNode.insertBefore(indicator, reviewNode.firstChild);
  }

  updateStats(analysis) {
    chrome.runtime.sendMessage({
      type: MessageTypes.UPDATE_STATS,
      stats: {
        analyzed: 1,
        suspicious: analysis.classification !== 'genuine' ? 1 : 0
      }
    });
  }
}