(async function(){
  const cacheBuster = `?t=${Date.now()}`;
  const GitHubURL = `https://espio999.github.io/Hatena-PARKS-Filter/`;
  const jsDelivrURL = `https://cdn.jsdelivr.net/gh/espio999/Hatena-PARKS-Filter@main/`;

  const panelCSS_prod = `panel.css`;
  const panelHTML_prod = `panel.html`;
  const panelScript_prod = `panel_compiled.js`;
  const filterScript_prod = `filter_compiled.js`;
  const fontScript_prod = `font_compiled.js`;
  const aiScript_prod = `ai_compiled.js`;

  const panelCSS_test = `panel20261025.css`;
  const panelHTML_test = `panel20261025.html`;
  const panelScript_test = `panel20261025.js`;
  const filterScript_test = `filter20261025.js`;
  const fontScript_test = `font20261025.js`;
  const aiScript_test = `ai20261025.js`;

  // テスト用 or 本番用の切り替え
  const isProd = false; 
  const baseURL = isProd ? jsDelivrURL : GitHubURL;
  const panelCSS = isProd ? panelCSS_prod : panelCSS_test;
  const panelHTML = isProd ? panelHTML_prod : panelHTML_test;
  const CSS_URL = `${baseURL}${panelCSS}${cacheBuster}`;
  const HTML_URL = `${GitHubURL}${panelHTML}${cacheBuster}`;

  const panelScript = isProd ? panelScript_prod : panelScript_test;
  const filterScript = isProd ? filterScript_prod : filterScript_test;
  const fontScript = isProd ? fontScript_prod : fontScript_test;
  const aiScript = isProd ? aiScript_prod : aiScript_test;

  const panel = document.getElementById("parks-filter-panel");

  const messageTable = new Map();
  messageTable.set("htmlError", 'HTMLの取得に失敗しました');
  messageTable.set("loadError", 'フィルターパネルのロードエラー:');

  // 既にパネルが存在する場合は表示・非表示を切り替え
  if (panel) {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    return;
  }

  // CSSの読み込み
  if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_URL;
    document.head.appendChild(link);
  }

  try {
    // HTMLの非同期取得とDOMへの挿入
    const response = await fetch(HTML_URL);
    if (!response.ok) throw new Error(messageTable.get("htmlError"));
    const htmlText = await response.text();

    const container = document.createElement("div");
    container.id = "parks-filter-panel";
    container.innerHTML = htmlText;
    document.body.appendChild(container);

    // 各機能スクリプトの動的読み込み
    const loadScript = (filename) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `${baseURL}${filename}${cacheBuster}`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    await loadScript(panelScript);
    await loadScript(filterScript);
    await loadScript(fontScript);
    await loadScript(aiScript);

  } catch (err) {
    console.error(messageTable.get("loadError"), err);
  }
})();