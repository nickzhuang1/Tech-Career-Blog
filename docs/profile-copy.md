# 個人資料文案（單一來源）

iThome、LinkedIn 等外部平台的自我介紹文案集中放在這裡，避免每次要更新時還得從對話紀錄裡翻。

**這份檔案不會被建置流程讀取**，也不影響網站，純粹是文案的 single source of truth。

## 貼在哪個欄位

| iThome 欄位 | 對應章節 | 說明 |
|---|---|---|
| 專業成就 | [一](#一專業成就) | 可驗證的頭銜、認證、著作、獎項、產出連結 |
| 專業簡介 | [二](#二專業簡介) | 擅長的技術、做過的系統、參與的專案 |
| 工作經歷／學經歷 | [三](#三工作經歷--學經歷) | 公司 × 年份的時間軸 |

三個欄位會出現在同一頁，**刻意不重複**：成就欄講「有什麼證明」、簡介欄講「會什麼」、經歷欄講「走過什麼路」。

---

## 一、專業成就

```markdown
**現職**

- 承羽智慧（C.Y. Intelligence）技術長 — 企業級 AI 雲平台架構與落地
- 中央大學資訊工程碩士｜2013 年入行，曾任上市公司承啟科技應用發展部 Tech Lead

**教學與認證**

- **NVIDIA Certified Professional（NCP）| AI Infrastructure** — NVIDIA 專業級認證最高階
  另持有四張 Associate 認證：Generative AI LLMs、Generative AI Multimodal、
  AI Infrastructure and Operations、Accelerated Data Science
- NVIDIA DLI（Deep Learning Institute）認證講師（2021 年取得）
  講授課程：Generative AI with Diffusion Models、Building RAG Agents with LLMs、深度學習基礎
- 累計 **13 場技術演講與公開課**，包含：
  - 與 NVIDIA 共同發表：基於 NVIDIA A100 的膠囊網路訓練與 Covid-19 檢測實踐
  - 與 NVIDIA 共同發表：新一代卷積網路 ConvNeXt 與 NVIDIA TAO
  - AIA 年會：Unlocking LLM Inference with vLLM — A Quick Benchmark Guide
  - TPMS 第一屆精準醫學 AI 工作坊、Intel 數據中心大會、數據湖大會、TAIA AI Talk
- [完整證書牆](https://nickzhuang.com/certificates/)

**著作**

- [《圖像生成式 AI 的生存指南：以 Stable Diffusion 為例》](https://reurl.cc/KeMXdp)
  繁體中文第一本講述圖像生成式 AI 理論與實務的書籍
- 《以膠囊網路做印刷電路板影像的瑕疵檢測》

**競賽與榮譽**

- **113 年度 AIGO 潛力新星盃 特優獎（Top 1）** — 品牌商品屬性自動分類及顧客消費預測
- 第 11 屆與 2023 年 iThome 鐵人賽雙雙完賽

**技術文章**

- [Kubernetes 三十天（30 篇）](https://nickzhuang.com/series/ironman-2019/)
  Docker → minikube → Pod / Ingress / RBAC → AWS EKS 實作
- [AIGC 三十天（30 篇）](https://nickzhuang.com/series/ironman-2023/)
  VAE / GAN / Diffusion / Transformer → Stable Diffusion / LoRA / ControlNet
- [AI 基礎建設、NVIDIA 認證準備與企業導入 AI 實務](https://nickzhuang.com)

**聯絡**

- [LinkedIn](https://www.linkedin.com/in/nick-zhuang/)｜[GitHub](https://github.com/nickzhuang1)
```

---

## 二、專業簡介

```markdown
**擅長技術**

- **AI Infrastructure**：Kubernetes（EKS / GKE）、Docker、Helm、GPU 資源排程與多租戶隔離
- **生成式 AI**：Stable Diffusion / LoRA / ControlNet、RAG 架構、LLM 推論加速（vLLM）、NVIDIA TAO
- **深度學習**：PyTorch、TensorFlow / Keras、模型訓練與分散式訓練
- **監控與維運**：Prometheus、Grafana、Node Exporter、CI/CD
- **程式語言**：Python、Shell Script、JavaScript（React / MUI）
- **雲端平台**：AWS（EKS / EC2 / S3 / EBS / EFS）、Google Cloud（GKE）
- **作業系統**：Linux、macOS、Windows

**製作的成品**

- **企業級 AI 雲平台** — 多租戶架構，涵蓋模型訓練、推論服務與資源監控
- **AI 模型訓練平台** — 從資料準備、訓練到模型部署的內部平台
- **資源監控系統** — 叢集與節點層級的指標收集、告警與視覺化
- **區塊鏈礦場管理系統**
- **個人技術部落格** — React + 靜態預渲染，部署於 Cloudflare Workers

**參與的專案**

- **PCB 瑕疵檢測** — 以膠囊網路（Capsule Network）進行印刷電路板影像辨識
- **Covid-19 檢測** — 基於 NVIDIA A100 的膠囊網路訓練與檢測實作
- **品牌商品屬性自動分類及顧客消費預測** — 113 年度 AIGO 潛力新星盃 特優（Top 1）
- **企業 AI 基礎建設規劃** — 從網路底層、算力配置到應用層的完整藍圖
- **生醫 RAG 應用** — TPMS 第一屆精準醫學 AI 工作坊

**技術活動**（完整清單見「專業成就」）

- 累計 13 場技術演講與公開課，含與 NVIDIA 共同發表的兩場公開課、
  AIA 年會 vLLM 推論加速、Intel 數據中心大會、數據湖大會、TAIA AI Talk
```

---

## 三、工作經歷／學經歷

```markdown
**工作經歷**

- **承羽智慧（C.Y. Intelligence）— 技術長**｜2023/01 – 現在
  - 企業級 AI 雲平台架構設計與落地：多租戶、模型訓練、推論服務、資源監控
  - 混合雲（Hybrid Cloud）架構規劃與雲地整合，支援企業在地模型部署
  - AI 硬體監控系統建置
  - 技術團隊組建、技術選型與架構決策

- **承啟科技（上市公司）— 應用發展部 Tech Lead**｜2018/06 – 2022/12
  - 擴編並帶領 5 人軟體開發團隊
  - AI 模型訓練平台開發與持續優化
  - 資源監控系統開發
  - 導入 Scrum 提升團隊開發效率
  - 協助子公司從零建立軟體開發團隊

- **聯策科技 — Software Engineer**｜2017/12 – 2018/05
  - 區塊鏈軟硬整合系統開發（礦場管理系統）
  - 人臉辨識應用系統開發

- **福華資訊科技 — Engineer**｜2013/12 – 2017/04
  - CAM 程式開發與維護：PCB 製程輔助系統、Gerber 編輯／量測程序
  - 程式模組化重構、PCB IC 載板模組開發

**學歷**

- 國立中央大學 資訊工程研究所 碩士｜2016 – 2023（在職進修）
- 國立中興大學 應用數學系 學士

**合計 13 年軟體開發經驗**（2013 年 12 月入行，橫跨製造、區塊鏈、AI 平台）
```

---

## 四、跨平台一致性檢查

Google 做實體辨識時，靠的是「同一個名字、同一組事實」在多個獨立頁面反覆出現。
所以以下三處**必須完全一致**，任何一處寫法不同都會削弱效果：

| 欄位 | 現值 |
|---|---|
| 姓名 | 莊翔甯 / Nick Zhuang |
| 現職 | 承羽智慧 技術長（C.Y. Intelligence, CTO）|
| 最高學歷 | 國立中央大學 資訊工程研究所 碩士 |
| 最高認證 | NVIDIA Certified Professional \| AI Infrastructure |
| 個人網站 | `https://nickzhuang.com`（**不要寫 www**，www 會 301）|

對應到本站的資料來源（`client/src/lib/blogData.ts` 的 `aboutData`），改文案時兩邊要一起改：

- `aboutData.titleZh` / `title` → 職稱
- `aboutData.bio` → 站上 About 頁的長版自我介紹
- `aboutData.social.*` → `Person` schema 的 `sameAs`

### 連結策略

- **同一個頁面不要貼兩次同樣的連結**（會像在堆砌外鏈）
- 成就欄放連結、簡介欄不放，是本份文案的安排
- iThome 的對外連結很可能是 `nofollow`：**它不傳權重，但帶流量與實體辨識訊號**。
  所以錨點要寫給人看（「Kubernetes 三十天」），不是寫給爬蟲看

---

## 五、待確認

- **人臉辨識系統**：已確認在**聯策科技**（2017/12–2018/05）期間。
- **5 人團隊（4 人 + 本人）**：目前歸在**承啟科技**那段（Tech Lead 期間）。
  若實際是聯策那段，把兩個 bullet 互換即可。

---

## 更新紀錄

| 日期 | 變更 |
|---|---|
| 2026-11-13 | 建立。三欄位定稿；刪除「SD XL 精選摘要」（與其他成就並列會拉低份量）；`10+ year` 更正為 13 年 |
