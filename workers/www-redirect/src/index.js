/**
 * www → apex 的永久轉址 Worker。
 *
 * 為什麼需要一支獨立 Worker：
 * 主站是「只有靜態資源」的 Worker（Workers Static Assets），沒有可以寫邏輯的 script，
 * 而 Cloudflare 的自訂網域優先於 Redirect Rule —— 只要 www 還綁在主站上，
 * 任何層級的轉址規則都不會生效，www 就永遠回 200。
 *
 * 解法是把 www 從主站的自訂網域拆下來，改綁到這支 Worker：
 * 請求一進來就回 301，讓 Google 只看到一個網址（apex）。
 *
 * 背景與 GSC 的對應症狀見 docs/dns-and-hosting-cleanup.md。
 */

const CANONICAL_HOST = "nickzhuang.com";
const REDIRECT_STATUS = 301; // 永久轉址：Google 會把 www 的訊號整併到 apex

/**
 * 補上結尾斜線，讓 301 直接落在最終會回 200 的網址上。
 *
 * 站上所有頁面都是目錄形式（`/posts/<id>/index.html`），沒有斜線的請求到了 apex
 * 還會被 Cloudflare 再 307 一次。轉址鏈短一點對整併比較好，所以在這裡一次做完。
 *
 * 判斷方式：最後一段含有「.」就當成檔案（`/rss.xml`、`/og-image.png`、
 * `/articles/<id>/index.md`）原樣保留，其餘一律補斜線。
 */
function canonicalPath(pathname) {
  if (pathname.endsWith("/")) return pathname;
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return lastSegment.includes(".") ? pathname : `${pathname}/`;
}

export default {
  fetch(request) {
    const url = new URL(request.url);

    // 保留 pathname 與 query string（?filter=、?fbclid= 這類都必須原樣帶過去）
    const target = new URL(
      canonicalPath(url.pathname) + url.search,
      `https://${CANONICAL_HOST}`,
    );

    return Response.redirect(target.toString(), REDIRECT_STATUS);
  },
};
