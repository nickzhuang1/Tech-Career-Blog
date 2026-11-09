# www-redirect Worker

把 `www.nickzhuang.com` 永久轉址（301）到 `nickzhuang.com`。

## 為什麼要獨立一支 Worker

主站是**只有靜態資源**的 Worker（Workers Static Assets），沒有可以寫邏輯的 script；
而 Cloudflare 的**自訂網域優先於 Redirect Rule** —— 只要 `www` 還綁在主站上，
任何層級的轉址規則都會被蓋掉，`www` 就永遠回 200。

所以把 `www` 從主站的自訂網域拆下來、改綁到這支 Worker，請求一進來就回 301。

## 部署（Dashboard，不需要 wrangler）

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Worker**
2. 名稱填 `www-redirect` → Deploy
3. **Edit code** → 把 `src/index.js` 全部貼上去 → **Deploy**
4. 該 Worker → **Settings → Domains & Routes** → **Add → Custom domain**
   → 填 `www.nickzhuang.com` → Add
5. 回到**主站 Worker** → **Settings → Domains & Routes**
   → 移除 `www.nickzhuang.com` 這筆自訂網域

> **順序很重要**：同一個自訂網域不能同時掛在兩支 Worker 上，所以一定要「先加新的、再移除舊的」。
> 中間會有幾十秒 `www` 沒有 Worker 接手（會回 522），可接受。
> 反過來做（先移除）的空窗期一樣長，但順序錯誤容易停在那裡忘了加回來。

## 驗證

```bash
curl -sI https://www.nickzhuang.com/ | head -3
#   預期 HTTP/2 301、location: https://nickzhuang.com/

curl -sI https://www.nickzhuang.com/posts/ | grep -i '^location'
#   預期 location: https://nickzhuang.com/posts/

curl -sI 'https://www.nickzhuang.com/posts?filter=K8S' | grep -i '^location'
#   預期 location: https://nickzhuang.com/posts/?filter=K8S（查詢字串要保留）

curl -sI https://www.nickzhuang.com/rss.xml | grep -i '^location'
#   預期 location: https://nickzhuang.com/rss.xml（檔案不加斜線）

# apex 不受影響
curl -s -o /dev/null -w '%{http_code}\n' https://nickzhuang.com/          # 200
curl -s -o /dev/null -w '%{http_code}\n' https://nickzhuang.com/about/    # 200
```

## 行為

| 請求 | 回應 |
|---|---|
| `www/` | `301 → https://nickzhuang.com/` |
| `www/posts` （無斜線） | `301 → https://nickzhuang.com/posts/` （直接補斜線，不多跳一次 307） |
| `www/posts?filter=K8S` | `301 → https://nickzhuang.com/posts/?filter=K8S` |
| `www/rss.xml`、`www/og/x.png` | `301 → 同路徑`（最後一段含「.」視為檔案，不加斜線） |
| `http://www/...` | 先被 Always Use HTTPS 導到 https，再由本 Worker 導到 apex |

## 本機測試

```bash
node workers/www-redirect/test.mjs      # 17 個案例，0 依賴
```
