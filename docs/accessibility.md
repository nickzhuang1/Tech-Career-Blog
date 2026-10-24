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
