import { blogPosts } from "../client/src/lib/blogData";
import { collections, collectionPath } from "../client/src/lib/collections";
import { writeFileSync } from "fs";

const DOMAIN = "https://nickzhuang.com";
const now = new Date().toISOString().split("T")[0];

/**
 * 一頁「最後實質變動」的日期：改稿日優先，沒改過才用發佈日。
 * 忽略 updated 會讓 P3-2 白做 —— 填了更新的文章在 sitemap 裡仍宣稱是發佈日。
 */
const lastTouched = (p: { date: string; updated?: string }) => p.updated ?? p.date;

/**
 * 全站最新內容日期，用來當首頁、列表頁與 About 這類靜態頁的 lastmod。
 * 原本這些頁面用的是「建置當天」，於是每次 build 都宣稱整站更新了 ——
 * Google 判定 lastmod 不可靠之後會直接忽略這個欄位，反而失去新鮮度訊號。
 */
const siteLatest = blogPosts.reduce((m, p) => (lastTouched(p) > m ? lastTouched(p) : m), "");

/**
 * Cloudflare 對目錄式頁面（<path>/index.html）實際提供的是「結尾斜線」版本：
 *   /posts/foo  → 307 → /posts/foo/  (200)
 * sitemap 若列出無斜線版本，每個 URL 都會先撞一次轉址。
 * 這裡統一輸出結尾斜線版本，讓 sitemap → 200 直達，
 * 且與 prerender.tsx 產生的 canonical 完全一致。
 */
const withTrailingSlash = (p: string) =>
  p === "/" ? "/" : p.replace(/\/$/, "") + "/";

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/posts", priority: "0.9", changefreq: "daily" },
  { url: "/about", priority: "0.8", changefreq: "monthly" },
  { url: "/timeline", priority: "0.6", changefreq: "monthly" },
  { url: "/certificates", priority: "0.6", changefreq: "monthly" },
  { url: "/contact", priority: "0.5", changefreq: "monthly" },
];

// 主題聚合頁（系列 / 分類 / 標籤）：有獨立導讀文案，值得被索引
const collectionEntries = collections.map((c) => {
  const latest = c.posts.reduce((m, p) => (lastTouched(p) > m ? lastTouched(p) : m), "");
  return `
  <url>
    <loc>${DOMAIN}${withTrailingSlash(collectionPath(c))}</loc>
    <lastmod>${latest || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

const urls = [
  ...staticPages.map(p => `
  <url>
    <loc>${DOMAIN}${withTrailingSlash(p.url)}</loc>
    <lastmod>${siteLatest || now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ...blogPosts.map(post => `
  <url>
    <loc>${DOMAIN}${withTrailingSlash(`/posts/${post.id}`)}</loc>
    <lastmod>${lastTouched(post)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
${collectionEntries.join("")}
</urlset>`;

writeFileSync("client/public/sitemap.xml", xml);
console.log(
  `生成完成，共 ${staticPages.length + collections.length + blogPosts.length} 個 URL`,
);
