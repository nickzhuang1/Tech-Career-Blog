/**
 * 建置時產生每篇文章與每個聚合頁的 OG 分享圖（1200×630 PNG）。
 *
 * 背景：原本 79 篇文章全部指向同一張 og-image.png，社群分享時每篇長得一樣，
 * 點擊率沒有辨識度。這裡用 sharp 的 SVG 渲染能力即時合成標題卡：
 * 漸層底 + 分類標籤 + 文章標題（自動換行、字級自適應）+ 站名與日期。
 *
 * 兩個實作上的注意點：
 * 1. sharp 內建 librsvg 會忽略 font-family（四種字型名輸出的位元組完全相同），
 *    但漢字與中文標點都能正確渲染，font-weight="bold" 也有效，所以不指定字型、
 *    只用字級與粗體控制版面。
 * 2. 輸出直接寫進 dist/public/og（不進 repo），用標題內容的 hash 做快取，
 *    標題沒改就完全不重繪。
 */
import sharp from "sharp";
import { createHash } from "crypto";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { blogPosts, series } from "../client/src/lib/blogData";
import { collections } from "../client/src/lib/collections";

const W = 1200;
const H = 630;
const MARGIN = 80;
/** 版面規則改動時要 +1，否則會沿用舊快取 */
const LAYOUT_VERSION = 2;
const CACHE_DIR = path.resolve(".cache/og");
const OUT_DIR = path.resolve("dist/public/og");

/** OG 圖的站內路徑（prerender 需要同一份規則） */
export const ogFileForPost = (id: string) => `og/${id}.png`;
export const ogFileForCollection = (c: (typeof collections)[number]) =>
  `og/${c.kind}-${c.slug}.png`;

interface Card {
  file: string;
  kicker: string;
  title: string;
  footer: string;
}

const seriesName = (id?: string) =>
  id ? (series.find((s) => s.id === id)?.name ?? id) : undefined;

const CATEGORY_LABEL: Record<string, string> = {
  ai: "AI",
  career: "職涯",
  life: "人生探索",
  "deep-learning": "深度學習",
  "gen-ai": "Gen AI",
  "k8s-docker": "K8S & Docker",
};

const KIND_LABEL: Record<string, string> = {
  series: "系列",
  category: "分類",
  tag: "主題",
};

const cards: Card[] = [
  ...blogPosts.map((post) => ({
    file: ogFileForPost(post.id),
    kicker:
      seriesName(post.series) ?? CATEGORY_LABEL[post.category] ?? post.category,
    title: post.title,
    footer: post.date,
  })),
  ...collections.map((c) => ({
    file: ogFileForCollection(c),
    kicker: `${KIND_LABEL[c.kind]} · ${c.posts.length} 篇`,
    title: c.name,
    footer: c.scope,
  })),
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** 粗略字寬估算：全形字 1em、拉丁字母約 0.56em（用來決定換行與字級） */
function charWidth(ch: string): number {
  const code = ch.codePointAt(0) ?? 0;
  if (code === 32) return 0.3;
  if (
    (code >= 0x2e80 && code <= 0x9fff) || // CJK
    (code >= 0xac00 && code <= 0xd7af) || // 韓文
    (code >= 0xff00 && code <= 0xff60) || // 全形
    (code >= 0x3000 && code <= 0x303f) // 中文標點
  ) {
    return 1;
  }
  if (code >= 65 && code <= 90) return 0.64; // 大寫
  if (code >= 48 && code <= 57) return 0.56;
  return 0.5;
}

/** 依「每行不超過 3 行」的規則挑字級，並回傳換行結果 */
function layout(title: string): { size: number; lines: string[] } {
  const maxWidth = W - MARGIN * 2;
  // 短標題（如「緣起」）用大字級，長標題逐級下修，避免整張圖留白
  for (const size of [96, 84, 68, 60, 52, 44, 38]) {
    const lines: string[] = [];
    let cur = "";
    let width = 0;
    for (const ch of title) {
      const w = charWidth(ch) * size;
      if (width + w > maxWidth && cur.length > 0) {
        lines.push(cur);
        cur = ch;
        width = w;
      } else {
        cur += ch;
        width += w;
      }
    }
    if (cur.length > 0) lines.push(cur);
    if (lines.length <= 3) return { size, lines };
  }
  // 標題極長：硬切三行並加省略號
  const size = 38;
  const perLine = Math.floor(maxWidth / size);
  const raw = [...title];
  const lines = [
    raw.slice(0, perLine).join(""),
    raw.slice(perLine, perLine * 2).join(""),
    raw.slice(perLine * 2, perLine * 3 - 1).join("") + "…",
  ];
  return { size, lines };
}

function buildSvg(card: Card): string {
  const { size, lines } = layout(card.title);
  const lineHeight = Math.round(size * 1.35);
  const blockHeight = lines.length * lineHeight;
  // 內文區塊垂直居中（略偏上，讓 footer 有喘息空間）
  const firstBaseline = Math.round((H - blockHeight) / 2 + size * 0.85);

  const titleTspans = lines
    .map(
      (line, i) =>
        `<tspan x="${MARGIN}" y="${firstBaseline + i * lineHeight}">${esc(line)}</tspan>`,
    )
    .join("");

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#12102a"/>
      <stop offset="55%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1080" cy="80" r="240" fill="#22d3ee" opacity="0.10"/>
  <circle cx="1010" cy="590" r="180" fill="#a855f7" opacity="0.12"/>
  <rect x="${MARGIN}" y="${firstBaseline - size - 54}" width="72" height="6" fill="url(#accent)"/>
  <text x="${MARGIN}" y="${firstBaseline - size - 70}" font-size="28" font-weight="bold"
        fill="#67e8f9" letter-spacing="1.5">${esc(card.kicker)}</text>
  <text font-size="${size}" font-weight="bold" fill="#f8fafc">${titleTspans}</text>
  <text x="${MARGIN}" y="${H - 64}" font-size="26" fill="#94a3b8">nickzhuang.com</text>
  <text x="${W - MARGIN}" y="${H - 64}" font-size="26" fill="#94a3b8" text-anchor="end">${esc(card.footer)}</text>
</svg>`;
}

export async function generateOgImages(): Promise<void> {
  mkdirSync(CACHE_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  let made = 0;
  let cached = 0;
  let blank = 0;

  for (const card of cards) {
    const key = createHash("sha1")
      .update(JSON.stringify({ kicker: card.kicker, title: card.title, footer: card.footer, v: LAYOUT_VERSION }))
      .digest("hex")
      .slice(0, 16);
    const cachePath = path.join(CACHE_DIR, `${key}.png`);
    const outPath = path.join(OUT_DIR, path.basename(card.file));

    if (existsSync(cachePath)) {
      copyFileSync(cachePath, outPath);
      cached++;
      continue;
    }

    const png = await sharp(Buffer.from(buildSvg(card)))
      .png({ compressionLevel: 9 })
      .toBuffer();

    // 健檢：萬一字型缺字或版面壞掉，至少能從建置輸出看出來
    const { data, info } = await sharp(png)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let lit = 0;
    for (let i = 0; i < data.length; i += 3) if (data[i] > 200) lit++;
    if (lit < 300) {
      blank++;
      console.warn(`  ⚠ ${card.file} 文字覆蓋率過低（${lit} px）`);
    }

    writeFileSync(cachePath, png);
    writeFileSync(outPath, png);
    made++;
  }

  console.log(
    `og: ${cards.length} 張（新繪 ${made}、快取 ${cached}${blank ? `、異常 ${blank}` : ""}）`,
  );
}

// 直接用 tsx 執行時也跑一次（方便單獨測試）
if (process.argv[1] && process.argv[1].includes("generate-og")) {
  generateOgImages().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
