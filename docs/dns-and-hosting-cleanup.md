# DNS 與主機清理記錄

> 2026-10 完成。目的是把舊 WordPress 時期（HostGator 主機）留在 DNS 裡的設定
> 清乾淨，讓 `nickzhuang.com` 只有一條明確的服務路徑、不留下可被冒用的憑證宣告。
>
> 這份檔案記錄**發現過程**與**現況**，方便日後調整 DNS 或加子網域時對照。
> 純 SEO 面的內容在 [`seo-audit.md`](./seo-audit.md)，這裡只談 DNS 與主機。

---

## 一、主機與子網域

### 背景

現在的站是 Cloudflare Workers 靜態資產，手動上傳 `dist/public`。舊站是 WordPress，
架在 HostGator。搬遷時只把 `nickzhuang.com` 綁到新的 Worker，
**舊的 DNS 記錄沒有一起清掉** —— 於是留下幾個互相矛盾的路徑。

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
nickzhuang.com          → 200（Worker 自訂網域）
www.nickzhuang.com      → 200（Worker 自訂網域）
random-sub-xyz…         → 無記錄
imap / pop / smtp / mail → 無記錄
```

`www` 回的是 **200 而不是 301**：Worker 自訂網域優先於 Redirect Rule，所以那條
轉址規則實際上空轉。**不需要處理** —— 每一頁的 canonical 都是絕對網址
`https://nickzhuang.com/…`，Google 會把 www 與 apex 合併成同一個頁面：

```bash
$ curl -s https://www.nickzhuang.com/ | grep -o 'rel="canonical" href="[^"]*'
rel="canonical" href="https://nickzhuang.com/
```

### 驗證指令

```bash
# 1. apex 與 www 都要 200
curl -s -o /dev/null -w '%{http_code}\n' https://nickzhuang.com/
curl -s -o /dev/null -w '%{http_code}\n' https://www.nickzhuang.com/

# 2. 隨機子網域必須解析不到
dig +short random-sub-xyz.nickzhuang.com A @8.8.8.8     # 應為空

# 3. 郵件子網域必須解析不到
dig +short imap.nickzhuang.com A @8.8.8.8               # 應為空

# 4. www 與 apex 的 canonical 必須完全相同
curl -s https://www.nickzhuang.com/  | grep -o 'rel="canonical" href="[^"]*'
curl -s https://nickzhuang.com/      | grep -o 'rel="canonical" href="[^"]*'
```

### 未來加子網域時注意

**不要**再加泛用記錄（`*` 或 `*.nickzhuang.com`）。原因是 Worker route 若同時是泛用的，
任何解析得到的子網域都會直接服務整份部落格 —— 對訪客是混淆，對釣魚也是現成的載體。

要新子網域就一筆一筆明確加，並在 Workers 的 Domains & Routes 對應設定。
