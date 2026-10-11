(function() {
  // ドラッグ可能にする関数
  function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onpointerdown = dragPointerDown;

    function dragPointerDown(e) {
      e = e || window.event;

      // インタラクティブ要素（ボタン、入力欄など）ではドラッグを開始しない
      if (e.target.closest('#pf-close, button, input, select, textarea')) {
        return;
      }

      e.preventDefault();

      if (handle.setPointerCapture) {
        handle.setPointerCapture(e.pointerId);
      }

      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onpointermove = elementDrag;
      document.onpointerup = closeDragElement;
      document.onpointercancel = closeDragElement;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement(e) {
      if (handle.releasePointerCapture && e && e.pointerId) {
        try {
          handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      document.onpointermove = null;
      document.onpointerup = null;
      document.onpointercancel = null;
    }
  }

  // パネルの初期化（ドラッグ有効化・閉じるボタン等）
  const panel = document.getElementById("parks-filter-panel");
  if (panel) {
    const header = panel.querySelector(".pf-header");
    if (header) {
      makeDraggable(panel, header);
    }

    const closeBtn = document.getElementById("pf-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        panel.style.display = "none";
      };
    }
  }
})();