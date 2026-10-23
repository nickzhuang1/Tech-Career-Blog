/**
 * 新增文章的工具與健檢腳本。
 *
 * 用法：
 *   pnpm new:post --check              檢查全部文章（metadata + Markdown + 圖片引用）
 *   pnpm new:post --check <id>         只檢查一篇
 *   pnpm new:post --id <id> --title "..." --date 2026-09-01 --category ai \
 *        --tags "NVIDIA,AI" [--series ironman-2023] [--excerpt "..."] [--read 8] [--scaffold]
 *                                      把 metadata 寫進 blogData.ts；加 --scaffold 同時建立
 *                                      文章目錄與 Markdown 範本（已存在則不覆蓋）
 *
 * 為什麼需要這支腳本：一篇文章由三部分組成（Markdown、圖片、blogData 的 metadata），
 * 而 sitemap、RSS、OG 圖、預渲染、JSON-LD 全部由 blogData 推導。只要 metadata 有錯，
 * 建置不會失敗，但會在 Google 那邊靜默扣分（例如 excerpt 太短、id 不是合法 slug）。
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { blogPosts, categories, series } from "../client/src/lib/blogData";
import type { BlogPost } from "../client/src/lib/blogData";

const ROOT = process.cwd();
const BLOG_DATA = path.join(ROOT, "client/src/lib/blogData.ts");
const ARTICLES = path.join(ROOT, "client/public/articles");

const TITLE_MAX = 60;
const EXCERPT_MIN = 60;
const EXCERPT_MAX = 155;

type Level = "error" | "warn";
interface Issue {
  level: Level;
  post: string;
  rule: string;
  message: string;
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

/* ────────────────────────── 檢查 ────────────────────────── */

const charCount = (s: string) => [...s].length;

function markdownOf(id: string): string | undefined {
  const f = path.join(ARTICLES, id, "index.md");
  return existsSync(f) ? readFileSync(f, "utf8") : undefined;
}

function validateOne(post: BlogPost): Issue[] {
  const out: Issue[] = [];
  const add = (level: Level, rule: string, message: string) =>
    out.push({ level, post: post.id, rule, message });

  // ── id：就是網址，上線後改了等於換網址
  if (!/^[a-z0-9]+([-.][a-z0-9]+)*$/.test(post.id)) {
    add("error", "id", `不是合法 slug（只能小寫英數、連字號與小數點）：${post.id}`);
  } else if (post.id.includes(".")) {
    // 小數點合法（例如版本號 5.2），但新文章建議避免，免得與副檔名混淆
    add("warn", "id", `含小數點，新文章建議改用連字號：${post.id}`);
  }

  // ── title
  const titleLen = charCount(post.title);
  if (titleLen > TITLE_MAX) {
    add("warn", "title", `${titleLen} 字元，超過 ${TITLE_MAX}（SERP 會截斷）`);
  }

  // ── excerpt 會直接當 meta description
  const excerptLen = charCount(post.excerpt);
  if (excerptLen < EXCERPT_MIN) {
    add("warn", "excerpt", `${excerptLen} 字元，短於 ${EXCERPT_MIN}（Google 會自行拼貼描述）`);
  }
  if (excerptLen > EXCERPT_MAX) {
    add("warn", "excerpt", `${excerptLen} 字元，長於 ${EXCERPT_MAX}（SERP 會截斷）`);
  }

  // ── date / updated
  const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
  if (!isDate(post.date)) add("error", "date", `格式應為 YYYY-MM-DD：${post.date}`);
  if (post.updated) {
    if (!isDate(post.updated)) add("error", "updated", `格式應為 YYYY-MM-DD：${post.updated}`);
    else if (post.updated < post.date) add("error", "updated", `updated(${post.updated}) 早於 date(${post.date})`);
  }

  // ── category 必須在 categories 清單內，否則不會出現在任何分類篩選
  if (!categories.some((c) => c.id === post.category)) {
    add("error", "category", `不在分類清單內：${post.category}（可用：${categories.map((c) => c.id).join(", ")}）`);
  }

  // ── series 必須存在，且系列導覽的順序由 blogData 陣列順序決定
  if (post.series && !series.some((s) => s.id === post.series)) {
    add("error", "series", `不在系列清單內：${post.series}（可用：${series.map((s) => s.id).join(", ")}）`);
  }

  // ── tags
  if (post.tags.length === 0) add("warn", "tags", "沒有任何標籤");
  if (new Set(post.tags).size !== post.tags.length) add("warn", "tags", "有重複標籤");

  // ── readTime 是手寫的
  if (!/^\d+\s*min$/.test(post.readTime)) {
    add("warn", "readTime", `格式建議為 "8 min"：${post.readTime}`);
  }

  // ── Markdown 本體
  const md = markdownOf(post.id);
  if (md === undefined) {
    add("error", "markdown", `找不到 client/public/articles/${post.id}/index.md`);
    return out;
  }

  const authorLines = md.match(/^(Author|Type):/gm);
  if (authorLines) {
    add("warn", "markdown", `含 ${authorLines.length} 行 Author:/Type:（會被當純文字渲染在內文裡）`);
  }

  const imageRefs = [...md.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)];
  if (imageRefs.length === 0) {
    add("warn", "images", "沒有任何圖片（文章頁會顯得單薄）");
  }
  for (const [, alt, src] of imageRefs) {
    if (/^https?:\/\//.test(src)) {
      add("warn", "images", `外部圖片不會被轉 webp 也不會有尺寸（影響 CLS）：${src}`);
      continue;
    }
    if (!src.startsWith("./")) {
      add("error", "images", `圖片必須用相對於文章目錄的路徑（./images/...）：${src}`);
      continue;
    }
    // 整篇文章目錄都會被 optimize-images 掃描，所以 ./certs.png 這種也能轉 webp，
    // 只是慣例上統一放 images/ 較好整理
    if (!src.startsWith("./images/")) {
      add("warn", "images", `沒放在 images/ 子目錄（仍會被最佳化，但慣例建議集中）：${src}`);
    }
    const file = path.join(ARTICLES, post.id, src.replace(/^\.\//, ""));
    if (!existsSync(file)) add("error", "images", `引用的檔案不存在：${src}`);
    if (!alt.trim()) add("warn", "images", `Markdown 沒寫 alt（目前由最近標題自動補，建議人工撰寫）：${src}`);
  }

  return out;
}

function validateAll(): Issue[] {
  const issues: Issue[] = [];

  // 重複 id
  const seen = new Map<string, number>();
  for (const p of blogPosts) seen.set(p.id, (seen.get(p.id) ?? 0) + 1);
  for (const [id, n] of seen) {
    if (n > 1) issues.push({ level: "error", post: id, rule: "id", message: `重複出現 ${n} 次` });
  }

  for (const p of blogPosts) issues.push(...validateOne(p));

  // 系列順序：seriesGroups 依 blogData 陣列順序取「第 N 篇」，日期必須遞增
  for (const s of series) {
    const members = blogPosts.filter((p) => p.series === s.id);
    for (let i = 1; i < members.length; i++) {
      if (members[i].date < members[i - 1].date) {
        issues.push({
          level: "warn",
          post: `${s.id}`,
          rule: "series-order",
          message: `${members[i - 1].id}(${members[i - 1].date}) 排在 ${members[i].id}(${members[i].date}) 之前，系列導覽順序會與日期不一致`,
        });
      }
    }
  }

  // 磁碟上有目錄但 blogData 沒有對應條目（不會被建置、也不會出現在 sitemap）
  if (existsSync(ARTICLES)) {
    for (const dir of readdirSync(ARTICLES, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      if (!blogPosts.some((p) => p.id === dir.name)) {
        issues.push({
          level: "warn",
          post: dir.name,
          rule: "orphan",
          message: "有文章目錄但 blogData 沒有對應條目，不會被建置或收進 sitemap",
        });
      }
    }
  }

  return issues;
}

function report(issues: Issue[], checked: number) {
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");

  console.log(`\n檢查 ${checked} 篇文章：${errors.length} 個錯誤、${warns.length} 個警告\n`);

  if (errors.length) {
    console.log("錯誤（建置會成功，但 SEO 或渲染會出問題）：");
    for (const e of errors) console.log(`  ✗ [${e.post}] ${e.rule}: ${e.message}`);
    console.log("");
  }

  if (warns.length) {
    const byRule = new Map<string, Issue[]>();
    for (const w of warns) {
      const list = byRule.get(w.rule) ?? [];
      list.push(w);
      byRule.set(w.rule, list);
    }
    console.log("警告：");
    for (const [rule, list] of byRule) {
      console.log(`  ⚠ ${rule}（${list.length} 筆）`);
      for (const w of list.slice(0, 3)) console.log(`      ${w.post}: ${w.message}`);
      if (list.length > 3) console.log(`      …另有 ${list.length - 3} 筆`);
    }
    console.log("");
  }

  if (!issues.length) console.log("全部通過 ✓\n");
  return errors.length === 0;
}

/* ────────────────────── 寫入 blogData ────────────────────── */

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function postBlock(p: {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  readTime: string;
  series?: string;
}): string[] {
  const lines = [
    "  {",
    `    id: "${esc(p.id)}",`,
    `    title: "${esc(p.title)}",`,
    `    date: "${p.date}",`,
    `    category: "${esc(p.category)}",`,
    `    tags: [${p.tags.map((t) => `"${esc(t)}"`).join(", ")}],`,
    `    excerpt: "${esc(p.excerpt)}",`,
    `    readTime: "${esc(p.readTime)}",`,
  ];
  if (p.series) lines.push(`    series: "${esc(p.series)}",`);
  lines.push("  },");
  return lines;
}

function insertPost(block: string[], seriesId?: string) {
  const text = readFileSync(BLOG_DATA, "utf8");
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^export const blogPosts: BlogPost\[\] = \[$/.test(l));
  if (start < 0) throw new Error("找不到 blogPosts 陣列");

  // 預設插在陣列最前面（越新的文章越前面）；但若陣列開頭是說明註解，插在註解之後
  let at = start + 1;
  while (at < lines.length && /^\s*\/\//.test(lines[at])) at++;

  if (seriesId) {
    // 系列文要插在同系列最後一篇之後，否則系列導覽的「第 N 篇」會與日期脫序。
    // 注意：blogData 裡同時存在「多行物件」與「單行物件」兩種寫法（早期遷移留下的），
    // 所以不能用固定縮排比對，改成看 series 欄位所在行與物件的收尾方式。
    const marker = new RegExp(`series: "${seriesId}"`);
    let lastEnd = -1;
    for (let i = start + 1; i < lines.length; i++) {
      if (/^\];$/.test(lines[i])) break;
      if (!marker.test(lines[i])) continue;
      // 單行物件：series 宣告與收尾 `},` 在同一行
      if (/\},?\s*$/.test(lines[i])) {
        lastEnd = i;
        continue;
      }
      // 多行物件：往下找 `  },` 收尾
      for (let j = i + 1; j < lines.length; j++) {
        if (/^  \},?$/.test(lines[j])) {
          lastEnd = j;
          break;
        }
      }
    }
    if (lastEnd >= 0) at = lastEnd + 1;
  }

  lines.splice(at, 0, ...block);
  writeFileSync(BLOG_DATA, lines.join("\n"));
  return at;
}

function scaffold(id: string, title: string, readMin: number) {
  const dir = path.join(ARTICLES, id);
  const mdPath = path.join(dir, "index.md");
  mkdirSync(path.join(dir, "images"), { recursive: true });
  if (existsSync(mdPath)) {
    console.log(`  ! ${id}/index.md 已存在，保留原內容`);
    return;
  }
  const template = `# ${title}

> 一句話說明這篇文章要解決什麼問題（這段會成為讀者的第一印象）。

## 背景

說明為什麼會有這個問題、什麼情況下會遇到。

## 做法

條列或段落說明步驟。程式碼用三個反引號包起來：

\`\`\`bash
echo "hello"
\`\`\`

![在這裡寫這張圖說明什麼](./images/example.png)

## 注意事項

列出踩過的坑。

## 小結

收斂重點。
`;
  writeFileSync(mdPath, template);
  console.log(`  ✓ 建立 ${path.relative(ROOT, mdPath)}（預估閱讀 ${readMin} 分鐘）`);
  console.log(`  ✓ 建立 ${path.relative(ROOT, path.join(dir, "images"))}/`);
  console.log(`    圖片放進 images/，Markdown 用相對路徑 ![](./images/檔名.png) 引用`);
}

function estimateReadTime(id: string): number {
  const md = markdownOf(id);
  if (!md) return 5;
  const chars = charCount(md.replace(/\s/g, ""));
  return Math.max(1, Math.round(chars / 400)); // 中文閱讀速度約每分鐘 400 字
}

/* ────────────────────────── main ────────────────────────── */

function main() {
  if (flag("check")) {
    const target = args[args.indexOf("--check") + 1];
    const posts = target ? blogPosts.filter((p) => p.id === target) : blogPosts;
    if (target && posts.length === 0) {
      console.error(`找不到文章：${target}`);
      process.exit(1);
    }
    const issues = validateAll().filter((i) => !target || i.post === target);
    const ok = report(issues, posts.length);
    process.exit(ok ? 0 : 1);
  }

  const id = value("id");
  if (!id) {
    console.log(
      [
        "用法：",
        "  pnpm new:post --check [id]",
        '  pnpm new:post --id <id> --title "..." --date 2026-09-01 --category ai --tags "NVIDIA,AI"',
        "               [--series ironman-2023] [--excerpt \"...\"] [--read 8] [--scaffold]",
      ].join("\n"),
    );
    process.exit(1);
  }

  const title = value("title");
  const date = value("date");
  const category = value("category");
  const tagsRaw = value("tags");

  if (!title || !date || !category || !tagsRaw) {
    console.error("缺少必要參數：--title --date --category --tags");
    process.exit(1);
  }
  if (blogPosts.some((p) => p.id === id)) {
    console.error(`id 已存在：${id}`);
    process.exit(1);
  }
  if (!categories.some((c) => c.id === category)) {
    console.error(`category 不在清單內：${category}（可用：${categories.map((c) => c.id).join(", ")}）`);
    process.exit(1);
  }
  const seriesId = value("series");
  if (seriesId && !series.some((s) => s.id === seriesId)) {
    console.error(`series 不在清單內：${seriesId}（可用：${series.map((s) => s.id).join(", ")}）`);
    process.exit(1);
  }

  const readMin = value("read") ? Number(value("read")) : 5;
  if (flag("scaffold")) scaffold(id, title, readMin);

  const excerpt = value("excerpt") ?? "";
  const block = postBlock({
    id,
    title,
    date,
    category,
    tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    excerpt,
    readTime: `${readMin} min`,
    series: seriesId,
  });
  const at = insertPost(block, seriesId);
  console.log(`  ✓ 已寫入 client/src/lib/blogData.ts（第 ${at + 1} 行，${seriesId ? `插在 ${seriesId} 系列最後一篇之後` : "陣列最前面"}）`);

  if (!excerpt) {
    console.log("  ! excerpt 空白，請補上 60–155 字的摘要（會當 meta description）");
  }
  const est = estimateReadTime(id);
  console.log(`  i 目前內文預估閱讀時間：${est} 分鐘（可用 --read 覆寫）`);
  console.log("\n接下來：pnpm new:post --check " + id + " → pnpm build → 上傳 dist/public");
}

main();
