import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, copyFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  // 1) sitemap 寫入 client/public/，必須在 vite build 之前（public 會被複製進 dist）
  console.log("generating sitemap...");
  await import("./generate-sitemap.ts");

  console.log("generating rss feed...");
  await import("./generate-feed.ts");

  // 2) 圖片最佳化：產生 webp 與尺寸表，必須在 vite build 之前
  //    （client/src/lib/imageMeta.json 會被 bundle 進前端）
  const { optimizeImages, applyImagesToDist } = await import("./optimize-images.ts");
  await optimizeImages();

  console.log("building client...");
  await viteBuild();

  // 3) vite 已把原圖複製進 dist，這裡換成 webp 並移除原檔以縮小上傳量
  applyImagesToDist();

  // 4) 每篇文章／聚合頁的 OG 分享圖（寫進 dist，不進 repo）
  const { generateOgImages } = await import("./generate-og.ts");
  await generateOgImages();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  await copyFile("dist/public/index.html", "dist/public/404.html");
  console.log("copied index.html → 404.html");

  // 2) 靜態預渲染：把每個路由渲染成帶完整 meta/內文的靜態 HTML（SEO）
  console.log("prerendering routes...");
  const { prerenderRoutes } = await import("./prerender.tsx");
  await prerenderRoutes();
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
