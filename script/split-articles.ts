import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const INPUT = join(ROOT, "client/src/content/articles.json");
const OUTPUT_DIR = join(ROOT, "client/public/articles");

const raw = await readFile(INPUT, "utf-8");
const articles = JSON.parse(raw);

await mkdir(OUTPUT_DIR, { recursive: true });

const ids = Object.keys(articles);
console.log(`共 ${ids.length} 篇文章，開始拆分...`);

for (const id of ids) {
  const outPath = join(OUTPUT_DIR, `${id}.md`);
  await writeFile(outPath, articles[id], "utf-8");
  console.log(`  ✓ ${id}.md`);
}

console.log(`\n完成！輸出目錄：${OUTPUT_DIR}`);