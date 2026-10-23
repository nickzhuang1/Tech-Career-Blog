/**
 * 產生 RSS 2.0 feed（client/public/rss.xml）
 *
 * 用途：讓讀者能訂閱、讓聚合器與部分爬蟲有穩定的更新訊號來源。
 * 與 sitemap 一致採結尾斜線 URL，避免訂閱者點進來先撞一次 307。
 *
 * 輸出位置選 client/public/ 是因為 vite build 會把 public 原樣複製進 dist，
 * 上傳 dist/public 即生效（與 generate-sitemap.ts 相同策略）。
 */
import { blogPosts } from "../client/src/lib/blogData";
import { homeDescription } from "../client/src/lib/site";
import { writeFileSync } from "fs";

const DOMAIN = "https://nickzhuang.com";
const FEED_SIZE = 30;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const postUrl = (id: string) => `${DOMAIN}/posts/${id}/`;
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

const posts = [...blogPosts]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, FEED_SIZE);

const items = posts
  .map(
    (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${postUrl(post.id)}</link>
      <guid isPermaLink="true">${postUrl(post.id)}</guid>
      <pubDate>${rfc822(post.updated ?? post.date)}</pubDate>
      <description>${esc(post.excerpt)}</description>
${post.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`,
  )
  .join("\n");

const lastBuild = rfc822(posts[0]?.updated ?? posts[0]?.date ?? "1970-01-01");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nick's Blog - AI異想封印</title>
    <link>${DOMAIN}/</link>
    <description>${esc(homeDescription())}</description>
    <language>zh-TW</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

writeFileSync("client/public/rss.xml", xml);
console.log(`rss: 生成 ${posts.length} 筆，最新 ${posts[0]?.date ?? "-"}`);
