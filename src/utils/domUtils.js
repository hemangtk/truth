export class DOMUtils {
  static getReviewsContainer() {
    return document.querySelector('.section-review-content, [data-review-container]');
  }

  static isReviewElement(node) {
    return node.nodeType === Node.ELEMENT_NODE && 
           (node.classList.contains('section-review') || 
            node.classList.contains('gm-review') ||
            node.hasAttribute('data-review-item'));
  }

  static extractReviewData(reviewNode) {
    return {
      text: this.getReviewText(reviewNode),
      rating: this.extractRating(reviewNode),
      authorProfile: this.extractAuthorProfile(reviewNode)
    };
  }

  static getReviewText(reviewNode) {
    const textElement = reviewNode.querySelector('.section-review-text, .review-text');
    return textElement?.textContent?.trim() || '';
  }

  static extractRating(reviewNode) {
    const ratingElement = reviewNode.querySelector('.section-review-stars, [data-rating]');
    return parseInt(ratingElement?.getAttribute('aria-label')?.split('/')[0] || 
           ratingElement?.getAttribute('data-rating') || '0');
  }

  static extractAuthorProfile(reviewNode) {
    return {
      name: reviewNode.querySelector('.section-review-title, .author-name')?.textContent?.trim() || '',
      reviewCount: parseInt(reviewNode.querySelector('.section-review-reviewer-stats, .author-reviews')?.textContent?.match(/\d+/)?.[0] || '0')
    };
  }

  static createReviewIndicator(analysis) {
    const indicator = document.createElement('div');
    indicator.className = `review-indicator ${analysis.classification}`;
    indicator.title = this.formatIndicatorTooltip(analysis);
    return indicator;
  }

  static formatIndicatorTooltip(analysis) {
    return `Classification: ${analysis.classification}\nReasons:\n${analysis.reasons.join('\n')}`;
  }
}