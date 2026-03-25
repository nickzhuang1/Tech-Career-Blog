import { blogPosts } from "../client/src/lib/blogData";
import { writeFileSync } from "fs";

const DOMAIN = "https://nickzhuang.com";
const now = new Date().toISOString().split("T")[0];

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/posts", priority: "0.9", changefreq: "daily" },
  { url: "/about", priority: "0.8", changefreq: "monthly" },
  { url: "/contact", priority: "0.5", changefreq: "monthly" },
];

const urls = [
  ...staticPages.map(p => `
  <url>
    <loc>${DOMAIN}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ...blogPosts.map(post => `
  <url>
    <loc>${DOMAIN}/posts/${post.id}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

writeFileSync("client/public/sitemap.xml", xml);
console.log(`生成完成，共 ${staticPages.length + blogPosts.length} 個 URL`);