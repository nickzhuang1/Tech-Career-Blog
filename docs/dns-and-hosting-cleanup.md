# DNS 與主機清理記錄

> 2026-10 完成。目的是把舊 WordPress 時期（Bluehost 主機）留在 DNS 裡的設定
> 清乾淨，讓 `nickzhuang.com` 只有一條明確的服務路徑、不留下可被冒用的憑證宣告。
>
> 這份檔案記錄**發現過程**與**現況**，方便日後調整 DNS 或加子網域時對照。
> 純 SEO 面的內容在 [`seo-audit.md`](./seo-audit.md)，這裡只談 DNS 與主機。
>
> | 章節 | 內容 |
> |---|---|
> | 一、主機與子網域 | www 的 403／526、泛用子網域在服務整份部落格 |
> | 二、郵件冒用防護 | SPF `-all`、DMARC `p=reject`、刪除舊 DKIM 公鑰 |
> | 三、`workers.dev` 確認 | `error code: 1042` 怎麼判讀 |

---

## 一、主機與子網域

### 背景

現在的站是 Cloudflare Workers 靜態資產，手動上傳 `dist/public`。這個網域換過三次家：

| 時期 | 站台 | 備註 |
|---|---|---|
| ~2024 | WordPress（Bluehost）| 網域在 GoDaddy 買、DNS 交給 Cloudflare |
| 2025-04 | Notion + Cloudflare Worker（Fruition 式跳轉）| 只有首頁進得了索引，流量歸零 |
| 2026-03 ~ | React 靜態站 | 部署在 **Workers 靜態資產**，手動上傳 `dist/public` |

最早那次搬遷只把 `nickzhuang.com` 綁到新的 Worker，
**舊的 DNS 記錄沒有一起清掉** —— 於是留下幾個互相矛盾的路徑。
其餘兩次都沿用同一個網域與 Worker，所以問題一直沒被發現，直到 2026-10 才整個翻出來。

> **Workers 與 Pages 的區別**：Cloudflare 後台把兩者放在同一個頁面（Workers & Pages），
> `_headers`、`_redirects`、404 處理的規則也幾乎相同，所以很容易混稱。
> 本站在 2026-03 之後一直是 **Workers 靜態資產**（證據：`workers.dev` 子網域存在、
> `not_found_handling: 404-page` 的設定方式）。早期文章裡寫的「Pages」是同一個後台頁面的俗稱。

### 症狀（清理前）

```bash
$ curl -sI https://www.nickzhuang.com/
HTTP/2 403
cf-mitigated: challenge        # Cloudflare 發人機驗證（Googlebot UA 也一樣）

$ curl -s -o /dev/null -w '%{http_code}' https://www.nickzhuang.com/robots.txt
526                            # SSL handshake failed

$ curl -s -o /dev/null -w '%{http_code}' https://random-sub-xyz.nickzhuang.com/
200                            # 隨便一個子網域都在服務整個部落格
```

清理前的 DNS 記錄：

| 記錄 | 類型 | 內容 | 問題 |
|---|---|---|---|
| `*.nickzhuang.com` | A | 66.235.200.146（舊主機） | 任何子網域都解析成功，再被 Worker route `*.nickzhuang.com/*` 接走 → 無限多個主機名都在服務同一份內容 |
| `www` | CNAME | → `nickzhuang.com` | 指回 apex，而 apex 是 **Worker 自訂網域、沒有 origin** → Cloudflare 連不到 → 526；HTML 路徑則被 challenge |
| `imap` / `pop` / `smtp` | CNAME | → `mail.nickzhuang.com` | 郵件主機已下線，且沒有任何 MX 記錄 |

### 診斷關鍵：526 證明 Worker 沒有參與

只看 403 會誤判成「WAF 規則擋住」。真正定位問題的是這一組對照：

| 路徑 | www | apex |
|---|---|---|
| `/og/k8s-intro.png` | **526** | 200 |
| `/assets/index-*.css` | **526** | 200 |

這些檔案**只存在於新部署的 Worker 裡**。如果 www 走 Worker，不可能回 526 ——
`526` 是「Cloudflare 連 origin 失敗」，而 Worker 沒有 origin。

所以 www 的請求根本沒進 Worker，這也是為什麼：

- Redirect Rule（www → apex 301）**完全沒作用**
- WAF 規則是空的，卻出現 `cf-mitigated: challenge` —— 那個 challenge 不是這個 zone 發的

### 修復步驟

1. **Workers & Pages → 該 Worker → Settings → Domains & Routes**
   - 刪除 route `*.nickzhuang.com/*`（改成只服務 apex）
   - 新增 **Custom domain** `www.nickzhuang.com`
     （自訂網域會由 Cloudflare 建立對應的受管 DNS 記錄，**不要**自己手動加 CNAME）
2. **DNS → Records**
   - 刪除泛用記錄 `*.nickzhuang.com`
   - 刪除 `www` 的 CNAME（交給上一步的自訂網域接管）
   - 刪除 `imap` / `pop` / `smtp`

**順序很重要**：先加自訂網域、再刪舊記錄，中間才不會出現解析空窗。
反過來做（先刪 CNAME），www 會短暫 NXDOMAIN。

### 清理後現況

```
nickzhuang.com          → 200（主站 Worker 自訂網域）
www.nickzhuang.com      → 301 → https://nickzhuang.com/…（www-redirect Worker）
random-sub-xyz…         → 無記錄
imap / pop / smtp / mail → 無記錄
```

### 為什麼 www 一開始只能回 200

第一輪修復時 `www` 綁的是**主站**的自訂網域，而 Worker 自訂網域優先於 Redirect Rule，
所以那條「www → apex 301」的規則實際上空轉。當時的判斷是「不影響索引」：每頁 canonical
都是絕對網址 `https://nickzhuang.com/…`，Google 會自己把兩個主機合併。

### 後來還是改成 301 了（2026-11）

GSC 的覆蓋率報告顯示這個判斷不夠：`www` 的 41 個網址（21 筆「頁面會重新導向」、
20 筆「替代頁面」）一直掛在未索引清單裡，而且 `www` 與 apex 各有一份完整副本，
對爬取預算與訊號整併都是持續的損耗。

主站是「只有靜態資源」的 Worker，沒有 script 可以寫判斷，因此**另建一支只做轉址的
Worker** 綁在 `www` 上：`workers/www-redirect/`（含部署步驟與 17 個案例的行為測試）。

| | 之前 | 現在 |
|---|---|---|
| `www` 綁在哪 | 主站 Worker 自訂網域 | `www-redirect` Worker 自訂網域 |
| 回應 | 200（內容與 apex 相同）| 301 → apex |
| GSC 上的 www 變體 | 41 筆掛在未索引 | 收斂到 apex |

轉址 Worker 會順手補上結尾斜線（最後一段含「.」視為檔案不加），
讓 301 直接落在最終回 200 的網址上，不必再讓 apex 多 307 一次。

### 驗證指令

```bash
# 1. apex 要 200、www 要 301
curl -s -o /dev/null -w '%{http_code}\n' https://nickzhuang.com/            # 200
curl -sI https://www.nickzhuang.com/ | head -2                              # 301 + location

# 2. 隨機子網域必須解析不到
dig +short random-sub-xyz.nickzhuang.com A @8.8.8.8     # 應為空

# 3. 郵件子網域必須解析不到
dig +short imap.nickzhuang.com A @8.8.8.8               # 應為空

# 4. www 的轉址要保留路徑與查詢字串
curl -sI 'https://www.nickzhuang.com/posts?filter=K8S' | grep -i '^location'
#   預期 location: https://nickzhuang.com/posts/?filter=K8S
```

### 未來加子網域時注意

**不要**再加泛用記錄（`*` 或 `*.nickzhuang.com`）。原因是 Worker route 若同時是泛用的，
任何解析得到的子網域都會直接服務整份部落格 —— 對訪客是混淆，對釣魚也是現成的載體。

要新子網域就一筆一筆明確加，並在 Workers 的 Domains & Routes 對應設定。

---

## 二、郵件冒用防護

### 問題：沒有信箱，不代表不會被冒用

清理主機時站長問了一個關鍵問題：「沒寫郵件記錄，會不會有人冒用我的網域寄信？」

**會，而且原本的設定幾乎沒有抵抗力。** 冒用（spoofing）防的是「有人拿你的網域當
寄件人」，這件事跟有沒有 MX（收信）無關，只跟 **SPF / DKIM / DMARC** 三種 TXT 記錄有關。

清理前的狀態：

| 記錄 | 值 | 問題 |
|---|---|---|
| SPF | `v=spf1 ip4:162.241.218.148 a mx include:websitewelcome.com ~all` | `~all` 是 **softfail** —— 收件端通常「標記可疑但照樣收下」。而 `include:websitewelcome.com` 是 Bluehost（Newfold 集團）cPanel 的預設值，`ip4:162.241.218.148` 反查就是 `box5570.bluehost.com` —— 兩者都是舊主機留下的授權 |
| DMARC | （無） | 完全沒有政策，Gmail／Outlook 想擋也沒有依據 |
| DKIM | `default._domainkey`（有記錄） | **最危險的一項**：DNS 裡留著舊主機時代的**公鑰**，對應的**私鑰在舊主機上**。誰能存取那台舊機，就能簽出「通過 DKIM 驗證」的信 |
| MX | （無） | 從來沒有收信服務 |

### 修復：SPF 硬拒絕 + DMARC reject + 刪除舊公鑰

```
# ① 取代原本的 SPF（DNS → Records，編輯現有 TXT）
v=spf1 -all
```

`-all` 的意思是「**沒有任何伺服器**被授權用這個網域寄信」。既然沒有郵件服務，
這是最乾淨的姿態。

```
# ② 新增 DMARC（DNS → Records → Add）
Type:    TXT
Name:    _dmarc
Content: v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; pct=100; rua=mailto:nickzhuang1@gmail.com; fo=1
```

| 參數 | 作用 |
|---|---|
| `p=reject` | 驗證失敗的信**直接拒收**（不只是標記） |
| `sp=reject` | 子網域也套用同一政策 |
| `adkim=s; aspf=s` | 嚴格對齊，冒用者更難繞過 |
| `pct=100` | 100% 套用（不是抽樣） |
| `rua=mailto:…` | 每週收到聚合報告，**看得到誰在冒用** |
| `fo=1` | 任一驗證失敗就發報告 |

```
# ③ 刪除舊的 DKIM 公鑰（DNS → Records）
default._domainkey    TXT    （刪除）
```

**判斷依據**：沒有 MX（不收信）、`mail.nickzhuang.com` 已是 NXDOMAIN（郵件主機不存在）、
SPF 裡的授權全是舊主機商 —— 確認沒有在用，才刪得下去。
若日後真的要用信箱，屆時由新的服務商提供新的 DKIM 記錄。

### 現況（2026-10 驗證）

```bash
$ dig +short nickzhuang.com TXT @8.8.8.8
"v=spf1 -all"
"google-site-verification=IY92lITr28uu7v63NZx9p10HrswpRuEwi0xDqtJK2yw"

$ dig +short _dmarc.nickzhuang.com TXT @8.8.8.8
"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; pct=100; rua=mailto:nickzhuang1@gmail.com; fo=1"

$ dig +short default._domainkey.nickzhuang.com TXT @8.8.8.8
（空）

$ dig +short nickzhuang.com MX @8.8.8.8
（空）
```

`google-site-verification` 是 Search Console 的驗證記錄，**保留不動**。

### 驗證與監測

```bash
dig +short nickzhuang.com TXT @8.8.8.8           # 應只剩 v=spf1 -all
dig +short _dmarc.nickzhuang.com TXT @8.8.8.8    # 應為 p=reject
dig +short default._domainkey.nickzhuang.com TXT # 應為空
```

24–48 小時後可用外部工具確認實際生效：

- MXToolbox DMARC checker — <https://mxtoolbox.com/DMARC.aspx>
- dmarcian DMARC Inspector — <https://dmarcian.com/dmarc-inspector/>

之後每週會收到 `rua` 指定的信箱寄來的聚合報告。**如果報告裡出現你不認識的寄件來源，
那就是有人在冒用**，可以在 Cloudflare 的 Email Security 或信件來源 IP 上進一步封鎖。

### 若未來要開信箱（重要）

`v=spf1 -all` + `p=reject` 是「這個網域完全不寄信」的設定。
一旦要用 Gmail 的「以此地址寄信」、Google Workspace、或任何主機商的信箱，
**必須先改這兩筆**，否則你自己寄出的信會被收件端直接退件。

| 服務 | SPF 需要加 | DKIM |
|---|---|---|
| Google Workspace / Gmail 轉寄 | `include:_spf.google.com` | 由 Google 提供 `google._domainkey` |
| 主機商（如 Bluehost） | 該主機商提供的 `include:` | 由主機商提供 |
| 自架 SMTP | `ip4:<你的 IP>` | 自行產生金鑰並發布公鑰 |

DMARC 建議的調校節奏：先用 `p=none` 觀察 1–2 週的報告，確認沒有正常信件被誤擋，
再改成 `p=quarantine`、最後 `p=reject`。

---

## 三、`workers.dev` 確認

Worker 部署後預設會開一個 `<worker>.<帳號>.workers.dev` 的公開網址。那是**獨立的
hostname**，會被搜尋引擎當成另一個站 —— 同一份內容出現在兩個網域上，是需要關掉的
重複內容來源。

### 關閉後的驗證

```bash
$ curl -s -o /dev/null -w '%{http_code}\n' https://broken-paper-0b6f.andy345694.workers.dev/
404

$ curl -s https://broken-paper-0b6f.andy345694.workers.dev/
error code: 1042
```

### 判讀：`error code: 1042` 是什麼

它是 Cloudflare 的「**這個 hostname 上沒有綁定任何 Worker**」。

關鍵是它**不是**網站回的 404 頁 —— 回應是 17 bytes 的純文字，沒有 HTML、沒有 `title`：

| 檢查 | 結果 |
|---|---|
| 首頁本文 | `error code: 1042`（純文字，17 bytes） |
| 含站名特徵 | 0 次 |
| `<title>` 標籤 | 不存在 |

所以內容完全沒有被送出，Google 就算拿到這個網址也只會看到 404，不會索引。
**這是理想的關閉狀態。**

### 兩個容易誤判的點

**1. DNS 會解析 ≠ Worker 有開**

```bash
$ dig +short broken-paper-0b6f.andy345694.workers.dev
172.67.212.187
104.21.23.183
```

`*.workers.dev` 是泛用記錄，**任何**亂打的名稱都會解析成功、也都會回 1042。
判斷是否關閉要看**回應本文**，不是看解析結果。

**2. `workers.dev` 上的 `/robots.txt` 不是你的**

```bash
$ curl -s https://broken-paper-0b6f.andy345694.workers.dev/robots.txt
# As a condition of accessing this website, you agree to abide by the following
# content signals:
```

那是 Cloudflare `workers.dev` 自己的 robots.txt（content signals 聲明），跟本站無關。
本站的 robots.txt 只有一行 Sitemap：

```bash
$ curl -s https://nickzhuang.com/robots.txt
User-agent: *
Allow: /
Sitemap: https://nickzhuang.com/sitemap.xml
```

### 若日後重新部署後失效

用 `wrangler` 部署時要明確保留：

```toml
# wrangler.toml
workers_dev = false
```

用 Dashboard 手動上傳則在該 Worker 的 **Settings → Domains & Routes** 確認
沒有 `<name>.workers.dev` 這一項；沒列出來就是關閉狀態。

---

## 四、部署後的邊緣改寫：Cloudflare 會注入 JSD 腳本（2026-11 結案）

### 現象

線上 HTML 的 `<body>` 結尾固定多出一段約 **1.1 KB** 的腳本，本地的 `dist` 裡完全沒有：

```html
<script>(function(){function c(){var b=a.contentDocument||...;
  window.__CF$cv$params={r:'a57e...',t:'MTc5...'};
  ...'/cdn-cgi/challenge-platform/scripts/jsd/main.js?ray=a57e...'...
})();</script>
```

這是 Cloudflare 的 **JavaScript Detections（JSD）**：把一段偵測腳本塞進一個 1×1 的隱藏 iframe，
用來做被動的機器人指紋收集，不會擋任何請求。

### 怎麼確認是「即時注入」而不是「快取裡的舊副本」

腳本裡嵌了當次請求的 ray ID。連兩次請求比對：

```bash
for i in 1 2; do
  curl -s https://nickzhuang.com/ | grep -o "r:'[a-f0-9]*'" | head -1
done
#   兩次不同 → 每次請求都在注入（不是快取）
#   兩次相同 → 快取裡有舊副本，清快取即可
```

另外比對大小最直觀：本地首頁 45,578 bytes、線上 46,692 bytes，**差 1,114 bytes 就是它**。

### 排除了什麼（都實測過）

| 假設 | 驗證方式 | 結果 |
|---|---|---|
| Bot Fight Mode 開著 | Security → Bots 的開關截圖（灰＝關）| ✅ 已關，仍注入 |
| WAF 自訂規則的挑戰動作 | 帳號內無任何 Custom rules／Rate limiting rules | ✅ 排除 |
| 托管規則集（Cloudflare Managed … Default）| 關閉後等 2 分鐘再測 ×3 | ✅ 仍注入，已還原 |
| Under Attack Mode | 若開啟，`curl` 會被擋成挑戰頁 | ✅ 排除（`curl` 拿到完整 200 HTML）|
| 依啟發式判斷（Managed Challenge）| 純 `curl`／完整瀏覽器標頭／Googlebot UA／帶 cookie 全部一樣 | ✅ 四個都是 1（無條件全面注入）|

**結論：Free 版沒有對應開關，關不掉。** 這是帳號層級的 bot 管理元件自行套用的。

### 影響評估：不用處理

| 面向 | 影響 |
|---|---|
| Google 索引與排名 | **零**。Googlebot UA 實測拿到完整 HTML，canonical、JSON-LD、內文都正常 |
| 效能 | 每頁 +1.1 KB、+1 個 `/cdn-cgi/` 請求 |
| 隱私 | Cloudflare 的指紋偵測，站長拿不到資料 |
| **實務困擾** | **線上 HTML 的 md5 永遠不等於本地 `dist`** |

### 實務對策

**驗證「上傳的檔案是不是新版」時，比對 `sitemap.xml` 而不是 HTML：**

```bash
md5 -q dist/public/sitemap.xml
curl -s https://nickzhuang.com/sitemap.xml | md5 -q
#   兩者相同 = 檔案已是最新（HTML 頁面因為注入，md5 一定不同）
```

`docs/seo-audit.md` 第八章的驗收清單第 18 項就是這一條。

### 不要做的事

**不要為了 strip 這 1.1 KB 把主站改成 script 型 Worker。** 那會把「手動上傳 `dist/public`」
換成「維護 `wrangler` 部署流程」，代價遠大於收益。同理也不建議加一層 Worker 做 HTML 後處理。

**這條路已經走完，三個月後再看到線上 HTML 跟本地不一樣時，直接跳過。**
