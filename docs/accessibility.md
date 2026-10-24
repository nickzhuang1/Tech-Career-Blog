# 無障礙（a11y）基線與驗證方式

> 2026-10 建立。起因是 PageSpeed Insights 行動裝置的 accessibility 只有 89 分，
> 修完之後記錄「色票怎麼分」、「怎麼驗」、「哪些是工具誤判」，
> 避免以後改配色或加元件時又踩一次。

---

## 一、驗證方式

Lighthouse 的 accessibility 就是用 **axe-core** 跑的（PSI 目前是 4.13.0）。
本機可以用同一版規則、在真實 DOM 上驗證，不需要上傳就能確認：

```bash
# 1. 建置並用任何靜態伺服器起 dist/public
pnpm build
cd dist/public && python3 -m http.server 8899 &

# 2. 用 headless Chrome 開 CDP
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --no-sandbox --disable-gpu \
  --remote-debugging-port=9333 --user-data-dir=/tmp/axe about:blank &

# 3. 注入 axe 並執行（Node 22+ 內建 WebSocket，不需要額外套件）
curl -s -o /tmp/axe.min.js https://cdn.jsdelivr.net/npm/axe-core@4.13.0/axe.min.js
```

驗證頁面（改動後應全部 0 違規）：

```
/  /posts/  /posts/<slug>/  /contact/  /about/  /timeline/  /certificates/  /category/<id>/
```

**只看首頁沒用**：這次的四類問題裡有三類是首頁掃不到的
（內文連結、列表頁徽章、標題層級）。

**用桌機寬度掃也不夠**：`sm:` 斷點會同時改變**字級**與顏色
（例如首屏導言是 `text-base sm:text-lg`），
16px 需要 4.5:1、18px 只要 3:1，所以同一個元素在桌機過、手機不過。
驗證時一定要設 `Emulation.setDeviceMetricsOverride`（412×823, mobile: true）。

---

## 二、色票的兩條規則

### 規則 1：`--primary` 是「填色」，`--primary-strong` 是「文字」

```
--primary        262 83% 58%（淺色）/ 62%（深色）  → 按鈕底色、邊框、光暈
--primary-strong 262 83% 45%（淺色）/ 75%（深色）  → 所有「文字」用主色時
```

為什麼不能只用一個：`--primary` 同時是實心按鈕的底色（白字），
把它調亮雖然解決了文字對比，卻會讓**白字按鈕**掉到 4.5:1 以下。
所以只把「文字用途」導到另一個亮度，兩邊都合規：

| 用途 | 深色模式對比 | 門檻 |
|---|---|---|
| `--primary` 當白字按鈕底色 | 5.5 : 1 | 4.5 |
| `--primary-strong` 當文字 | 7.31 : 1 | 4.5 |

**新元件要用主色寫字請用 `text-primary-strong`**；`text-primary` 只留給
圖示、邊框這類非文字用途。

### 規則 3：疊在 hero-glow 上的文字要調亮，不能只看色票

首頁 hero 有一段 `hero-glow`（紫色與青色模糊光暈）鋪在標題後面。
它會把**局部底色**從 `#0b0b0f` 提亮到 `#23324e`，
於是 `--muted-foreground`（#848490）在那裡只剩 **3.47:1**，其他地方都是 5 以上。

```
❌ text-muted-foreground          → 在 glow 上 3.47 : 1
✅ text-foreground/80             → 7.42 : 1（視覺上仍比 h1 略淡）
```

判斷方式：對比要看**元素實際背後的顏色**，不是主題的背景色。
有 glow、漸層、半透明卡片的地方都要實測。

### 規則 2：`text-muted-foreground/NN` 不要用在資訊性文字

透明度會把顏色疊回背景，`/60` 在近黑底上只剩 **2.34:1**。
小字（日期、標籤、狀態）要看得到，就別降透明度：

```
❌ text-muted-foreground/60   →  2.34 : 1
❌ text-muted-foreground/70   →  約 3.5 : 1
✅ text-muted-foreground      →  5.32 : 1（深色）/ 5.05 : 1（卡片底）
```

裝飾性圖示（箭頭、關閉鈕的圖示本身）不受此限，因為 axe 只檢查「文字」。

`--muted-foreground` 的深色值也因此從 `240 5% 50%` 調到 `240 5% 54%`
（卡片底 4.35 → 5.05），這一階是為了頁首副標那種「差 0.07 分」的情況。

---

## 三、這次修掉的其他三類

### 只有圖示的按鈕一定要有 `aria-label`

```tsx
<Button aria-label={mobileOpen ? "關閉選單" : "開啟選單"} aria-expanded={mobileOpen}>
  {mobileOpen ? <X /> : <Menu />}
</Button>
```

### 實心徽章上的文字要注意 variant 的權重

Badge 的 `tag` 變體自帶 `dark:text-cyan-300`，`.dark` 前綴的選擇器權重比
`text-white` 高，所以覆寫時**必須用 `!text-white`**，否則白字根本沒生效
（這也是為什麼「選中的標籤」文字只有 1.67:1）。

### 卡片標題層級要跟頁面結構一致

`BlogCard` 有 `headingLevel` 參數：

| 頁面 | 層級 | 原因 |
|---|---|---|
| 首頁 | `h3`（預設） | 卡片掛在 `<h2>` 區塊標題底下 |
| `/posts/` | `h2` | 該頁 `<h1>` 底下直接是卡片，用 h3 會跳階（`heading-order`） |

---

## 四、已知的工具誤判：h1 的漸層文字

首頁 `<h1>` 的 `AI 異想封印：` 用 `background-clip: text` + 透明填色，
axe 取不到漸層的實際顏色，會取樣成漸層與底色的混合值 `#3d3154`，
於是報 1.65:1 的對比不足。

實際數值（大文字門檻是 **3:1**，不是 4.5）：

| 漸層停點 | 對比 |
|---|---|
| `262 83% 62%`（起點） | 4.12 |
| `190 95% 55%`（中段） | 11.17 |
| `262 83% 72%`（終點） | 6.40 |

**全部合格，不需要改設計。** Lighthouse 跑首頁時也沒有報這一項；
若日後看到這個 1.65:1，知道是工具限制即可。

---

## 四、圖片 alt 的撰寫規則

2026-10 一次補完 247 張（全站 262/336 有 alt），規則與工具記錄在這裡，
之後新增文章時照同一套走。

### 規則

| # | 規則 | 反例 → 正例 |
|---|---|---|
| 1 | 描述**資訊內容**，不是「這是一張圖」 | ❌「如下圖所示」→ ✅「CLIP 三段流程：對比式預訓練、建立分類器、zero-shot 預測」 |
| 2 | 技術名詞保留原文 | `zero-shot`、`Linear Probe`、`kubectl`、`RN50x64` 不翻譯 |
| 3 | 圖表要點出**軸、指標、關鍵數字** | ✅「橫軸是 zero-shot 準確率、縱軸是 7 個資料集的平均分數，標註 5 point improvement」 |
| 4 | 截圖要說出它**證明什麼** | ✅「`kubectl get pods` 輸出，三個 Pod 都是 Running、重啟次數 0」 |
| 5 | 長度 30–60 字（中式內容；技術名詞多時總長可到 70–100） | — |
| 6 | 不重複正文結論，只補「圖長什麼樣、有什麼」 | — |
| 7 | **封面圖留空**：H1 之前那張 `img_001` 一律 `alt=""` | 裝飾圖螢幕閱讀器應跳過 |
| 8 | 純裝飾圖留空：分隔線、logo 牆、連結圖示 | — |

### 撰寫者看不到圖時的做法

撰寫的人（不論是 AI 或未看圖的編者）看不到畫面，所以**唯一依據是 OCR 文字 + 上下文**。
這個限制本身就是品質紀律：

- 只能寫 OCR 與前後文能支持的內容，**不要憑檔名或想像編造畫面細節**
- OCR 空白、前後文只寫「如下圖」→ **保持 `alt=""`** 並列出待人工確認
- 情願概括但正確，也不要具體但錯誤

取 OCR 的方式（macOS 內建 Vision 在沙箱裡會被擋，用 ONNX 版可離線跑）：

```bash
python3 -m venv /tmp/ocrvenv
/tmp/ocrvenv/bin/pip install rapidocr-onnxruntime pillow
# 之後對每張圖：RapidOCR() 回傳 [[box, text, confidence], …]
```

### 驗證

```bash
pnpm check:posts | grep alt      # 應只剩封面圖的警告
```

另外用「把 `![…]` 的中括號內容拔掉後與 `HEAD` 版逐字比對」確認
**只改了 alt、沒有動到正文**（這次 56 個檔案全部通過）。
