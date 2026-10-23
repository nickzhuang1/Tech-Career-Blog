# SEO 健檢報告 — nickzhuang.com

> 檢查方式：本機 `dist/` 靜態產物 + 對 `https://nickzhuang.com` 實際 HTTP 請求 + `blogData` 全量解析。
> 部署前提：純靜態、上到 **Cloudflare Workers Static Assets**（非 Pages）。平台相關建議見第三節。
> 日期：以 repo 現況為準（79 篇文章、6 個靜態頁）。
>
> **本輪已實作（尚未上線）**
> - `script/prerender.tsx`、`client/src/hooks/usePageTitle.ts`、`script/generate-sitemap.ts`：canonical / og:url / JSON-LD / sitemap 對齊結尾斜線
> - `client/public/_headers`：`/assets/*` 與 `/articles/*` 長快取
> - `script/optimize-images.ts` + `build.ts`：建置時轉 WebP、補 `width/height`、首圖 eager
> - `client/src/pages/PostDetail.tsx`：相關文章、系列導覽、alt fallback
> - 建置驗證：90/90 頁預渲染成功、sitemap 90 筆全部為斜線 URL、文章內文完整、0 壞圖
>
> **注意**：圖片原檔仍留在 repo（134 MB），只有上傳量變小。若要連 repo 都瘦身，需要另外決定是否把原檔移出或改用 Git LFS。
> 新增的 `client/src/lib/imageMeta.json`（31 KB）是建置產物但**需要進版控**，否則 `pnpm dev` 無法啟動。

---

## 一、已經做對的事（不要重做）

| 項目 | 現況 |
|------|------|
| 預渲染 | `script/prerender.tsx` 把 79 篇 + 6 頁輸出成含完整內文的靜態 HTML，爬蟲不用執行 JS ✅ |
| 逐頁 meta | title / description / canonical / og / twitter 皆逐頁注入 ✅ |
| Sitemap | 90 個 URL（6 靜態 + 5 聚合 + 79 文章），由建置腳本自動產生 ✅ |
| robots.txt | 允許全站 + 指向 sitemap ✅ |
| 結構化資料 | 文章頁有 `BlogPosting` ✅ |
| 未知路徑 | 生產站回 404（非 soft 404）✅ |
| HTML 壓縮 | Brotli ✅ |

這些是 SEO 的「及格線」，你已經過了。以下問題才是現在真正影響索引品質與排名的部分。

---

## 二、P0 — 會直接影響索引與排名（建議本週做）

| 項目 | 狀態 | 說明 |
|------|------|------|
| P0-1 URL 斜線一致性 | ✅ 已完成 | canonical / og:url / sitemap / JSON-LD 已對齊，待上線驗證 |
| P0-2 圖片快取 | ✅ 已完成 | `client/public/_headers`，待上線驗證 |
| P0-2 圖片壓縮 / alt / 尺寸 | ✅ 已完成 | 132.8 MB → 20.4 MB（−85%）；337 張全部轉 WebP |
| P0-3 相關文章 + 系列導覽 | ✅ 已完成 | 文章頁內鏈 0 → 平均 4.1 條 |

### P0-1 全站 URL 都多一次 307，且 canonical 指向會轉址的 URL

> ✅ **已完成（本輪）** — 修法見下方「修法（已完成…）」

實測結果：

```
GET /posts/nvidia-cert-fathers-day   → 307 /posts/nvidia-cert-fathers-day/
GET /posts/nvidia-cert-fathers-day/  → 200
GET /posts                            → 307 /posts/
GET /about /timeline /certificates /contact → 皆 307 到結尾斜線
```

但同時：

- `<link rel="canonical">` 寫的是**沒有斜線**的版本（`.../posts/nvidia-cert-fathers-day`）
- `sitemap.xml` 85 個 URL 中 84 個也都是**沒有斜線**的版本
- 全站內部連結 `<a href="/posts/...">` 也是沒有斜線的版本

也就是說：Google 拿到的 canonical 與 sitemap 網址，全都是「301/307 轉址後才到得了的 URL」。這會造成：

1. 每一次內部點擊、每一筆爬取都多一個 RTT
2. Search Console 容易出現「頁面會重新導向」「重複網頁，Google 選擇了不同的標準網址」
3. 外部連結的訊號分散在兩個 URL 上

**修法（已完成，2026-10 版）：讓 canonical / sitemap 對齊平台實際回 200 的 URL**

本站是手動上傳 `dist` 到 Workers，沒有 `wrangler` 設定檔，所以 `html_handling` 改不了。
因此採取「不改 URL、只讓宣告對齊現實」：**網址結構完全不動（舊的斜線網址仍回 200，不會產生 404 風險）**，
把 canonical / og:url / sitemap / JSON-LD 的 URL 全部改成平台真正回 200 的結尾斜線版本。

已修改：

- `script/prerender.tsx`：canonical / og:url 加結尾斜線；`articleJsonLd` 的 `@id`、作者 URL 同步
- `client/src/hooks/usePageTitle.ts`：瀏覽器端 hydration 後不會把 canonical 改回無斜線版本（兩邊必須一致）
- `script/generate-sitemap.ts`：sitemap 全部輸出結尾斜線 URL
- `client/public/_headers`：新增（見 P0-2）

驗證方式（建置後在本機做，不需上線）：

```bash
grep -o '<link rel="canonical"[^>]*>' dist/public/posts/<id>/index.html   # 應有結尾斜線
grep -o '<loc>[^<]*</loc>' dist/public/sitemap.xml | head                # 應有結尾斜線
```

> **備選路線（若日後改用 `wrangler deploy`）**：加上 `wrangler.jsonc` 並設
> `assets.html_handling: "drop-trailing-slash"`，讓無斜線成為最終 URL（網址更漂亮、少一個字元）。
> 那就必須把上面三處的結尾斜線改回來——兩條路線是互斥的，不要混用。

**內部連結保持無斜線是刻意的**：SPA 內點擊走 client-side routing 不會觸發轉址；
只有直接輸入網址、分享連結、爬蟲抓初始 HTML 時才會遇到 307 → 200。這對 SEO 無害（canonical 已一致），
若要做到「爬蟲也零轉址」，再另外把 `Link href` 改成結尾斜線並在 `PostDetail` 正規化 `useParams` 的值。

---

### P0-2 圖片：沒有快取、體積過大、幾乎沒有 alt

> ✅ **已完成** — 快取、WebP 壓縮、`width/height`、首圖 eager、alt fallback 全部完成。
>
> 實作：`script/optimize-images.ts`（建置時轉檔 + `.cache` 快取 + 產生尺寸表）
> → `script/build.ts` 在 vite build 之後把 webp 換進 dist 並刪除原圖
> → `client/src/pages/PostDetail.tsx` 依 `client/src/lib/imageMeta.json` 改寫 `src` 並補 `width`/`height`。
>
> 成果：
> | 指標 | 之前 | 之後 |
> |------|------|------|
> | 圖片總量 | 132.8 MB | **20.4 MB（−85%）** |
> | 上傳體積（dist） | ~140 MB | **38 MB** |
> | 缺 `width`/`height` | 337 / 337 | 0（1 個 20px 固定尺寸的行內 icon 不需要） |
> | `alt` 空白 | 321 / 337 | 1（同上，裝飾性 icon） |
> | 首圖 lazy | 全部 | 0（首圖 `eager` + `fetchpriority=high`） |
> | 壞圖 | — | 0 |

實測與統計：

| 指標 | 數字 |
|------|------|
| 文章圖片總數 | 337 張 |
| 圖片總體積 | **133 MB** |
| 最大單張 | 3.1 MB（`civitai/images/img_004.png`） |
| 有 `alt` 文字的 | 16 / 337（**321 張 alt 為空**） |
| 有 `width`/`height` 的 | **0 / 337** |
| 圖片回應標頭 | `cache-control: public, max-age=0, must-revalidate`、`cf-cache-status: MISS` |

問題與影響：

1. **瀏覽器每次瀏覽都必須重新驗證每張圖**（`max-age=0`），等於每頁多出 N 個 RTT，直接拖慢 LCP
2. 2–3 MB 的 PNG 當內文插圖 → 手機載入極慢，Core Web Vitals 的 LCP 一定紅字
3. 沒有 `width/height` → 圖片載入時版面跳動（CLS）
4. 337 張有 321 張 `alt=""` → Google 圖片搜尋完全抓不到，也失去無障礙分數
5. 第一張圖（文章封面，通常在首屏）也被加了 `loading="lazy"` → LCP 被延後

**修法**

a) ✅ **已新增** `client/public/_headers`（Workers Static Assets 會從上傳根目錄解析，上限 100 條規則）。
   放在 `client/public/` 會被 `pnpm build` 自動複製到 `dist/public/_headers`：

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/articles/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400
```

> 若你的部署方式不吃 `_headers`（例如用 Dashboard 直接上傳），替代方案是 Dashboard → Caching → Cache Rules：
> 對 `/articles/*` 與 `/assets/*` 覆寫 Browser TTL（1 個月／1 年）。效果相同、不需改程式。
> **不要**用 Worker 腳本包一層改標頭——那會讓每張圖、每個 JS 都變成 Worker 請求（計費＋多一跳），
> 而純靜態 asset 請求本身是不計費的。

b) 建置時壓縮圖片（`sharp`）：輸出 WebP（寬度上限 1600px、quality 80），並在 `renderMarkdown` 補 `width`/`height`；首張圖改 `loading="eager" fetchpriority="high"`。
   133 MB → 預估可降到 10–15 MB（PNG 示意圖轉 WebP 通常可省 70–90%）。

c) 補 alt：可以先用「文章標題 + 圖序」自動補齊，再由你人工潤飾前 20 篇主力文章。

---

### P0-3 文章頁之間幾乎沒有內部連結

> ✅ **已完成** — 相關文章 3 篇（tag 交集為主）+ 系列導覽（上一篇／下一篇／系列目錄／第 N 篇）。
>
> 成果：79 篇文章的靜態 HTML 平均有 **4.1 條**文章→文章內鏈（之前是 0），沒有 0 內鏈的頁面。
實測：預渲染後的文章頁裡，`href="/posts/..."` 的數量是 **0 個**（只有「返回文章列表」和系列文才有的「下一篇」）。

- 首頁只連到 7 篇
- `/posts` 連到全部 79 篇（這點很好，保住了爬取深度）
- 但文章 A → 文章 B 的橫向連結是零

對一個有 79 篇文章、61 篇分成兩大系列（K8S 30 篇、Gen AI 31 篇）的站來說，這是最浪費的一塊：
主題相關的文章彼此沒有訊號交流，Google 也難以判斷「誰是這個主題的權威頁」。

**修法（兩個都要）**

1. **相關文章**：用 tag 交集 + 同分類排序，每篇底部放 3 篇（`PostDetail` 加區塊，`prerender` 會自動帶進靜態 HTML）
2. **系列導覽**：文章頂部/底部加「系列目錄（上一篇 / 全部 30 篇 / 下一篇）」，把 30 篇串成一個強連結聚落

---

## 三、平台層：Cloudflare Workers Static Assets 的 6 個 SEO 注意點

本站是純靜態（`dist/public` 上到 Workers），所以有些 SEO 判斷取決於平台設定，而非程式碼。
以下是實測生產站後確認的行為，以及對應建議。

| # | 平台行為 | 對 SEO 的影響 | 建議 |
|---|---------|--------------|------|
| 1 | `html_handling` 預設 `auto-trailing-slash` → 目錄頁 307 到結尾斜線 | canonical/sitemap 原本指向會轉址的 URL（P0-1） | 手動上傳改不了這個設定 → 已改為讓 canonical/sitemap 對齊斜線 URL |
| 2 | `not_found_handling` 目前是 `404-page`（未知路徑回 404）✅ | 正確，沒有 soft 404 | **不要**改成 `single-page-application`，那會讓所有亂打網址回 200 |
| 3 | `_redirects` 實測生效（`/certifications` → 301）；`_headers` 同樣由平台從上傳根目錄解析 | 可在不改部署流程下控制快取 | 新增 `client/public/_headers`（已加）；上限：`_headers` 100 條、`_redirects` 2,100 條 |
| 4 | `*.workers.dev` 子網域與版本預覽 URL 都可能被索引 | 與正式網域內容重複，分散訊號 | Dashboard → Worker → Settings → Domains & Routes **關閉 workers.dev 路由**；不需要的版本預覽也關閉 |
| 5 | 靜態 asset 請求不計費、不算 Worker 請求數 | 爬蟲流量沒有成本壓力 | 不需要為了 SEO 省爬取，反而應該放心讓 Googlebot 抓 |
| 6 | 單檔上限 25 MiB、免費方案 20,000 個檔案 | 目前 337 張圖最大 3.1 MB，無風險 | 壓縮圖片是為了 CWV，不是為了上限 |

補充：Worker 沒有執行 `dist/index.cjs` 那個 Express 伺服器，所以 `server/static.ts` 的行為（結尾斜線 301、未知路徑回 200）
**不影響生產站**，只影響本機 `NODE_ENV=production node dist/index.cjs` 的測試。生產站行為以上表實測為準。

另外，`_redirects` 內的 `/certifications → /certificates 301` 在 `drop-trailing-slash` 下不會產生轉址鏈，
可以直接保留。

---

## 四、P1 — 影響曝光與點擊率（2–3 週內）

| 項目 | 狀態 |
|---|---|
| P1-1 主題聚合頁 / 系列頁 | ✅ 已完成（5 頁） |
| P1-2 結構化資料 | ✅ 已完成 |
| P1-3 每篇獨立 OG 圖 | ✅ 已完成（84 張標題卡） |
| P1-4 H1 重複 | ✅ 已完成 |
| P1-5 日期與作者語意 | ✅ 已完成 |
| P1-6 RSS / Atom | ✅ 已完成 |

### P1-1 缺少可索引的「主題聚合頁 / 系列頁」✅

目前分類與系列都是查詢字串：`/posts?filter=K8S`、`/posts?series=ironman-2023`，
而 `/posts` 的 canonical 一律指向 `/posts`，所以**這些聚合頁永遠不會被獨立索引**。

你有兩個各 30 篇的完整系列，卻沒有一個能被排名的落地頁。這是最容易補的高價值缺口：

- `/series/ironman-2023`（2023 鐵人賽 30 篇，含 150–250 字的系列介紹 + 目錄）
- `/series/ironman-2019`
- `/category/k8s-docker`、`/category/gen-ai`、`/category/ai`
- 高意圖標籤頁：`/tag/nvidia`（6 篇）、`/tag/aws`（9 篇）、`/tag/stable-diffusion`（15 篇）

重點：每個聚合頁都要有**獨一無二的介紹文案**，不要只是列表，否則會變成 thin content 反而扣分。
這些頁面同樣要納入 `prerender.tsx` 與 sitemap。

### P1-2 結構化資料只有一半 ✅

現在只有文章頁的 `BlogPosting`。建議補：

- 首頁：`WebSite`（含 `potentialAction` SearchAction）+ `Person`
- 文章頁：`BreadcrumbList`（首頁 → 文章 → 本篇）
- `Person` 補 `sameAs`（GitHub / LinkedIn / iThome / 書籍頁）與 `jobTitle`、`worksFor`
  → 對「CTO / 個人品牌」這類查詢的實體辨識與 E-E-A-T 很有幫助

### P1-3 OG 圖全站共用一張，且比例不符 ✅

- 79 篇文章全部指向同一張 `og-image.png`
- 尺寸 2072×1036（比例 2:1），Twitter `summary_large_image` 建議 1200×630（1.91:1），分享時會被裁切
- 缺 `og:image:width` / `og:image:height` / `og:image:alt`

**修法**：優先用文章自己的 `cover.jpg` 當 og:image（沒有才 fallback），並在 `prerender.tsx` 補上尺寸與 alt。
社群分享的點擊率會直接反映在流量上。

### P1-4 H1 重複（60 / 79 篇有兩個 H1）✅

`PostDetail` 的標題已是 `<h1>`，但文章 Markdown 的 `# 標題`（79 篇中 61 篇有）也被渲染成 `<h1>`。

**修法**：在 `renderMarkdown` 把 `#` 降到 `<h2>`
```ts
const lv = Math.min(Math.max((line.match(/^(#{1,4}) /) ?? ["", ""])[1].length, 2), 4);
```

### P1-5 缺少日期與作者語意 ✅

- 沒有 `<time datetime="2026-08-08">`（日期只是純文字 `<span>`）
- 沒有 `<meta name="author">`、`article:published_time`、`article:modified_time`
- `dateModified` 永遠等於 `datePublished`，文章有更新也不會反映

**修法**：`blogData` 加 `updated?: string`；渲染時用 `<time>`；`injectMeta` 補 `article:*`。

### P1-6 沒有 RSS / Atom ✅

沒有 `feed.xml`，也沒有 `<link rel="alternate" type="application/rss+xml">`。
對技術部落格來說，RSS 是聚合器、電子報、開發者社群自動抓取的入口，成本很低。

---

### Batch A 實作記錄（2026-08-15）

| 項目 | 落實方式 | 驗證 |
|---|---|---|
| P1-4 | `renderMarkdown` 把 Markdown 的 `#` 降一階渲染成 `h2`（`##`/`###`/`####` 不變） | 85/85 頁面 H1 數 = 1（原本 60 篇是 2） |
| P1-5 | 文章頁日期改 `<time datetime>`；`blogData` 加 `updated?`（未填時 `dateModified` = `date`，不造假）；每頁 `meta name="author"`，文章頁加 `article:published_time` / `modified_time` / `section` | 79 篇文章頁全部有 `<time datetime>`，0 個缺 author |
| P1-2 | 首頁 JSON-LD：`WebSite` + `Person`（`jobTitle`、`worksFor`、`knowsAbout`、`alumniOf`、`sameAs` → GitHub / LinkedIn）；文章 JSON-LD 改 `@graph`，加入 `BreadcrumbList` | 首頁 `[WebSite, Person]`、文章 `[BlogPosting, BreadcrumbList]` |
| P1-6 | 新增 `script/generate-feed.ts`（RSS 2.0，最新 30 篇，結尾斜線 URL）；`index.html` 加 `rel="alternate"` | 30 筆 item，全部斜線結尾 |
| P1-3 | `index.html` 補 `og:image:width/height/alt`（2072×1036） | 已輸出，但 79 篇仍共用同一張圖 |

踩到的坑：React 18 的 `renderToString` 會把 `dateTime` 序列化成 `dateTime="…"`（HTML 屬性名大小寫不敏感，瀏覽器解析後就是 `datetime`，功能正常）。為避免驗證工具誤判，`prerender.tsx` 在輸出時正規化為小寫。

### Batch B 實作記錄（2026-08-15）

新增 5 個可被獨立索引的主題落地頁，每頁都有 150–250 字的獨立導讀（旁觀者視角）與 `CollectionPage` + `ItemList` + `BreadcrumbList` 結構化資料：

| URL | 篇數 | 為什麼是這幾個 |
|---|---|---|
| `/series/ironman-2023/` | 30 | 生成式 AI 完整系列，最大的內容資產 |
| `/series/ironman-2019/` | 30 | Kubernetes 完整系列 |
| `/category/ai/` | 12 | 唯一 100% 獨立於系列的聚落（12 篇全部不在任何系列內） |
| `/tag/nvidia/` | 6 | 全部獨立，且對應「NVIDIA 認證怎麼考」這類高意圖查詢 |
| `/tag/deep-learning/` | 15 | 含 6 篇系列外的深度學習內容 |

**刻意不做的頁面**：`gen-ai`（31 篇中 30 篇在 2023 系列內）、`k8s-docker`（30 篇全在 2019 系列內）、`Stable Diffusion`（15 篇全在系列內）、`K8S`／`Gen AI`／`AWS`／`EKS` 等標籤同理 —— 與系列頁近乎重複，獨立建頁只會互搶排名。`life`（3 篇）、`career`（2 篇）、`deep-learning` 分類（1 篇）則太薄。

**內部連結**：文章頁的系列徽章與「系列目錄」連到系列頁；標籤徽章若有對應聚合頁就變成連結；footer 新增「主題」導覽（5 頁 + RSS），讓這些頁面從全站每一頁都有一條爬取路徑，不成為孤島。已驗證沒有任何 `/series|/category|/tag` 連結指向不存在的頁面。

驗證：90/90 頁預渲染、5 頁 H1 各 1 個、canonical 皆結尾斜線、sitemap 90 筆、`ItemList` 篇數與卡片數一致（30/30/12/6/15）。

---

### Batch C 實作記錄（2026-08-15）

79 篇文章**沒有任何 cover 圖**（原報告假設可用封面，實測為 0 張），因此改為建置時合成標題卡：

| 項目 | 內容 |
|---|---|
| 輸出 | 84 張 1200×630 PNG（79 篇 + 5 個聚合頁）寫入 `dist/public/og/`，總計 7.7 MB |
| 版面 | 紫→青漸層底 + 光暈 + 分類／系列標籤 + 標題 + 站名與日期 |
| 換行 | 依字寬估算（全形 1em、拉丁 0.56em），字級階梯 96→38 取最大且不超過 3 行的級數 |
| 快取 | 標題內容 hash → `.cache/og/`，標題沒改不重繪 |
| meta | 文章與聚合頁各自輸出 `og:image` / `width=1200` / `height=630` / `alt` / `twitter:image`；`BlogPosting.image` 同步改用專屬圖；首頁維持站台預設圖（2072×1036） |

**技術限制（實測）**：sharp 內建的 librsvg **忽略 `font-family`** —— 用 `PingFang TC`、`Helvetica`、`Noto Sans CJK TC` 與不存在的字型名渲染，輸出的 PNG 位元組完全相同。但漢字與中文標點都能正確渲染（同字元順序顛倒會產生不同像素、逐格墨量不同，可排除豆腐方塊），且 `font-weight="bold"` 有效。因此版面不指定字型，只用字級與粗體控制。

**驗證**：84 張全為 1200×630；文字外框都在邊界內（左 81px、右 ≤1135px、下 ≤625px）；每張都有 kicker + 標題 + footer 三個文字帶（3 行標題為 6 帶）；建置時的文字覆蓋率檢查 0 個警告；`dist/public` 檔案數 703（Cloudflare 免費上限 20,000）。

## 五、P2 — 內容與文案優化

### P2-1 標題過長 ✅（2026-08-15 完成）

**初版判斷有誤**：原本寫「8 篇超過 60 字元」，實際用字元數量出來是 **0 篇** ——
但字元數不是對的指標。中文（全形）一個字佔兩倍寬，Google 的標題空間約 600px ≈
**寬度 60**（全形算 2、半形算 1）。用寬度量，渲染後的 `<title>` 有 **21 / 79 篇超過 60**。

兩個成因：

1. 文章標題本身偏長（`nvidia-rag` 寬度 75、`k8s-affinity` / `k8s-mgmt-discovery` 68、`k8s-pv-pod` 67）
2. **品牌後綴 `| Nick's Blog` 固定佔 14 寬度**，等於還沒開始就花掉 23% 的預算

**修正方式**

| 項目 | 做法 |
|---|---|
| 後綴 | 改成 `\| Nick`（寬度 7），且只在「標題 + 後綴 ≤ 60」時才加；加不下就省略（品牌在網址列仍看得到） |
| 長標題 | 新增選填欄位 `seoTitle`，只給 4 篇用：`<title>`／`og:title`／`twitter:title`／JSON-LD `headline` 用短版，**H1、卡片、麵包屑、RSS、OG 圖仍用原 `title`** |
| 共用邏輯 | `client/src/lib/seoTitle.ts`（`titleWidth` / `buildTitle`），建置期 `prerender` 與執行期 `usePageTitle` 共用同一套規則，避免靜態 HTML 與 SPA 導覽不一致 |
| 驗證器 | `pnpm check:posts` 現在會檢查 `seoTitle` 組出的寬度，並警告沒有 `seoTitle` 又超寬的標題 |

**結果**：90 個頁面的 `<title>` 寬度全部 ≤ 60（範圍 11–60、中位數 37），
其中 58 篇仍帶品牌後綴。4 篇的兩種標題並存：

| 文章 | 頁面 H1（原文） | `<title>`（SERP） |
|---|---|---|
| `nvidia-rag` | 完課取證！史上體感難度最高的 NVIDIA DLI 課程：Building RAG Agents with LLMs（寬 75） | 史上最難的 NVIDIA DLI 課程：RAG Agents with LLMs 完課取證（寬 57） |
| `k8s-affinity` | k8s 進階篇（四）：Affinity and Anti-Affinity、Taints and Tolerations（寬 68） | k8s 進階篇（四）：親和性與污點容忍（Affinity、Taints）（寬 54） |
| `k8s-mgmt-discovery` | k8s 管理篇延伸與 EKS（一）：Service Discovery、Dashboard、Monitoring（寬 68） | k8s 管理篇延伸與 EKS（一）：服務發現、Dashboard 與監控（寬 54） |
| `k8s-pv-pod` | k8s 之 PV 小整合：Pod、Deployment、Service、Job 與 PersistentVolume（寬 67） | k8s 之 PV 小整合：Pod、Deployment、Service 與 PV／PVC（寬 60） |

### P2-2 Description 偏短 ✅（2026-08-15 完成）

`description` 直接沿用 `excerpt`，原本 **72 篇低於 60 字**（最短 22 字），另有 5 篇在 62–124 字。
短不是扣分項，但 Google 很可能自己改寫摘要，等於失去控制 SERP 文案的機會。

79 篇全部改寫為 **80–110 字**（平均 95、79 篇互不重複），並確認 `excerpt` 會流向
卡片摘要、meta description、`og:description` 與 RSS 描述四個位置。
逐篇「原 → 新」對照見 `docs/excerpts-review.md`。

### P2-3 首頁 H1 是品牌標語，不含關鍵字 ✅（2026-08-15 完成）

原 H1「AI 異想封印 / Nick 的職場幻界」兩個詞都是品牌語彙，
沒有任何搜尋意圖的字（技術、職涯、AI 應用…），首頁在「技術筆記」「AI 職涯」這類
查詢上等於沒有 H1 訊號。

**決策過程**：曾考慮「技術主管的 AI 與雲端筆記」，但「技術主管」與「研發主管」
在中文語境容易混淆，而且職稱會隨時間變動；最後選定較穩定、涵蓋面較廣的版本。

**定案 H1**：**「AI 異想封印：技術實戰與職涯思索」**

用語選擇的過程：

| 候選 | 不採用的原因 |
|---|---|
| 技術與職涯筆記 | 「筆記」自我定位偏低（學生感）；站長認為質感不夠 |
| 技術與職涯觀點 | 「觀點」是媒體專欄的濫用詞，且兩個抽象詞疊在一起反而更平 |
| 技術主管的 AI 與雲端筆記 | 「技術主管／研發主管」語境易混淆，職稱也會隨時間變動 |
| **技術實戰與職涯思索** | 採用：兌現手把手內容、對稱結構、與品牌詞「異想」同語域 |

- 品牌詞（AI 異想封印）保留在最前面，維持辨識度
- 「實戰」「思索」對應網站兩條主線：技術實作 73 篇、職涯與人生探索 5 篇
- 冒號刻意留在第一行結尾，讓 `<h1>` 的 textContent 是完整一句，
  而不是被 `<br>` 切成兩段互不相干的品牌詞
- 副標（12 年軟體開發，從前端到後端、從雲端到 AI…）維持不變，補足長尾語意

**同步調整**（避免 H1 說一套、SERP 說另一套）：

| 位置 | 之前 | 之後 |
|---|---|---|
| `<title>`／`og:title` | `Nick's Blog - AI異想封印 \| CTO的爐邊雜談` | `AI 異想封印：技術實戰與職涯思索 \| Nick`（寬度 38） |
| `description` | `CTO的爐邊雜談 — 分享 AI 技術…`（41 字） | `分享 AI 技術實戰、系統架構與職涯思索。12 年軟體開發經驗…`（98 字） |

**站名實體不變**：`og:site_name`、RSS 標題、JSON-LD `WebSite.name` 仍是
`Nick's Blog - AI異想封印` —— 那是「網站叫什麼」，與首頁標語是兩件事。

**年資改為推算**：原本首頁副標寫「12 年」、統計卡寫「12+」、description 寫「十年」，
三處數字不一致且會過期。新增 `client/src/lib/site.ts`，以第一份工作到職日
`2013-12-03` 為基準推算 `yearsOfExperience()`，首頁副標、統計卡與 description
全部改用它 —— 2026-12-03 之後建置會自動變成 13 年，不需要回頭改文案。
靜態殼層 `client/index.html` 的 description 刻意不含數字（它是無 JS 時的 fallback）。

### P2-4 語言一致性 ✅（不成立，2026-08-15 修正誤判）

初版寫「78 篇中有 5 篇簡體字比例超過 20%（`gai-tools` 26%、`civitai` 25%、
`cursor-ai-award` 23%）」，**這個結論是錯的**，當時用的字表把繁簡共用字也算了進去。

改用 566 個「簡體專用字」重新掃描全部 79 篇內文：

| 指標 | 結果 |
|---|---|
| 簡體字比例 > 20% | **0 篇** |
| 簡體字比例 > 5% | **0 篇** |
| 比例最高的一篇 | `k8s-deploy-svc`，1587 個中文字裡有 **1 個**（0.1%） |
| 全站中位數 | 0.00% |

再以 `这/个/们/时/会/为/说/关/数/据/网/络/电/脑/软/件/应/该` 直接 grep，
除了繁簡同形的「件」（222 次）之外全部為 0。

**結論**：內文已是繁體中文，與 `<html lang="zh-TW">` 一致，這項不需要處理。

---

## 六、P3 — 長期（內容、站外與監測）

>
> 這一段的共通點：**不是寫一次就結束**，而是持續投入才會複利的項目。前三個 P 做完再進來。

### P3-1 作者實體與 E-E-A-T
技術部落格的排名很吃「作者可信度」。目前 About 頁有內容，但缺少可被機器讀取的實體訊號。
做法：About 補上可驗證的履歷節點（職稱、年資、著作、演講、認證），並在 `Person` schema 用 `sameAs`
串起 GitHub / LinkedIn / iThome / 書籍頁；文章底部加「關於作者」卡片（同時是轉換點）。

### P3-2 內容新鮮度（`updated` 欄位）
2019 鐵人賽的 K8S 內容、2023 的 Gen AI 內容都有時效性。`blogData` 目前只有 `date`，
`dateModified` 永遠等於發佈日。建議加 `updated?: string`，改稿時填寫，渲染成 `<time>` 並反映到 `dateModified`。
Google 對「有明確更新紀錄」的技術文章評價通常較高。

### P3-3 目錄（TOC）與標題錨點
文章頁已有 heading id，但沒有目錄。加入 TOC 有兩個好處：長文可讀性（間接影響停留時間）
與 SERP 的跳轉連結（sitelinks）。順帶把 heading id 從「原始中文標題」改成穩定 slug，避免改字就斷鏈。

### P3-4 圖片 alt 文案（內容工作）
337 張圖有 321 張 `alt=""`。這不是工程問題而是內容問題：需要人（或 AI 草稿＋人工潤飾）針對
示意圖寫描述。優先做閱讀數最高的 20 篇，投入产出比最好。

### P3-5 站外訊號
- Search Console / Bing Webmaster 完成驗證，提交 sitemap，並每月看「覆蓋範圍」
- 系列文章原始出處（若曾有 iThome 版本）確認是否有 canonical 或重複內容問題
- 有意識地在開發者社群／電子報分享，換取外部連結；技術文的外部連結比同儕互貼有效得多

### P3-6 監測節奏
每月固定看：GSC 覆蓋率與查詢 → PageSpeed Insights 手機分數 → 熱門文章的 LCP/CLS →
哪些文章有點擊但跳出率高（標題與內容不符）。

### P3-7 小修：`404.html`
`build.ts` 目前把 `index.html` 直接複製成 `404.html`，所以 404 頁帶著「canonical → 首頁」。
因為狀態碼確實是 404，Google 不會索引，風險低；但正確做法是移除 canonical、改放
`<meta name="robots" content="noindex, follow">`，並換成 404 專用標題。

### P3-8（選）多語系
若未來要出英文版，才需要 `hreflang` 與 `/en/` 路徑規劃。現階段 79 篇全中文，不需要。

---

## 七、建議執行順序

| 順序 | 項目 | 預估工作量 | 預期效果 |
|------|------|-----------|---------|
| 1 | ✅ P0-1 canonical / og:url / sitemap / JSON-LD 對齊結尾斜線（已完成） | 30 分鐘 | 標準網址與實際 200 URL 一致 |
| 2 | ✅ P0-2 圖片快取 `_headers`（已完成，待上線驗證） | 30 分鐘 | 重複瀏覽不再重新驗證每張圖 |
| 3 | ✅ P0-2 圖片壓縮成 WebP ＋ 首圖 eager ＋ width/height（已完成） | 2–3 小時 | 132.8 MB → 20.4 MB、上傳 140 MB → 38 MB |
| 4 | ✅ P0-3 相關文章 + 系列導覽（已完成） | 2 小時 | 內鏈 0 → 平均 4.1 條 |
| 5 | P1-1 系列頁 / 分類頁 | 半天 | ✅ 已新增 5 個落地頁（sitemap 90 筆） |
| 6 | P1-2 ~ P1-6 結構化資料、OG、H1、time、RSS | 半天 | ✅ 全部完成 |
| 7 | 平台：關閉 workers.dev 路由、檢查預覽 URL | 10 分鐘 | 避免重複內容 |
| 8 | P2 標題 / description 文案 | 分批進行 | CTR 與內容品質 |
| 9 | P3 作者實體、`updated`、TOC、alt 文案、站外、監測 | 持續 | 複利型收益 |

---

## 八、上線後驗收清單

Workers 設定變更後（每項都要實測，不要假設）：

1. `curl -I https://nickzhuang.com/posts/<id>` → **200**（不是 307）
2. `curl -I https://nickzhuang.com/posts` → **200**
3. `curl -I https://nickzhuang.com/about/` → 307 回 `/about`（舊 URL 收斂）
4. `curl -I https://nickzhuang.com/nonexistent` → **404**（`404-page` 仍生效）
5. `curl -I https://nickzhuang.com/articles/nvidia-cert-pro/images/AI-Factory.png` → `cache-control` 應為 `max-age=2592000` 以上
6. `curl -I https://nickzhuang.com/_headers` → 404（確認設定檔沒有被公開提供）
7. 文章頁 canonical 與實際回 200 的 URL 完全一致
8. Search Console → 網址審查 → 測試實際網址 → 確認已提交索引
9. Search Console → Sitemap 重新提交；檢查「覆蓋範圍」是否還有「頁面會重新導向」
10. Rich Results Test 驗證 `BlogPosting` / `BreadcrumbList` / `Person`
11. PageSpeed Insights（手機）確認 LCP < 2.5s、CLS < 0.1
12. 抽 3 篇圖片最多的文章，確認總傳輸量下降幅度
13. 全站爬一遍（`wget --spider -r` 或 Screaming Frog），確認改設定後沒有新增 404
