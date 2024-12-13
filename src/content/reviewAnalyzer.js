export class ReviewAnalyzer {
    static SUSPICIOUS_PATTERNS = [
      /(?:great|awesome|amazing|excellent)\s+(?:product|service|experience)/i,
      /(?:highly|definitely)\s+recommend/i,
      /(?:!{2,}|\?{2,})/,
    ];
  
    static async analyzeReview(review) {
      const text = review.text;
      const rating = review.rating;
      const authorProfile = review.authorProfile;
      
      let score = 100;
      let reasons = [];
  
      // Pattern analysis
      ReviewAnalyzer.SUSPICIOUS_PATTERNS.forEach(pattern => {
        if (pattern.test(text)) {
          score -= 20;
          reasons.push('Contains promotional or generic language');
        }
      });
  
      // Length analysis
      if (text.length < 20) {
        score -= 30;
        reasons.push('Review is too short');
      }
  
      // Punctuation analysis
      if ((text.match(/!!/g) || []).length > 2) {
        score -= 15;
        reasons.push('Excessive punctuation');
      }
  
      return {
        score,
        reasons,
        classification: this.getClassification(score)
      };
    }
  
    static getClassification(score) {
      if (score > 80) return 'genuine';
      if (score > 50) return 'suspicious';
      return 'fake';
    }
  }