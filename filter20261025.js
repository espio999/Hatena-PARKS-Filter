(function() {
  const extractCheckbox = document.getElementById("pf-extract-participation");
  const container = document.getElementById("parks-filter-panel");

  if (!container) return;

  const STORAGE_KEY_PARK = 'pf_park_kw';
  const STORAGE_KEY_AUTHOR = 'pf_author_kw';
  const STORAGE_KEY_CONTEXT = 'pf_context_kw';

  const applyBtn = document.getElementById("pf-apply");
  const resetBtn = document.getElementById("pf-reset");

  function getParentItem(node) {
    let current = node;
    while (current && current !== document.body) {
      if (current.tagName === "LI" || current.tagName === "ARTICLE" || 
         (current.className && typeof current.className === "string" && 
         (current.className.includes("item") || current.className.includes("Item")))) {
        return current;
      }
      current = current.parentElement;
    }
    return node.parentElement;
  }

  function getExtractedParticipationText() {
    const section = Array.from(document.querySelectorAll('div[class*="_section_"]')).find(el => {
      const title = el.querySelector('span[class*="_title_"]');
      return title && title.textContent.trim() === 'パーク';
    });

    if (section) {
      const textElements = section.querySelectorAll('span[class*="_text_"]');
      const texts = Array.from(textElements).map(el => el.textContent.trim());
      return texts.join(',') + ',';
    }
    return '';
  }

  function checkMatch(targetText, keyword, mode) {
    if (mode === "off") return true;
    const keywords = (keyword).split(/[,，]/).map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    if (keywords.length === 0) return true;
    const matched = keywords.some(k => targetText.includes(k));
    return mode === "include" ? matched : !matched;
  }

  function applyFilter() {
    const parkKw = ((extractCheckbox && extractCheckbox.checked) ? document.getElementById("pf-participation-kw").value : "") + document.getElementById("pf-park-kw").value;
    const parkMode = document.querySelector('input[name="pf-park-mode"]:checked').value;
    const authorKw = document.getElementById("pf-author-kw").value;
    const authorMode = document.querySelector('input[name="pf-author-mode"]:checked').value;
    const contextKw = ((extractCheckbox && extractCheckbox.checked) ? document.getElementById("pf-participation-kw").value : "") + document.getElementById("pf-context-kw").value;
    const contextMode = document.querySelector('input[name="pf-context-mode"]:checked').value;

    const items = new Set();
    document.querySelectorAll('[class*="_parkName_"],[class*="_authorName_"], [class*="_postContextRow_"]').forEach(el => items.add(getParentItem(el)));

    items.forEach(item => {
      if (!item) return;
      const parkEl = item.querySelector('[class*="_parkName_"]');
      const authorEl = item.querySelector('[class*="_authorName_"]');
      const contextEl = item.querySelector('[class*="_postContextRow_"]');

      const parkText = parkEl ? parkEl.textContent.trim().toLowerCase() : "";
      const authorText = authorEl ? authorEl.textContent.trim().toLowerCase() : "";
      const contextText = contextEl ? contextEl.textContent.trim().toLowerCase() : "";

      const isVisible = checkMatch(parkText, parkKw, parkMode) && 
                        checkMatch(authorText, authorKw, authorMode) && 
                        checkMatch(contextText, contextKw, contextMode);
      item.style.display = isVisible ? "" : "none";
    });
  }

  function applyReset() {
    if (extractCheckbox) extractCheckbox.checked = false;

    document.getElementById("pf-park-kw").value = "";
    document.querySelector('input[name="pf-park-mode"][value="off"]').checked = true;
    document.getElementById("pf-author-kw").value = "";
    document.querySelector('input[name="pf-author-mode"][value="off"]').checked = true;
    document.getElementById("pf-context-kw").value = "";
    document.querySelector('input[name="pf-context-mode"][value="off"]').checked = true;

    applyFilter();
  }

  function showParticipation(){
    const participationKwEl = document.getElementById("pf-participation-kw");
    if (participationKwEl) {
      participationKwEl.value = getExtractedParticipationText();
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY_PARK, document.getElementById("pf-park-kw")?.value || "");
    localStorage.setItem(STORAGE_KEY_AUTHOR, document.getElementById("pf-author-kw")?.value || "");
    localStorage.setItem(STORAGE_KEY_CONTEXT, document.getElementById("pf-context-kw")?.value || "");
  }

  function loadSettings() {
    const parkKwEl = document.getElementById("pf-park-kw");
    const authorKwEl = document.getElementById("pf-author-kw");
    const contextKwEl = document.getElementById("pf-context-kw");

    if (parkKwEl) parkKwEl.value = localStorage.getItem(STORAGE_KEY_PARK) || "";
    if (authorKwEl) authorKwEl.value = localStorage.getItem(STORAGE_KEY_AUTHOR) || "";
    if (contextKwEl) contextKwEl.value = localStorage.getItem(STORAGE_KEY_CONTEXT) || "";
  }

  function init(){
    loadSettings();
    showParticipation();
    applyFilter();
  }

  if (applyBtn) {
    applyBtn.onclick = () => {
      applyFilter();
      saveSettings();
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      applyReset();
      saveSettings();
      if (window.ParksFont) {
        window.ParksFont.reset();
      }
    };
  }

  let isUpdating = false;
  new MutationObserver(() => {
    if (!isUpdating) {
      isUpdating = true;
      requestAnimationFrame(() => {
        init();
        isUpdating = false;
      });
    }
  }).observe(document.body, { childList: true, subtree: true });

  init();
})();