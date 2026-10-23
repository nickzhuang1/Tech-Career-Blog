/**
 * 建置時圖片最佳化
 *
 * 背景：文章內嵌 337 張 PNG/JPG，總計 133 MB，最大單張 3.1 MB，且沒有 width/height
 * 造成 LCP 過慢與 CLS。這裡在 build 時一次轉成 WebP（寬度上限 1600px、quality 80），
 * 並輸出尺寸對照表給前端 <img> 使用。
 *
 * 流程（見 script/build.ts）：
 *   1. optimizeImages()      → 產生 .cache/images 底下的 webp 與 client/src/lib/imageMeta.json
 *   2. vite build            → 把 client/public 原圖複製進 dist
 *   3. applyImagesToDist()   → 把 webp 覆蓋進 dist，並刪掉已被取代的原圖（減少上傳量）
 *   4. prerender             → 產出的 HTML 會引用 webp 並帶 width/height
 *
 * 快取：以來源檔 mtime 判斷，沒改過的圖不會重轉，重複建置幾乎零成本。
 */
import sharp from "sharp";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import path from "path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "client/public/articles");
const CACHE_DIR = path.join(ROOT, ".cache/images");
const META_CACHE = path.join(ROOT, ".cache/images-meta.json");
const META_JSON = path.join(ROOT, "client/src/lib/imageMeta.json");

const RASTER = /\.(png|jpe?g)$/i;
const MAX_WIDTH = 1600;
const QUALITY = 80;

export interface ImageEntry {
  /** 相對於 /articles/ 的輸出路徑（.webp，或原檔表示不值得轉換） */
  src: string;
  w: number;
  h: number;
  bytes: number;
}

type MetaMap = Record<string, ImageEntry>;

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === ".DS_Store") continue;
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

const toPosix = (p: string) => p.split(path.sep).join("/");

export async function optimizeImages(): Promise<void> {
  const started = Date.now();
  const files = walk(ARTICLES_DIR).filter((f) => RASTER.test(f));
  mkdirSync(path.dirname(META_CACHE), { recursive: true });

  const prev: MetaMap = existsSync(META_CACHE)
    ? (JSON.parse(readFileSync(META_CACHE, "utf8")) as MetaMap)
    : {};

  const meta: MetaMap = {};
  let converted = 0;
  let cached = 0;
  let keptOriginal = 0;
  let originalBytes = 0;
  let outputBytes = 0;

  for (const abs of files) {
    const relKey = toPosix(path.relative(ARTICLES_DIR, abs)); // 例如 nvidia-cert-pro/images/AI-Factory.png
    const webpRel = relKey.replace(RASTER, ".webp");
    const webpAbs = path.join(CACHE_DIR, webpRel);
    const srcStat = statSync(abs);
    originalBytes += srcStat.size;

    const cachedEntry = prev[relKey];
    const fresh =
      cachedEntry &&
      cachedEntry.src === webpRel &&
      existsSync(webpAbs) &&
      statSync(webpAbs).mtimeMs >= srcStat.mtimeMs;

    if (fresh) {
      meta[relKey] = cachedEntry;
      outputBytes += cachedEntry.bytes;
      cached++;
      continue;
    }

    mkdirSync(path.dirname(webpAbs), { recursive: true });
    const out = await sharp(abs, { failOn: "none" })
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer({ resolveWithObject: true });

    // 極少數情況（本來就是小檔）webp 反而更大 → 保留原檔
    if (out.data.length >= srcStat.size) {
      rmSync(webpAbs, { force: true });
      const dim = await sharp(abs, { failOn: "none" }).metadata();
      meta[relKey] = {
        src: relKey,
        w: dim.width ?? 0,
        h: dim.height ?? 0,
        bytes: srcStat.size,
      };
      outputBytes += srcStat.size;
      keptOriginal++;
      continue;
    }

    writeFileSync(webpAbs, out.data);
    meta[relKey] = {
      src: webpRel,
      w: out.info.width,
      h: out.info.height,
      bytes: out.data.length,
    };
    outputBytes += out.data.length;
    converted++;
  }

  writeFileSync(META_CACHE, JSON.stringify(meta));

  // 給前端 bundle 用的精簡版（不含 bytes）
  const slim: Record<string, { src: string; w: number; h: number }> = {};
  for (const [k, v] of Object.entries(meta)) slim[k] = { src: v.src, w: v.w, h: v.h };
  writeFileSync(META_JSON, JSON.stringify(slim));

  const mb = (n: number) => (n / 1024 / 1024).toFixed(1) + " MB";
  console.log(
    `images: ${files.length} 張（轉換 ${converted}、快取 ${cached}、保留原檔 ${keptOriginal}）` +
      ` ${mb(originalBytes)} → ${mb(outputBytes)}，耗時 ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
}

/**
 * 把 webp 覆蓋進 dist，並移除已被 webp 取代的原圖，讓上傳量降到最低。
 * 任何沒有對應項的檔案（例如 .gif、.svg）一律不動。
 */
export function applyImagesToDist(): void {
  const distArticles = path.join(ROOT, "dist/public/articles");
  if (!existsSync(distArticles)) {
    throw new Error(`applyImagesToDist: 找不到 ${distArticles}，請先跑 vite build`);
  }
  const meta = JSON.parse(readFileSync(META_JSON, "utf8")) as Record<
    string,
    { src: string; w: number; h: number }
  >;

  let copied = 0;
  let removed = 0;
  for (const [origRel, entry] of Object.entries(meta)) {
    if (entry.src === origRel) continue; // 保留原檔的策略，不用複製也不用刪
    const from = path.join(CACHE_DIR, entry.src);
    const to = path.join(distArticles, entry.src);
    if (!existsSync(from)) continue;
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(from, to);
    copied++;

    const origAbs = path.join(distArticles, origRel);
    if (existsSync(origAbs)) {
      rmSync(origAbs);
      removed++;
    }
  }
  console.log(`images: 複製 ${copied} 張 webp 進 dist，移除 ${removed} 張原圖`);
}

// 直接用 tsx 執行時（除錯用）
if (process.argv[1] && process.argv[1].includes("optimize-images")) {
  (async () => {
    await optimizeImages();
    if (existsSync(path.join(ROOT, "dist/public/articles"))) applyImagesToDist();
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
