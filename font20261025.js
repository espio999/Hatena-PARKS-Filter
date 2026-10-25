(function() {
  const MIN_SCALE = 0.7; 
  const MAX_SCALE = 1.3; 
  const STEP = 0.1;      
  const DEFAULT_SCALE = 1.0; 

  let currentScale = DEFAULT_SCALE;

  const shrinkBtn = document.getElementById('pf-font-shrink');
  const enlargeBtn = document.getElementById('pf-font-enlarge');
  const displaySpan = document.getElementById('pf-font-size-display');

  function updateFontSize(newScale) {
    const targets = document.querySelectorAll('[class*="_body_"], [class*="_body_"] p');

    if (newScale === DEFAULT_SCALE) {
      targets.forEach(element => {
        element.style.fontSize = '';
      });
      currentScale = DEFAULT_SCALE;
      if (displaySpan) {
        displaySpan.textContent = `${Math.round(currentScale * 100)}%`;
      }
      return;
    }

    currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    currentScale = Math.round(currentScale * 10) / 10;

    const percentage = Math.round(currentScale * 100);
    if (displaySpan) {
      displaySpan.textContent = `${percentage}%`;
    }

    targets.forEach(element => {
      element.style.fontSize = `${percentage}%`;
    });
  }

  if (shrinkBtn) {
    shrinkBtn.onclick = () => updateFontSize(currentScale - STEP);
  }

  if (enlargeBtn) {
    enlargeBtn.onclick = () => updateFontSize(currentScale + STEP);
  }

  // グローバルに公開してリセット等から呼び出せるようにする
  window.ParksFont = {
    reset: () => updateFontSize(DEFAULT_SCALE),
    getCurrentScale: () => currentScale
  };
})();