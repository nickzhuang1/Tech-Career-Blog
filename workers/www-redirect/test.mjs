/**
 * www-redirect Worker 的行為測試。
 * 跑法：node workers/www-redirect/test.mjs
 *
 * 不需要任何依賴 —— Node 18+ 就有 Request / Response / URL。
 */
import worker from "./src/index.js";

const cases = [
  // [請求網址, 期望的 location]
  ["https://www.nickzhuang.com/", "https://nickzhuang.com/"],
  ["https://www.nickzhuang.com/posts", "https://nickzhuang.com/posts/"],
  ["https://www.nickzhuang.com/posts/", "https://nickzhuang.com/posts/"],
  ["https://www.nickzhuang.com/posts/cursor-ai-award", "https://nickzhuang.com/posts/cursor-ai-award/"],
  ["https://www.nickzhuang.com/posts/cursor-ai-award/", "https://nickzhuang.com/posts/cursor-ai-award/"],
  ["https://www.nickzhuang.com/about", "https://nickzhuang.com/about/"],
  ["https://www.nickzhuang.com/tag/nvidia", "https://nickzhuang.com/tag/nvidia/"],
  // 查詢字串必須原樣保留
  ["https://www.nickzhuang.com/posts?filter=K8S", "https://nickzhuang.com/posts/?filter=K8S"],
  ["https://www.nickzhuang.com/?fbclid=abc123", "https://nickzhuang.com/?fbclid=abc123"],
  [
    "https://www.nickzhuang.com/posts/?filter=Stable%20Diffusion",
    "https://nickzhuang.com/posts/?filter=Stable%20Diffusion",
  ],
  // 檔案不補斜線
  ["https://www.nickzhuang.com/rss.xml", "https://nickzhuang.com/rss.xml"],
  ["https://www.nickzhuang.com/sitemap.xml", "https://nickzhuang.com/sitemap.xml"],
  ["https://www.nickzhuang.com/robots.txt", "https://nickzhuang.com/robots.txt"],
  ["https://www.nickzhuang.com/og-image.png", "https://nickzhuang.com/og-image.png"],
  ["https://www.nickzhuang.com/og/blog-health-check.png", "https://nickzhuang.com/og/blog-health-check.png"],
  [
    "https://www.nickzhuang.com/articles/blog-health-check/index.md",
    "https://nickzhuang.com/articles/blog-health-check/index.md",
  ],
  // http 進來也要導到 https 的 apex
  ["http://www.nickzhuang.com/contact/", "https://nickzhuang.com/contact/"],
];

let pass = 0;
const failures = [];

for (const [input, want] of cases) {
  const res = await worker.fetch(new Request(input));
  const loc = res.headers.get("location");
  if (res.status === 301 && loc === want) {
    pass++;
  } else {
    failures.push(`${input}\n       得到 ${res.status} ${loc}\n       預期 301 ${want}`);
  }
}

console.log(`www-redirect: ${pass}/${cases.length} 通過`);
if (failures.length > 0) {
  for (const f of failures) console.error(`  ❌ ${f}`);
  process.exit(1);
}
