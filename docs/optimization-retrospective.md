# 把部落格體檢了一輪：89 → 96 分，以及那些沒人會告訴你的東西

> 這篇是工作紀錄的整理版，不是教學。所有數字都是實際量到的，做法與踩到的坑一併寫下來。
> 站台：`nickzhuang.com`，React 18 + Vite 7 靜態建置，79 篇文章，部署在 Cloudflare Workers
> Static Assets（手動上傳 `dist/public`）。

---

## 起點

Lighthouse 的分數看起來沒問題：手機 89、電腦 99。所以真正讓我決定動手整理的不是分數，
而是那些「不會壞、但一直在扣分」的東西：

| 症狀 | 嚴重度 |
|---|---|
| `www.nickzhuang.com` 回 403 人機驗證，`robots.txt` 回 526 | 高（搜尋引擎可能進不來）|
| 隨便一個子網域都解析成功，服務同一份內容 | 高（重複內容）|
| 沒有信箱的網域，SPF 是 softfail、還留著舊主機的 DKIM 公鑰 | 高（可被冒名寄信）|
| 圖片 337 張，只有 16 張有 alt | 中 |
| 735 個標題裡 280 個不是合法 slug，6 篇文章有重複 id | 中 |
| 字型從兩個第三方網域載入 | 低 |
| 所有內文圖片 132.8 MB、沒有寬高、沒有 LCP 優化 | 中 |

整理完之後：

| 指標 | 前 | 後 |
|---|---|---|
| Lighthouse 效能（手機 / 電腦）| 89 / 99 | **96 / 100** |
| Lighthouse 無障礙 | 89 | **100** |
| 內文圖片總量 | 132.8 MB | **20.4 MB**（WebP）|
| 有 alt 的圖片 | 16 / 337 | **266 / 337**（71 張刻意留空）|
| 重複 heading id | 6 篇文章 | **0** |
| 斷鏈錨點 | 2 個 | **0** |
| `check:posts` 警告 | 321 | **74** |

---

## 一、DNS 與主機：舊 WordPress 的遺毒

### 症狀

```bash
$ curl -sI https://www.nickzhuang.com/
HTTP/2 403
cf-mitigated: challenge        # Cloudflare 發人機驗證，Googlebot UA 也一樣

$ curl -s -o /dev/null -w '%{http_code}' https://www.nickzhuang.com/robots.txt
526

$ curl -s -o /dev/null -w '%{http_code}' https://random-sub-xyz.nickzhuang.com/
200                            # 隨便一個子網域都在服務整個部落格
```

### 診斷的關鍵：526 證明 Worker 沒參與

一開始看到 403 + `cf-mitigated: challenge`，很自然會往「WAF 規則擋住」猜。但 WAF 是空的。

真正定位問題的是一組對照：

| 路徑 | www | apex |
|---|---|---|
| `/og/k8s-intro.png` | **526** | 200 |
| `/assets/index-*.css` | **526** | 200 |

這兩個檔案**只存在於新部署的 Worker 裡**。如果 www 的請求有進 Worker，不可能回 526 ——
526 是「Cloudflare 連不到 origin」，而 Worker 根本沒有 origin。

所以 www 的請求連 Worker 都沒到。這也解釋了為什麼那條「www → apex 301」的 Redirect Rule
完全沒作用，以及為什麼 WAF 是空的卻出現 challenge：那個 challenge 不是這個 zone 發的。

根因是搬遷時只把 `nickzhuang.com` 綁到新 Worker，**DNS 記錄沒有一併清掉**：

| 記錄 | 內容 | 問題 |
|---|---|---|
| `*.nickzhuang.com` | A → 舊主機 IP | 任何子網域都解析成功，再被 Worker route 接走 → 無限多個主機名服務同一份內容 |
| `www` | CNAME → `nickzhuang.com` | 指回 apex，而 apex 是 Worker 自訂網域、沒有 origin → 526 |
| `imap` / `pop` / `smtp` | CNAME → 已下線的郵件主機 | 沒有 MX，記錄卻還在 |

### 修法

1. Worker → Settings → Domains & Routes：刪掉 `*.nickzhuang.com/*` route，改加
   **Custom domain** `www.nickzhuang.com`
2. DNS：刪掉泛用記錄、`www` 的 CNAME、`imap/pop/smtp`

**順序很重要**：先加自訂網域、再刪舊記錄。反過來做的瞬間 www 會 NXDOMAIN。

### 一個小知識：Custom Domain 優先於 Redirect Rule

修完之後 `www` 回的是 **200 而不是 301**，很多人會想再補一條轉址。其實不用：

```bash
$ curl -s https://www.nickzhuang.com/ | grep -o 'rel="canonical" href="[^"]*'
rel="canonical" href="https://nickzhuang.com/
```

每頁的 canonical 都是絕對網址，Google 會自己把 www 與 apex 合併成同一頁。
硬要讓 www 301 也可以用 Cloudflare 的 Bulk Redirects，但那是「多加一個可能壞的環節」。

---

## 二、沒有信箱，不代表不會被冒用

清理主機時浮出一個問題：**沒有 MX（不收信），是不是就不會有人拿我的網域寄信？**

會，而且原本的設定幾乎沒有抵抗力。冒用防的是「拿你的網域當寄件人」，跟收信無關，
只跟三種 TXT 記錄有關：

| 記錄 | 清理前 | 問題 |
|---|---|---|
| SPF | `v=spf1 ip4:… include:websitewelcome.com ~all` | `~all` 是 **softfail**（標記可疑但照收），而且授權對象是已經不用的舊主機商 |
| DMARC | 沒有 | 收件端想擋也沒有依據 |
| DKIM | `default._domainkey` 有記錄 | **最危險**：留著舊主機的**公鑰**，對應的**私鑰在舊機器上**。誰能存取那台機器，就能簽出「通過 DKIM 驗證」的信 |

修法三行：

```
v=spf1 -all
_dmarc  TXT  v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; pct=100; rua=mailto:你@example.com; fo=1
default._domainkey  TXT  （刪除）
```

`-all` 的意思是「沒有任何伺服器被授權用這個網域寄信」—— 既然沒有郵件服務，這是最乾淨的姿態。
`p=reject` 讓驗證失敗的信直接拒收。

**代價要先知道**：這是「完全不寄信」的設定。哪天要用 Gmail 的「以此地址寄信」或 Google
Workspace，必須先改 SPF 加 `include:_spf.google.com`、加新的 DKIM，否則自己寄的信會被退。
文件裡留了一張對照表，免得未來踩自己。

### 附帶：`workers.dev` 也是重複內容

Worker 預設會開一個 `<worker>.<帳號>.workers.dev` 公開網址，那是**獨立的 hostname**。
關掉之後探測會看到 `error code: 1042`（Worker 沒有對應 route），這是正常結果，不是壞掉。

---

## 三、無障礙 89 → 100：真正扣分的幾乎都是顏色

用跟 Lighthouse 同一套的 axe-core（4.13.0）在本機跑，才發現兩件事：

**① 一定要用手機寬度掃。** 桌面寬度掃出來 0 錯誤，因為 `sm:` 斷點同時改了字級與顏色。
設 `412×823`、`mobile: true` 之後問題才浮出來：

```
text-muted-foreground（hsl 240 5% 45%）在深色底上 → 3.47:1，低於 AA 的 4.5:1
```

**② 修法不是把那個色碼調深，而是補一個語意色票。** 原本全站都用 `--primary` 當連結色，
但 `--primary` 是給「大片色塊上的白字」用的；當「淺底上的文字」就會不足。
所以新增 `--primary-strong`：

```css
:root      { --primary-strong: 262 83% 45%; }   /* 7.42:1 */
.dark      { --primary-strong: 262 83% 75%; }   /* 深色底反過來 */
```

以後「文字要用主色」就一律用 `text-primary-strong`，不會再從 40 幾個地方各自猜顏色。

其他兩類問題比較無聊但同樣會扣分：

- **按鈕沒有可辨識名稱** —— 純圖示按鈕要有 `aria-label`
- **標題層級跳號** —— 清單頁卡片是 `h3` 但上一層也是 `h3`，改成依使用場景傳入層級

### 一個誤判要記得

首頁的漸層文字被 axe 報 `1.65:1`。實際量三個漸層停點是 **4.12 / 11.17 / 6.40**，全部過關
（大字門檻 3:1）。原因是 axe 對 `background-clip: text` 的漸層只讀得到第一個停點。

**這種一定要自己驗算一次**，不然會為了修一個不存在的問題把設計改壞。

---

## 四、效能：先把第三方拔掉，再談其他

### 字型自託管

原本從 Google Fonts 載入，兩個來源（`fonts.googleapis.com`、`fonts.gstatic.com`）。改成
自託管的 `woff2` + 精準的 `unicode-range`（只含拉丁字集，中文走系統字型）：

```css
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/plus-jakarta-sans-latin-v1.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, …;
}
```

誠實說：**前後的 CSS 本來就是非阻塞載入**（`media="print" onload`），所以分數的收益不是
「少了 render-blocking」，而是少了 2 個第三方來源的 DNS + TLS + Cookie 邊界。
首頁請求數 10 → 7，對外網域歸零。

檔名要帶版本（`-v1`），因為 `/fonts/*` 設了 `immutable` 快取 —— 改字型就得換檔名。

### LCP 到底是什麼

不要猜。用 `PerformanceObserver` 實測：

```js
new PerformanceObserver((l) => {
  for (const e of l.getEntries()) console.log(e.element, e.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

結果首頁的 LCP 元素是 `<h1>` 的文字 —— 沒有圖片。所以那些「幫 hero 圖加 `fetchpriority`
會改善 LCP」的建議在這個站是無效的，真正會延後 LCP 的只有 CSS 下載。

### 一件決定不做的事

CSS gzip 後 13.7 KB，是唯一 render-blocking 的請求。理論上可以內嵌關鍵 CSS，
但要維護「哪些算關鍵」的清單，而且這個站每次建置都會換 hash。**權衡後不做**，
把它寫進文件，避免每次看到「Eliminate render-blocking resources」又心動一次。

---

## 五、圖片：132.8 MB → 20.4 MB，alt 從 16 張到 266 張

### 壓縮是建置時做的

`script/optimize-images.ts` 在 build 時把 336 張 PNG/JPG 轉 WebP（原圖 132.8 MB → 20.4 MB，剩 15%）、寫出 `width/height`
（避免 CLS）、首圖 `loading="eager" fetchpriority="high"`、其餘 `lazy`。
原檔留在 repo（134 MB），只有上傳量變小。

### alt 才是難的部分

337 張圖，原本只有 16 張有 alt。這輪手寫 250 張（247 張在一支 commit，另外 3 張是有資訊的封面）。
這種事不能靠通靈，我的流程是：

1. **OCR 先讀圖上的字**（RapidOCR），拿到圖表標題、座標軸、程式碼片段、UI 按鈕
2. 讀圖前後 3 段內文，確認這張圖**在論證什麼**
3. 只寫「OCR + 上下文都支持」的內容，**不確定就留空**

規則（都寫進 `docs/accessibility.md`）：

- 描述**資訊**，不是「這是一張圖」
- 圖表要講**軸、指標、關鍵數字**
- 截圖要講**它證明了什麼**
- 專有名詞保留原文（`zero-shot`、`kubectl`、`RN50x64`）
- **封面一律 `alt=""`** —— 除非它本身有資訊

這條「除非」後來真的用到。有三張封面拿掉的話讀者會損失資訊：一張是 NVIDIA 完課證書、
一張是自己論文的心智圖、一張是講師的教材架構心智圖。所以規則補了一條例外，
判準改成「**拿掉它，讀者有沒有損失**」，而不是「它在不在第一行」。

### 一個容易搞錯的地方：`alt=""` 不等於輸出是空的

`PostDetail` 有 fallback：Markdown 沒寫 alt 時，會用最近的標題 + 「示意圖」自動補。
所以那 71 張「刻意留空」的封面，HTML 裡其實長這樣：

```html
alt="k8s 初探＋簡介 示意圖"
```

這件事值得知道 —— 否則你會以為「留空 = 螢幕閱讀器跳過」，其實它有唸東西。

---

## 六、兩個小 bug：重複 id 與斷鏈錨點

原本 heading 的 `id` 直接拿原始中文標題。量了一下實際會被渲染的 735 個標題：

| 問題 | 數量 |
|---|---|
| 含空白、標點、全形括號（不是合法 slug）| 280 |
| 同一篇有重複標題 → **重複 id**（HTML 不合法）| 6 篇 |
| 內文「提要」的錨點對不到任何標題 | 2 個 |

重複 id 是真的 bug：`dli-notes` 有 6 個 `## 投影片資料`，瀏覽器把 6 個
`<h2 id="投影片資料">` 全部指向第一個，後面 5 個永遠跳不到。

修法三件事：

1. `slugify`：小寫、只留文字與數字（含中文），其餘收斂成單一連字號
2. 重複標題依出現順序加 `-2`、`-3`
3. **內文的 `#錨點` 走同一套轉換**

第 3 點是關鍵。`aigc-what` 的提要寫 `#什麼是AIGC?`（半形問號），標題是
`## 什麼是AIGC？`（全形）—— 兩邊都被正規化，於是自己接上了，不用改一個字。

另一處是內容真的寫錯：`diffusion` 的提要與內文都寫「去噪」，標題打成 `## 去躁`。
這種就只能改內容。

代價：**735 個標題裡有 380 個（52%）的錨點字串改變**（主要是中文標題裡的英文被轉小寫）。
站內提要連結由程式自動重算，外部指向中文錨點的連結本來就是一大串 percent-encoding。

---

## 七、`updated` 欄位：誠實比勤勞重要

這是我覺得最有價值的一個決定。

站上一直有 `updated` 欄位的管線（會反映到 JSON-LD `dateModified`、文章頁「更新於」、
sitemap `lastmod`、RSS），但 79 篇一篇都沒填。原本的想法很單純：**把每篇的最後修改日填上去**。

實際去翻 git 歷史才發現不能這樣做。79 篇文章、每篇最多 4 個 commit，全部長這樣：

```
2026-03-27  [feat] article splits to different directory   ← 從 Notion 匯入
2026-04-01  [feat] modify all posts                        ← Notion → Markdown 清洗
2026-10-23  [content] 移除 60 篇文章開頭的 Author: 殘留行
2026-10-24  [content] 為 247 張文章插圖補上 alt 文字
```

我用「正規化後的 Markdown 文字」比對每個 commit，確認 2026-04-01 那次改的是標題層級、
Notion 錨點改成站內錨點、程式碼區塊轉換、表格重排 —— **沒有一篇有「發佈後內容修訂」**。

如果把例行整理當成更新日期，`lastmod` 就變成雜訊；Google 判定不可靠之後，**會直接忽略這個欄位**。
那時候就算你真的改稿，也沒人理你了。

所以結論是留空：`dateModified = datePublished` 是誠實的陳述。同時加了驗證規則，
以後真的要修訂時不會填錯：

```
updated 必須 YYYY-MM-DD
不可早於 date
不可晚於今天          ← 等於宣稱內容在未來更新過
與 date 相同 → 警告   ← 沒必要填
```

---

## 八、把檢查自動化

這個站是靜態建置 + 手動上傳，有幾種錯誤**不會讓建置失敗**，只會在 Google 那邊靜默扣分：
`excerpt` 太短、`id` 不是合法 slug、標題超過 SERP 寬度、`category` 不在清單、`updated` 早於 `date`。

所以加了 husky pre-commit hook，跑 `typecheck` + `check:posts`。

### 踩到的坑：POSIX sh 沒有 `pipefail`

第一版長這樣：

```sh
set -e
pnpm -s check:posts | tail -20
```

**這是錯的。** husky 用 `sh` 執行 hook，POSIX sh 沒有 `pipefail`，管線的結束碼是 `tail` 的
—— `check:posts` 失敗也會放行。我實測過：故意把 `updated` 填成早於 `date`，**照樣提交成功**。

改成明確判斷結束碼：

```sh
if pnpm -s check:posts >"$LOG" 2>&1; then
  grep '檢查' "$LOG"
else
  grep '✗' "$LOG" | head -20
  exit 1
fi
```

### 沒有裝 Prettier

skill 的預設會一起裝 Prettier + lint-staged。我跳過，理由是這個 repo 從未用過 Prettier：
一加上去，79 篇 Markdown 會被重排，321 張圖的 diff 會全部變成格式噪音，蓋掉真正的改動。

**hook 的目的是正確性，不是風格。**

---

## 九、還沒做的

| 項目 | 決定 | 理由 |
|---|---|---|
| 目錄（TOC）| 延後 2–3 週 | 會動版型。想先確認這輪改動有效，避免同時改太多變數 |
| 內嵌關鍵 CSS | 不做 | CSS gzip 只有 13.7 KB，維護成本大於收益 |
| 原圖移出 repo | 未定 | 目前 134 MB 都在版控裡，只有上傳量變小 |

TOC 那條我留了一份「觀察期備忘」在文件裡：2–3 週後要比對 GSC 的曝光／點擊／排名、
手機 PSI 是否維持 96 以上、有沒有新索引問題。不然兩週後只會記得「當時說要等」，
不記得在等什麼。

---

## 幾個真的學到的東西

1. **分數不是目標，但有幾個分數真的代表壞掉。** 89 分的效能可以放著，但「www 進不來」
   跟「沒有現象但 DNS 有一堆垃圾」是明確的損失。

2. **診斷要看「只存在於新環境的東西」。** 526 之所以能證明 Worker 沒參與，是因為那些檔案
   只在新部署裡。找一個「只有在某種情況下才存在」的證據，比看十個錯誤訊息有用。

3. **`set -e` 不是萬靈丹，管線會吃掉結束碼。** 任何「我以為會擋」的檢查，都要實際弄壞一次看看。

4. **工具的誤判要用算術驗一次。** 漸層文字的 1.65:1 是假的，自己算停點就不會亂改設計。

5. **SEO 上「多做」有時是負分。** `updated` 硬填、`lastmod` 每個月都動、把重複子網域留著 ——
   這些都像勤勞，但對爬蟲來說是降低可信度。

6. **文件要寫「為什麼不做」。** 否則三個月後看到「Eliminate render-blocking resources」
   又會重新想一次內嵌 CSS，然後再放棄一次。

---

## 相關文件

這輪的東西都留在 repo 的 `docs/`：

| 文件 | 內容 |
|---|---|
| `docs/dns-and-hosting-cleanup.md` | DNS／主機／郵件防護的完整判讀與驗證指令 |
| `docs/accessibility.md` | 色票規則、axe 驗證方式、alt 撰寫規則與已知誤判 |
| `docs/seo-audit.md` | P0–P3 全部項目與處理結果、效能基線 |
