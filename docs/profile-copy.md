# 個人資料文案（單一來源）

iThome、LinkedIn 等外部平台的自我介紹文案集中放在這裡，避免每次要更新時還得從對話紀錄裡翻。

**這份檔案不會被建置流程讀取**，也不影響網站，純粹是文案的 single source of truth。

## 貼在哪個欄位

| iThome 欄位 | 對應章節 | 這個欄位只講一件事 |
|---|---|---|
| 專業成就 | [一](#一專業成就) | 可驗證的**證明**：認證、著作、演講、榮譽、連結 |
| 專業簡介 | [二](#二專業簡介) | **會什麼**：技術棧、做過的系統、參與的專案 |
| 工作經歷／學經歷 | [三](#三工作經歷--學經歷) | **走過什麼路**：公司 × 年份時間軸 |
| 自我介紹 | [四](#四自我介紹) | **你是誰**：生平、個性、興趣、為什麼寫 |

四個欄位會出現在同一頁，**刻意不重複**。前一版把「現職」「學歷」「入行年」寫在兩三個地方，
頁面變得又長又像在灌內容，2026-11-13 已整輪去重（總字數減約 35%）。

---

## 一、專業成就

```markdown
**認證**

- **NVIDIA Certified Professional（NCP）| AI Infrastructure** — 專業級認證最高階
  另四張 Associate：Generative AI LLMs、Generative AI Multimodal、
  AI Infrastructure and Operations、Accelerated Data Science
- NVIDIA DLI 認證講師（2021）｜講授 DLI 官方課程：深度學習基礎
- DLI 進階課程進修：Generative AI with Diffusion Models、Building RAG Agents with LLMs

**著作**

- 《圖像生成式 AI 的生存指南：以 Stable Diffusion 為例》— 繁中第一本圖像生成式 AI 專書
- 《以膠囊網路做印刷電路板影像的瑕疵檢測》

**演講**

- 13 場技術演講與公開課：與 NVIDIA 共同發表膠囊網路（A100）與 ConvNeXt + TAO 兩場，
  以及 AIA 年會 vLLM 推論加速、TPMS 精準醫學工作坊、Intel 數據中心大會、
  數據湖大會、TAIA AI Talk

**榮譽**

- 113 年度 AIGO 潛力新星盃 特優獎（Top 1）
- 第 11 屆與 2023 年 iThome 鐵人賽完賽

**技術文章**

- [Kubernetes 三十天（30 篇）](https://nickzhuang.com/series/ironman-2019/)
- [AIGC 三十天（30 篇）](https://nickzhuang.com/series/ironman-2023/)
- [完整證書牆](https://nickzhuang.com/certificates/)
- [個人技術部落格](https://nickzhuang.com)

**聯絡**

- [LinkedIn](https://www.linkedin.com/in/nick-zhuang/)｜[GitHub](https://github.com/nickzhuang1)
```

> 「講授」與「進修」**必須分開寫**。`certifications` 只能證明完課，不能證明開過那門課
> —— 詳見[六、撰寫原則](#六撰寫原則)。

---

## 二、專業簡介

```markdown
**擅長技術**

- **AI Infrastructure**：Kubernetes（EKS / GKE）、Docker、Helm、GPU 資源排程與多租戶隔離
- **生成式 AI**：Stable Diffusion / LoRA / ControlNet、RAG、LLM 推論加速（vLLM）、NVIDIA TAO
- **深度學習**：PyTorch、TensorFlow / Keras
- **監控維運**：Prometheus、Grafana、Node Exporter、CI/CD
- **程式語言**：Python、Shell Script、JavaScript（React / MUI）
- **雲端平台**：AWS（EKS / EC2 / S3 / EBS / EFS）、Google Cloud（GKE）
- **作業系統**：Linux、macOS、Windows

**製作的成品**

- **企業級 AI 雲平台** — 多租戶架構，涵蓋模型訓練、推論服務與資源監控
- **AI 模型訓練平台** — 資料準備、訓練到部署的內部平台
- **資源監控系統** — 叢集與節點層級指標收集與告警
- **區塊鏈礦場管理系統**
- **個人技術部落格** — React + 靜態預渲染，部署於 Cloudflare Workers

**參與的專案**

- **PCB 瑕疵檢測** — 膠囊網路（Capsule Network）影像辨識
- **Covid-19 檢測** — 基於 NVIDIA A100 的膠囊網路訓練與檢測
- **品牌商品屬性自動分類及顧客消費預測** — AIGO 潛力新星盃 特優（Top 1）
- **企業 AI 基礎建設規劃** — 網路底層、算力到應用層的完整藍圖
- **生醫 RAG 應用** — TPMS 精準醫學 AI 工作坊
```

> 勞動部這個欄位的說明包含「參加過的技術活動」，但演講清單已在專業成就，
> 這裡不重複（原本重複一次，佔了 4 行）。

---

## 三、工作經歷／學經歷

```markdown
**工作經歷**

- **承羽智慧（C.Y. Intelligence）— 技術長**｜2023/01 – 現在
  - 企業級 AI 雲平台架構與落地：多租戶、模型訓練、推論、資源監控
  - 混合雲架構規劃與雲地整合，支援在地模型部署
  - 技術團隊組建與架構決策

- **承啟科技（上市公司）— 應用發展部 Tech Lead**｜2018/06 – 2022/12
  - 帶領 5 人軟體開發團隊，導入 Scrum
  - AI 模型訓練平台開發與優化、資源監控系統
  - 協助子公司從零建立軟體開發團隊

- **聯策科技 — Software Engineer**｜2017/12 – 2018/05
  - 區塊鏈軟硬整合（礦場管理系統）、人臉辨識應用

- **福華資訊科技 — Engineer**｜2013/12 – 2017/04
  - CAM 程式開發與維護：PCB 製程輔助、Gerber 編輯／量測
  - 程式模組化、PCB IC 載板模組

**學歷**

- 國立中央大學 資訊工程研究所 碩士｜2016 – 2023（在職進修）
- 國立中興大學 應用數學系 學士

**合計 13 年軟體開發經驗**（2013 年 12 月入行，橫跨製造、區塊鏈、AI 平台）
```

---

## 四、自我介紹

```markdown
2013 年入行寫程式，做過 PCB 製造的 CAM 系統、區塊鏈軟硬整合，之後一路走到 AI 平台架構。
現在是承羽智慧技術長，帶著團隊把企業級 AI 雲平台從零蓋起來。

相信「講得出來才算真的懂」，所以把踩過的坑都寫成文章：2019 與 2023 兩屆鐵人賽各 30 篇，
加上近年 AI 基礎建設、NVIDIA 認證準備、自架部落格的實務紀錄，都在 [nickzhuang.com](https://nickzhuang.com)。

工作之外喜歡手沖咖啡、古典音樂、重量訓練與組裝模型。

聯絡：nickzhuang1@gmail.com
```

> 原版是 `Burning my soul to define the road map of life!` + email，只有標語、沒有回答
> 「你是誰、在寫什麼」。而且 `!` 與 `Contact` 之間有一個零寬空格（`U+200B`），部分平台會斷行異常。

---

## 五、跨平台一致性檢查

Google 做實體辨識時，靠的是「同一個名字、同一組事實」在多個獨立頁面反覆出現。
以下五項在三處（iThome／LinkedIn／本站 About）**必須完全一致**：

| 項目 | 現值 |
|---|---|
| 姓名 | 莊翔甯 / Nick Zhuang |
| 現職 | 承羽智慧 技術長（C.Y. Intelligence, CTO）|
| 最高學歷 | 國立中央大學 資訊工程研究所 碩士 |
| 最高認證 | NVIDIA Certified Professional \| AI Infrastructure |
| 個人網站 | `https://nickzhuang.com`（**不要寫 www**，www 會 301）|

本站的資料來源是 `client/src/lib/blogData.ts` 的 `aboutData`，改文案時兩邊要一起改：

- `aboutData.titleZh` / `title` → 職稱
- `aboutData.bio` → 站上 About 頁的長版自我介紹
- `aboutData.social.*` → `Person` schema 的 `sameAs`

### 連結策略

- **同一個頁面不要貼兩次同樣的連結**（會像在堆砌外鏈）
- 連結只放在專業成就欄，其他欄位不放
- iThome 的對外連結**實測可點**，但很可能是 `nofollow`：它不傳權重，
  但帶流量與實體辨識訊號。所以錨點要寫給人看（「Kubernetes 三十天」），不是給爬蟲看

---

## 六、撰寫原則

2026-11-13 犯過一次錯，記在這裡避免重犯：

**原本寫**：`講授 Generative AI with Diffusion Models、Building RAG Agents with LLMs`
**事實**：這兩門是本人**進修上過**的課程，實際講授的只有「深度學習基礎」。

錯在我把 `aboutData.certifications` 的完課證明當成「開課證據」——
那份資料只能證明「完成這門課」。**有資料 ≠ 支持這個說法**，中間那步推論不能自己補。

因此：

1. **講師身分只對應實際開過的課**（可從文章、活動紀錄佐證）
2. 完課／進修與認證**分開陳述**，不要混在同一句
3. 所有數字都要能回查：13 場（`talks`）、2 本（`books`）、5 張正式認證、
   4 段公司（`timeline`）、5 人團隊（本人確認）
4. 部落格數據類宣稱（篇數、頁數）不寫進個人簡介，會隨時間過期

---

## 七、待確認

- **人臉辨識系統**：已確認在**聯策科技**（2017/12–2018/05）期間。
- **5 人團隊（4 人 + 本人）**：目前歸在**承啟科技**那段（Tech Lead 期間）。
  若實際是聯策那段，把兩個 bullet 互換即可。

---

## 更新紀錄

| 日期 | 變更 |
|---|---|
| 2026-11-13 | 建立。三欄位定稿；刪除「SD XL 精選摘要」；`10+ year` 更正為 13 年 |
| 2026-11-13 | 整輪去重（現職／學歷／入行年各只留一處），總字數減約 35%；新增自我介紹欄位 |
| 2026-11-13 | **修正事實錯誤**：DLI 講師只講授「深度學習基礎」，另兩門為進修，已分開陳述 |
