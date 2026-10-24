# Nick's Blog — AI 異想封印 | CTO 的爐邊雜談

Nick Zhuang 的個人技術部落格。React SPA + 建置時靜態預渲染（SSG），79 篇文章以手寫 Markdown 保存，
每一頁都輸出完整的 title / description / canonical / OG / JSON-LD 靜態 HTML。

- 專案首頁：https://nickzhuang.com
- 文章列表：https://nickzhuang.com/posts
- RSS：https://nickzhuang.com/rss.xml

---

## 架構

| 層面 | 技術 |
|------|------|
| Frontend | React 18 + Vite 7 + TypeScript + TailwindCSS + shadcn/ui |
| Routing | wouter（client-side SPA） |
| 預渲染 | `script/prerender.tsx`，建置時以 `react-dom/server` 輸出 90 個靜態頁 |
| 圖片 | 建置時用 sharp 轉 WebP（寬度上限 1600）並產生尺寸表 |
| OG 圖 | 建置時用 sharp 合成 1200×630 標題卡（每篇專屬） |
| 伺服器 | Express 僅供本機預覽；正式站是純靜態 |
| 部署 | Cloudflare Workers Static Assets（手動上傳 `dist/public`） |
| 字型 | Plus Jakarta Sans（sans）、JetBrains Mono（mono） |

SEO 健檢報告與待辦分級見 [`docs/seo-audit.md`](docs/seo-audit.md)。
無障礙基線（色票規則、axe 驗證方式）見 [`docs/accessibility.md`](docs/accessibility.md)。
DNS 與主機清理記錄見 [`docs/dns-and-hosting-cleanup.md`](docs/dns-and-hosting-cleanup.md)。

---

## 頁面

| 路徑 | 說明 |
|------|------|
| `/` | 首頁：Hero、Stats、精選文章、近期文章 |
| `/posts` | 所有文章：搜尋 + 分類／標籤篩選（URL 驅動） |
| `/posts/:id` | 文章詳細頁，含自訂 Markdown 渲染器 |
| `/series/:slug` | 系列聚合頁（30 篇的 2019 / 2023 鐵人賽） |
| `/category/:slug` | 分類聚合頁 |
| `/tag/:slug` | 標籤聚合頁 |
| `/about` `/timeline` `/certificates` `/contact` | 靜態頁 |
| 404 | 找不到頁面（`404.html`） |

聚合頁由 `client/src/lib/collections.ts` 定義，目前 5 頁；只有「排除系列後仍有獨立內容」的聚落才會建頁。

---

## 內容現況

| 分類 | 篇數 |
|------|------|
| Gen AI | 31（其中 30 篇屬 2023 鐵人賽系列） |
| K8S & Docker | 30（其中 30 篇屬 2019 鐵人賽系列） |
| AI | 12 |
| 人生探索 | 3 |
| 職涯 | 2 |
| 深度學習 | 1 |

系列：`ironman-2023`（30 篇）、`ironman-2019`（30 篇）。
Sitemap 共 90 筆 = 6 靜態頁 + 5 聚合頁 + 79 篇文章。

---

## 新增文章

一篇文章由**三個部分**組成，sitemap／RSS／OG 圖／預渲染／JSON-LD 全部由 blogData 自動推導：

| 部分 | 位置 |
|------|------|
| 內文 | `client/public/articles/<id>/index.md` |
| 圖片 | `client/public/articles/<id>/images/*.png`（Markdown 用 `./images/xxx.png` 引用） |
| metadata | `client/src/lib/blogData.ts` 的 `blogPosts` 陣列 |

### 建議流程

```bash
# 1) 建立目錄、images/ 與 Markdown 範本，並寫入 metadata
pnpm new:post --id my-new-post --title "文章標題" --date 2026-09-01 \
  --category ai --tags "NVIDIA,AI" --read 8 --excerpt "60–155 字的摘要" --scaffold

# 2) 寫內容、把圖片放進 images/，然後檢查
pnpm check:posts my-new-post

# 3) 建置並上傳 dist/public
pnpm build
```

已有 Markdown、只想補 metadata 時，去掉 `--scaffold` 即可。
系列文加上 `--series ironman-2023`，工具會自動插在該系列最後一篇之後
（系列導覽的「第 N 篇」是照陣列順序算的）。

### 六條必守規則

| 規則 | 為什麼 |
|------|--------|
| `id` 用英文 kebab-case，**上線後不要改** | 網址就是 `/posts/<id>/`，改了等於換網址 |
| `date` 用 `YYYY-MM-DD` | sitemap `lastmod`、JSON-LD、RSS 都吃這個格式 |
| `excerpt` 寫 60–155 字 | 直接當 meta description；太短 Google 會自行拼貼 |
| `title` ≤ 60 字元 | 超過會被 SERP 截斷 |
| `category` 只能用那 6 個 id | 填別的值不會出現在任何分類篩選 |
| 系列文的 `series` 要存在且順序正確 | 否則「上一篇／下一篇」會跳錯 |

### 常見地雷

- 圖片用**相對路徑**（`./images/x.png`）：webp 轉檔、`width`/`height`、首圖 eager 都靠這個對應。
  外部圖片網址不會被最佳化，會影響 CLS。
- **不要寫 `Author:` / `Type:` 這種行**：沒有程式解析，會被當純文字渲染在內文裡。
- `readTime` 是手寫的欄位，可用 `--read` 指定。
- 修訂既有文章時在 blogData 該篇加 `updated: "2026-09-01"`，頁面與 JSON-LD 會顯示更新時間。

---

## 建置流程

`pnpm build` 依序執行：

| 步驟 | 腳本 | 產出 |
|------|------|------|
| 1 | `script/generate-sitemap.ts` | `client/public/sitemap.xml`（90 筆，全部結尾斜線） |
| 2 | `script/generate-feed.ts` | `client/public/rss.xml`（最新 30 篇） |
| 3 | `script/optimize-images.ts` | 337 張 WebP + `client/src/lib/imageMeta.json`（132.8 MB → 20.4 MB） |
| 4 | `vite build` | `dist/public`（前端 bundle 與靜態資源） |
| 5 | `optimize-images（apply）` | 以 WebP 取代原圖並移除原檔 |
| 6 | `script/generate-og.ts` | 84 張 1200×630 標題卡 → `dist/public/og/` |
| 7 | esbuild | `dist/index.cjs`（本機預覽用，**不需上傳**） |
| 8 | `script/prerender.tsx` | 90 個含完整 meta 的靜態 HTML ＋ `404.html`（noindex、無 canonical） |

`script/` 底下的建置腳本不在 `tsconfig.json` 的 include 範圍內，型別檢查走獨立設定：

```bash
pnpm typecheck         # client + server + script 三邊都檢查
pnpm typecheck:script  # 只檢查建置腳本（改 script/ 之後先跑這個）
```

最終 `dist/public` 約 46 MB、703 個檔案。

---

## 部署

正式站是 Cloudflare Workers Static Assets，**手動**把 `dist/public` 的內容上傳到資源根目錄
（讓 `_headers`、`_redirects`、`404.html`、`robots.txt`、`sitemap.xml`、`rss.xml` 落在根層）。

不要上傳 `dist/index.cjs`。上傳後可快速驗證：

```bash
curl -sI https://nickzhuang.com/posts/<id>/ | head -1                        # 200
curl -s https://nickzhuang.com/posts/<id>/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://nickzhuang.com/sitemap.xml | grep -c '<loc>'                  # 90
curl -sI https://nickzhuang.com/no-such-page | head -1                        # 404
curl -s https://nickzhuang.com/404.html | grep -o 'noindex\|rel="canonical"'  # 只有 noindex
curl -sI https://nickzhuang.com/articles/<id>/images/<file>.webp | grep -i cache-control
```

`client/public/_headers` 控制快取（`/assets/*` immutable、`/articles/*` 30 天）。

---

## 開發指令

| 指令 | 說明 |
|------|------|
| `pnpm dev` | 開發伺服器（http://localhost:3000） |
| `pnpm build` | 完整建置（含 sitemap、RSS、圖片、OG 圖、預渲染） |
| `pnpm check` | TypeScript 型別檢查 |
| `pnpm check:posts [id]` | 文章健檢（metadata、Markdown、圖片引用） |
| `pnpm new:post ...` | 建立新文章並寫入 metadata |
| `pnpm sitemap` | 只重跑 sitemap |
| `pnpm start` | 以 `dist/index.cjs` 起本機正式版伺服器 |

### 提交前檢查（husky）

`git commit` 時會自動跑 `.husky/pre-commit`：

```
▸ typecheck            pnpm typecheck（tsc + tsconfig.script.json）
▸ check:posts          文章健檢，0 個錯誤才放行（警告不擋）
```

擋的是「不會讓建置失敗、但會在 Google 那邊靜默扣分」的錯誤：`excerpt` 太短、
`id` 不是合法 slug、標題超過 SERP 寬度、`updated` 早於 `date`、`category` 不在清單內。

沒放進 hook 的三件事與理由寫在 `.husky/pre-commit` 的註解：Prettier／lint-staged
（這個 repo 從未用過，硬加會把 79 篇 Markdown 整批重排）、`pnpm build`（40 秒以上，
且 `dist` 是手動上傳的）、測試（repo 沒有測試套件，`check:posts` 就是這個站的測試）。

急用時可 `git commit --no-verify` 跳過；`pnpm install` 會透過 `prepare` 自動裝回 hook。

---

## 主要檔案

| 檔案 | 說明 |
|------|------|
| `client/src/lib/blogData.ts` | 79 篇文章 metadata、6 分類、2 系列、about 資料 |
| `client/src/lib/collections.ts` | 聚合頁定義與導讀文案 |
| `client/src/lib/imageMeta.json` | 圖片尺寸對照表（建置產物，**需進版控**，否則 `pnpm dev` 會失敗） |
| `client/src/pages/PostDetail.tsx` | 文章頁與自訂 Markdown 渲染器（圖片改寫、alt fallback、H1 降階） |
| `client/src/pages/Collection.tsx` | 系列／分類／標籤聚合頁 |
| `client/src/hooks/usePageTitle.ts` | 頁面級 meta（title/description/canonical/og:url） |
| `script/prerender.tsx` | SSG 預渲染與 JSON-LD（BlogPosting / BreadcrumbList / CollectionPage / WebSite / Person） |
| `script/optimize-images.ts` | 圖片轉 WebP 與尺寸表 |
| `script/generate-og.ts` | OG 標題卡合成 |
| `script/generate-sitemap.ts` / `generate-feed.ts` | sitemap 與 RSS |
| `script/new-post.ts` | 文章健檢與 metadata 寫入 |
| `client/public/_headers` / `_redirects` | Cloudflare 快取標頭與轉址 |

---

## 設計 Token

- **主色**：Purple（hue 262），呼應 AI/科技感
- **漸層**：紫色 → 青色
- **深色背景**：Deep Navy（hue 240）
- **CSS 工具類**：`.gradient-text`、`.gradient-border`、`.glass`、`.hero-glow`、`.dot-grid`

---

## 環境安裝

```bash
# Node（透過 nvs）
curl -fsSL https://raw.githubusercontent.com/jasongin/nvs/master/nvs.sh | bash
nvs add lts && nvs link lts

# pnpm
npm install -g pnpm

# 依賴
pnpm install
```

| 套件 | 版本 |
|------|------|
| node | v24.x |
| pnpm | 10.x |
| react | 18.3 |
| vite | 7.x |

---

### Reference

- Vite: https://vitejs.dev/
- React: https://reactjs.org/
- Tailwind CSS: https://tailwindcss.com/
