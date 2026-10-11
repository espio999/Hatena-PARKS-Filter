# Hatena PARKS Filter (Bookmarklet)

<img width="285" height="466" alt="top" src="https://github.com/user-attachments/assets/5c4373a7-6839-4fe1-89b2-f81ee6f298b0" />

「Hatena PARKS」向けのフィルタリング用ブックマークレットです。
ページ内のコンテンツを**パーク名**・**スレッド名**・**投稿者**で絞り込んだり、除外（ミュート）したりすることができます。
ブックマークレットはPCだけでなく、タブレットやスマートフォンでも動作します。

---

## ✨ 主な機能

- **フィルタリング**
  - **パーク名** (`_parkName`)：ホーム（注目のスレッド）、新着スレッドに対応
  - **投稿者**：タイムライン（β）、マイタイムラインでの絞り込みに対応
  - **コンテキスト** (`_postContext`)：タイムライン（β）、マイタイムラインに対応
- **参加中パークの自動キーワード生成**
  - ブックマークレットが参加中のパークを参照し、自動的にフィルタ用キーワードを生成。「参加抽出を付与する」チェックボックスで簡単に連動可能です。
- **柔軟な動作モード（絞り込み・除外）**
  - 指定キーワードを含む項目のみを表示する「絞り込み」や、不要な項目を非表示にする「除外」を切り替え可能。
- **複数キーワード対応**
  - カンマ区切りで複数のキーワードを同時に指定できます。
- **ドラッグ移動**
  - ヘッダー部分をドラッグすることで、操作パネルを画面上の好きな位置へ移動可能。
- **パネルの表示/非表示**: ブックマークレットを再度クリックするか、パネル右上の `✕` ボタンを押します。
- **自動アップデート機構**
  - パネル最下部のバージョン番号（日付）により更新を把握。小規模な更新はブックマークレット自体を更新しなくても自動的に反映されます。

---

## 📌 対応ページと使い方・応用例

ページの種類によって利用可能なフィルターが異なります。

| フィルター項目 | 対応ページ | 備考・入力例 |
| :--- | :--- | :--- |
| **パーク名** | ・ホーム（注目のスレッド）<br>・新着スレッド | 特定のパーク名で絞り込み・除外を行います。 |
| **投稿者** | ・タイムライン（β）<br/ >・マイタイムライン | 投稿者のユーザー名で絞り込み・除外を行います。 |
| **コンテキスト** | ・タイムライン（β）<br/ >・マイタイムライン | **「パーク名」** や **「スレッド名」** を入力して使用します。 |

> 💡 **カンマ区切りでの複数指定**  
> キーワード入力欄にカンマ（`,` または `，`）を入れることで、複数のキーワードを同時に指定できます。

---

## 🚀 使い方

### ブックマークレットの登録

1. ブラウザのブックマークに新しいブックマークを追加し、名前を「`PARKS Filter`」（お好みの名前）に設定します。
2. URL欄に、以下のコードをコピー＆ペーストして保存します。

```javascript
javascript:(async%20function()%7Bvar%20e=%60?t=$%7BDate.now()%7D%60,b=%60https://cdn.jsdelivr.net/gh/espio999/Hatena-PARKS-Filter@main/panel.css$%7Be%7D%60,g=%60https://espio999.github.io/Hatena-PARKS-Filter/panel.html$%7Be%7D%60,a=document.getElementById(%22parks-filter-panel%22);if(a)a.style.display=a.style.display===%22none%22?%22block%22:%22none%22;else%7Bdocument.querySelector(%60link%5Bhref=%22$%7Bb%7D%22%5D%60)%7C%7C(a=document.createElement(%22link%22),a.rel=%22stylesheet%22,a.href=b,document.head.appendChild(a));try%7Blet%20c=await%20fetch(g);if(!c.ok)throw%20Error(%22HTML%5Cu306e%5Cu53d6%5Cu5f97%5Cu306b%5Cu5931%5Cu6557%5Cu3057%5Cu307e%5Cu3057%5Cu305f%22);%0Alet%20h=await%20c.text(),f=document.createElement(%22div%22);f.id=%22parks-filter-panel%22;f.innerHTML=h;document.body.appendChild(f);b=k=%3Enew%20Promise((l,m)=%3E%7Bvar%20d=document.createElement(%22script%22);d.src=%60https://cdn.jsdelivr.net/gh/espio999/Hatena-PARKS-Filter@main/$%7Bk%7D$%7Be%7D%60;d.onload=l;d.onerror=m;document.head.appendChild(d)%7D);await%20b(%22panel_compiled.js%22);await%20b(%22filter_compiled.js%22)%7Dcatch(c)%7Bconsole.error(%22%5Cu30d5%5Cu30a3%5Cu30eb%5Cu30bf%5Cu30fc%5Cu30d1%5Cu30cd%5Cu30eb%5Cu306e%5Cu30ed%5Cu30fc%5Cu30c9%5Cu30a8%5Cu30e9%5Cu30fc:%22,c)%7D%7D%7D)();
```

### 詳細はブログを参照

[はてなパークス・フィルタ Ver.20261011／Hatena PARKS Filter Ver.20261011](https://impsbl.hatenablog.jp/entry/HatenaParksFilter20261011)

---

## 📜 ライセンス (License)

本プロジェクトは **GNU General Public License (GPL-3.0)** のもとで公開されています。  
詳細は [LICENSE](./LICENSE) ファイルをご確認ください。
