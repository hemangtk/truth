document.addEventListener('DOMContentLoaded', function() {
    const startAnalysisButton = document.getElementById('startAnalysis');
    const instructions = document.getElementById('instructions');
    const results = document.getElementById('results');
    const fakeCount = document.getElementById('fakeCount');
    const suspiciousCount = document.getElementById('suspiciousCount');
    const genuineCount = document.getElementById('genuineCount');

    function startAnalysis() {
        startAnalysisButton.disabled = true;
        startAnalysisButton.textContent = 'Analyzing...';
        instructions.classList.add('hidden');
        results.classList.add('hidden');

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "startAnalysis"}, function(response) {
                fakeCount.textContent = response.fake;
                suspiciousCount.textContent = response.suspicious;
                genuineCount.textContent = response.genuine;

                results.classList.remove('hidden');
                startAnalysisButton.textContent = 'Start Analysis';
                startAnalysisButton.disabled = false;
            });
        });
    }

    startAnalysisButton.addEventListener('click', startAnalysis);
});

