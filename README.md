# Nick's Blog — AI 異想封印 | CTO 的爐邊雜談

Nick Zhuang 的個人技術部落格，紫色到青色漸層美學，搭配玻璃擬態與 Bento 風格排版。73 篇文章來自 Notion，全部內嵌於前端渲染。

- 專案首頁：https://nickzhuang.com
- 文章列表：https://nickzhuang.com/posts

---

## 架構

| 層面 | 技術 |
|------|------|
| Frontend | React + Vite + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Express.js（最小化，提供靜態內容） |
| Routing | wouter（client-side SPA） |
| 部署 | Cloudflare Pages |
| 字型 | Plus Jakarta Sans / Inter（sans）、Lora（serif）、JetBrains Mono（mono） |

---

## 頁面

| 路徑 | 說明 |
|------|------|
| `/` | 首頁：Hero、Stats、精選文章、近期文章、分類標籤 |
| `/posts` | 所有文章：搜尋 + 分類篩選（URL 驅動） |
| `/posts/:id` | 文章詳細頁：完整 Markdown 渲染 |
| `/about` | 關於 Nick Zhuang |
| `/contact` | 聯絡資訊 |
| `404` | 找不到頁面 |

---

## 文章分類

| 分類 | 篇數 |
|------|------|
| AI | 10 |
| 職涯 / Career | 2 |
| 人生探索 / Life | 3 |
| 深度學習 / Deep Learning | 1 |
| Gen AI（2023 鐵人賽） | 31 |
| K8S & Docker（2019 鐵人賽） | 30 |

---

## 主要檔案

| 檔案 | 說明 |
|------|------|
| `client/src/lib/blogData.ts` | 73 篇文章的 metadata、6 個分類、about 資料 |
| `client/src/content/articles.json` | 完整文章 Markdown 內容（~1MB），以 article ID 為 key |
| `client/src/pages/PostDetail.tsx` | 文章詳細頁，含自訂 Markdown 渲染器（sanitized） |
| `client/src/components/ThemeProvider.tsx` | 深色/淺色主題切換（localStorage 持久化） |
| `client/src/components/Header.tsx` | 導覽列（玻璃擬態效果） |
| `client/src/components/BlogCard.tsx` | 文章卡片元件（wouter Link） |
| `client/src/pages/Home.tsx` | 首頁：Hero、Bento 排版、精選文章、Stats |
| `client/src/pages/Posts.tsx` | 文章列表：分類篩選 + 搜尋 |
| `client/src/pages/About.tsx` | 關於頁：簡介、技能、著作 |
| `client/src/pages/Contact.tsx` | 聯絡頁 |
| `client/src/hooks/usePageTitle.ts` | SEO 頁面標題 hook |
| `script/build.ts` | 建置腳本（Vite + esbuild，並複製 404.html） |
| `script/generate-sitemap.ts` | 產生 sitemap.xml |
| `client/public/robots.txt` | 搜尋引擎爬蟲規則 |
| `client/public/sitemap.xml` | Sitemap（4 靜態頁 + 73 文章） |

---

## 設計 Token

- **主色**：Purple（hue 262），呼應 AI/科技感
- **漸層**：紫色 → 青色
- **深色背景**：Deep Navy（hue 240，5% lightness）
- **CSS 工具類**：`.gradient-text`、`.gradient-border`、`.glass`、`.hero-glow`、`.dot-grid`

---

## 設定與執行

### 安裝 nvs

```bash
export NVS_HOME="$HOME/.nvs"
git clone https://github.com/jasongin/nvs "$NVS_HOME"
. "$NVS_HOME/nvs.sh" install
```

### 確認安裝（若未生效請重啟終端機）：

```bash

nvs --version

```

### 安裝 Node.js LTS

```bash

nvs use lts

nvs link lts

```

### 確認版本：

```bash

nvs current

node -v

npm -v

```

| package | version |
|---------|---------|
| nvs     | 1.7.1   |
| node    | v24.13.0 |
| npm     | 11.6.2  |
| pnpm    | 10.28.1 |

### 安裝 pnpm

```bash

npm install -g pnpm && pnpm -v

```

### 安裝依賴

```bash

pnpm install

```

### 啟動開發伺服器

```bash

pnpm run dev

```

### 開啟 http://localhost:3000

### 建置正式版

```bash

pnpm build

```

### 產生 Sitemap

```tsx

npx tsx script/generate-sitemap.ts

```

### 建置完成後，將 dist 上傳至 Cloudflare Pages（單一目錄）。

```
注意：build 腳本會自動將 index.html 複製為 404.html，以解決 Cloudflare Pages 的 SPA 路由重新整理問題。

```

---

### Reference

- Vite: https://vitejs.dev/
- React: https://reactjs.org/
- Tailwind CSS: https://tailwindcss.com/
- Why pnpm & Vite?: https://reurl.cc/gnX7kb
