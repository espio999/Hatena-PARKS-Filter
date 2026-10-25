(function() {
  const summarizeBtn = document.getElementById("pf-ai-summarize");
  const associationBtn = document.getElementById("pf-ai-search");
  const resultDiv = document.getElementById("pf-ai-result");

  const messageTable = new Map();
  messageTable.set("browserNotSupported", 'AI非対応ブラウザ（Chrome専用）');
  messageTable.set("downloading", `ダウンロード進捗: ${e.loaded} / ${e.total}`);
  messageTable.set("summarizing", "要約中...");
  messageTable.set("generating", "Gemini Nanoで要約を生成しています...");
  messageTable.set("noPost", "要約対象となる投稿が画面に見当たりません。");
  messageTable.set("aiUnavailable", "利用不可");
  messageTable.set("errorOccured", "要約の処理中にエラーが発生しました: ");
  messageTable.set("summarizeBtn", "タイムラインを要約する");
  messageTable.set("associationBtn", "参加中のパークから連想");

  //AIプロンプト
  messageTable.set("summaryPrompt", `以下のタイムラインの投稿内容を要約し、キーポイントを3つの箇条書きで出力してください。\n\n- ${visibleContexts.join("\n- ")}`);
  messageTable.set("associationPrompt", `以下のCSVデータから連想される、表面上は結びつかないが本質を突く表現を一つ想像してください。その表現を一つの単語として出力してください。出力は単語だけにしてください。\n\n${csvLine}`);

  
  const MODEL_OPTIONS = {
    expectedInputLanguages: ['ja'],
    expectedOutputs: [{ type: 'text', languages: ['ja'] }]
  };
  
  let isAiSupported = null;

  function setAiUnsupported(){
    if (!summarizeBtn) return;
    summarizeBtn.disabled = true;
    summarizeBtn.style.background = "#ccc";
    summarizeBtn.textContent = messageTable.get("browserNotSupported");
  }

  async function initAiSummarizer() {    
    if (!summarizeBtn || !resultDiv) return;
    isAiSupported = await LanguageModel.availability(MODEL_OPTIONS);
    
    if (isAiSupported === "unavailable") {
      setAiUnsupported();
    }
  }

  async function downloadAi(){
    const session = await LanguageModel.create({
      ...MODEL_OPTIONS,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          //console.log(`ダウンロード進捗: ${e.loaded} / ${e.total}`);
          console.log(messageTable.get("downloading"));
        });
      }
    });
    return session;
  }

  async function startAiSession(prompt){
    let session;

    switch (isAiSupported){
      case "available":
        session = await LanguageModel.create(MODEL_OPTIONS);
        break;
      case "downloadable":
        session = await downloadAi();
        break;
      default:
        throw new Error(messageTable.get("aiUnvailable"));
    }

    const textContent = await session.prompt(prompt);
    session.destroy();
    return textContent;
  }

  async function runAiSummary(){
    summarizeBtn.disabled = true;
    summarizeBtn.textContent = messageTable.get("summarizing");
    resultDiv.style.display = "block";
    resultDiv.textContent = messageTable.get("generating");

    try {
      const visibleContexts = Array.from(document.querySelectorAll('[class*="_postContextRow_"]'))
        .filter(el => {
          let parent = el;
          while (parent && parent !== document.body) {
            if (parent.style && parent.style.display === "none") return false;
            parent = parent.parentElement;
          }
          return true;
        })
        .slice(0, 15)
        .map(el => el.textContent.trim())
        .filter(text => text.length > 0);

      if (visibleContexts.length === 0) {
        resultDiv.textContent = messageTable.get("noPost");
        return;
      }

      const promptText = messageTable.get("summaryPrompt");      
      resultDiv.textContent = await startAiSession(promptText);
    } catch (err) {
      console.error(err);
      resultDiv.textContent = messageTable.get("errorOccured") + err.message;
    } finally {
      summarizeBtn.disabled = false;
      summarizeBtn.textContent = messageTable.get("summarizeBtn");
    }
  }

  async function runAiAssociation(){
    associationBtn.disabled = true;
    associationBtn.textContent = messageTable.get("summarizing");

    const csvLine = document.getElementById("pf-participation-kw")?.value || "";
    const promptText = messageTable.get("associationPrompt");

    try {
      const searchBox = document.querySelector('[class*="_searchInput_"]');
      if (searchBox) {
        searchBox.value = await startAiSession(promptText);
        searchBox.dispatchEvent(new Event('input', { bubbles: true }));
        searchBox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      associationBtn.disabled = false;
      associationBtn.textContent = messageTable.get("associationBtn");
    }
  }

  if (summarizeBtn) summarizeBtn.onclick = runAiSummary;
  if (associationBtn) associationBtn.onclick = runAiAssociation;

  initAiSummarizer();
})();