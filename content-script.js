function analyzeReview(text) {
    // This is a placeholder for the actual review analysis logic
    // In a real implementation, this would use more sophisticated techniques
    if (text.length < 20) return 'suspicious';
    if (text.includes('Small shop')) return 'fake';
    return 'genuine';
}

function createStatusIcon(status) {
    const icon = document.createElement('span');
    icon.className = `status-icon ${status}`;
    icon.textContent = status === 'genuine' ? '✓' : '!';
    return icon;
}

function createReasonTooltip(status) {
    const tooltip = document.createElement('div');
    tooltip.className = 'reason-tooltip';
    tooltip.textContent = getReasonText(status);
    return tooltip;
}

function getReasonText(status) {
    switch (status) {
        case 'fake':
            return 'This review contains language commonly found in fake reviews.';
        case 'suspicious':
            return 'This review lacks detail and may not be genuine.';
        case 'genuine':
            return 'This review appears to be genuine based on its content and specificity.';
    }
}

function highlightReviews() {
    const reviews = document.querySelectorAll('.wiI7pd,.OA1nbd');
    let counts = { fake: 0, suspicious: 0, genuine: 0 };
    
    reviews.forEach((review) => {
        const status = analyzeReview(review.textContent);
        counts[status]++;
        
        const highlightClass = `review-highlight-${status}`;
        review.classList.add(highlightClass);
        
        const statusIcon = createStatusIcon(status);
        review.parentElement.insertBefore(statusIcon, review);
        
        const reasonTooltip = createReasonTooltip(status);
        review.parentElement.appendChild(reasonTooltip);
    });

    return counts;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "startAnalysis") {
            const counts = highlightReviews();
            sendResponse(counts);
        }
    }
);

