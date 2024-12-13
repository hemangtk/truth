export function updateStats(analyzed, suspicious) {
    document.getElementById('analyzed-count').textContent = analyzed;
    document.getElementById('suspicious-count').textContent = suspicious;
  }