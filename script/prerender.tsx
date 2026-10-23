/**
 * 建置時靜態預渲染（SSG）
 *
 * 背景：本站是純 client-side SPA，爬蟲拿到的 HTML 是空殼，且所有頁面共用
 * index.html 寫死的 canonical（指向首頁），Google 會把所有文章頁判定為首頁
 * 重複內容而不予個別索引。
 *
 * 本腳本在 vite build 之後執行，把每個路由（首頁、靜態頁、全部文章）用
 * react-dom/server 渲染成真實靜態 HTML（含正確的 title / description /
 * canonical / og / twitter / JSON-LD），輸出到 dist/public：
 *   "/"          → dist/public/index.html
 *   "/posts/foo" → dist/public/posts/foo/index.html（Cloudflare Pages 乾淨 URL）
 * 瀏覽器端仍以 createRoot().render() 接管，靜態 HTML 兼顧 SEO 與首屏。
 *
 * 注意：此處 meta 字串需與各頁面 usePageTitle() 的呼叫保持一致。
 */
import * as React from "react";
import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { Router } from "wouter";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { ThemeProvider } from "../client/src/components/ThemeProvider";
import { Header } from "../client/src/components/Header";
import { Footer } from "../client/src/components/Footer";
import Home from "../client/src/pages/Home";
import Posts from "../client/src/pages/Posts";
import PostDetail from "../client/src/pages/PostDetail";
import About from "../client/src/pages/About";
import Timeline from "../client/src/pages/Timeline";
import Certificates from "../client/src/pages/Certificates";
import Contact from "../client/src/pages/Contact";
import { blogPosts } from "../client/src/lib/blogData";

const SITE = "https://nickzhuang.com";
const OUT_DIR = path.resolve(process.cwd(), "dist/public");
const ARTICLES_DIR = path.resolve(process.cwd(), "client/public/articles");

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  jsonLd?: object;
}

interface PageDef {
  meta: PageMeta;
  el: ReactElement;
}

const escAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** 以取代回呼執行 regex 替換，避免 $& 等特殊字組問題 */
function rep(src: string, re: RegExp, val: string): string {
  return src.replace(re, () => val);
}

function injectMeta(template: string, meta: PageMeta): string {
  // Cloudflare 上目錄式頁面最終提供的是「結尾斜線」版本（/posts/foo → 307 → /posts/foo/）。
  // canonical 必須指向真正回 200 的那個 URL，否則 canonical 指向會轉址的網址，
  // Google 會判定標準網址衝突。網址本身不變，只讓宣告對齊平台行為。
  const url = SITE + (meta.path === "/" ? "/" : meta.path.replace(/\/$/, "") + "/");
  let out = template;
  out = rep(out, /<title>[\s\S]*?<\/title>/, `<title>${escAttr(meta.title)}</title>`);
  out = rep(
    out,
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escAttr(meta.description)}"`,
  );
  out = rep(
    out,
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escAttr(meta.title)}"`,
  );
  out = rep(
    out,
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escAttr(meta.description)}"`,
  );
  out = rep(
    out,
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${url}"`,
  );
  if (meta.ogType) {
    out = rep(
      out,
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="${meta.ogType}"`,
    );
  }
  out = rep(
    out,
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${url}"`,
  );
  out = rep(
    out,
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escAttr(meta.title)}"`,
  );
  out = rep(
    out,
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escAttr(meta.description)}"`,
  );
  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
    out = out.replace("</head>", `  <script type="application/ld+json">${json}</script>\n</head>`);
  }
  return out;
}

/**
 * wouter v3 自訂靜態 location hook（SSR 用）。
 * 不用 wouter 內建 memoryLocation：它內部走 useSyncExternalStore，
 * 沒有 server snapshot，renderToString 會直接失敗。
 */
function staticHooks(routePath: string, routeSearch = "") {
  const hook = () => [routePath, () => {}] as const;
  const searchHook = () => [routeSearch, () => {}] as const;
  return { hook, searchHook };
}

function renderApp(routePath: string, el: ReactElement): string {
  const { hook, searchHook } = staticHooks(routePath);
  return renderToString(
    <Router hook={hook} searchHook={searchHook}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{el}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </Router>,
  );
}

function loadMarkdown(id: string): string | undefined {
  const f = path.join(ARTICLES_DIR, id, "index.md");
  return existsSync(f) ? readFileSync(f, "utf8") : undefined;
}

function articleJsonLd(post: (typeof blogPosts)[number]): object {
  // 與 canonical 相同：一律使用平台實際回 200 的結尾斜線 URL
  const url = `${SITE}/posts/${post.id}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: "zh-TW",
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Nick Zhuang", url: `${SITE}/about/` },
    publisher: { "@type": "Person", name: "Nick Zhuang" },
    image: [`${SITE}/og-image.png`],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };
}

export async function prerenderRoutes(): Promise<number> {
  const template = readFileSync(path.join(OUT_DIR, "index.html"), "utf8");

  const pages: PageDef[] = [
    {
      meta: {
        title: "Nick's Blog - AI異想封印 | CTO的爐邊雜談",
        description:
          "CTO的爐邊雜談 — 分享 AI 技術、系統架構、與職涯探索的深度觀點。十年軟體開發經驗，從前端到後端，從雲端到人工智慧。",
        path: "/",
      },
      el: <Home />,
    },
    {
      meta: {
        title: "所有文章 | Nick's Blog",
        description: "瀏覽所有技術文章與職涯分享。",
        path: "/posts",
      },
      el: <Posts />,
    },
    {
      meta: {
        title: "關於我 | Nick's Blog",
        description: "AI 與雲端的技術探索之路 — Nick Zhuang 的職涯介紹。",
        path: "/about",
      },
      el: <About />,
    },
    {
      meta: {
        title: "大事記 | Nick's Blog",
        description: "Nick Zhuang 的職涯大事記時間線",
        path: "/timeline",
      },
      el: <Timeline />,
    },
    {
      meta: {
        title: "證書牆 | Nick's Blog",
        description: "Nick Zhuang 所獲得的所有專業證書展示。",
        path: "/certificates",
      },
      el: <Certificates />,
    },
    {
      meta: {
        title: "聯繫我 | Nick's Blog",
        description: "如有任何技術合作、演講邀約或交流，歡迎聯繫。",
        path: "/contact",
      },
      el: <Contact />,
    },
    ...blogPosts.map((post) => ({
      meta: {
        title: `${post.title} | Nick's Blog`,
        description: post.excerpt,
        path: `/posts/${post.id}`,
        ogType: "article" as const,
        jsonLd: articleJsonLd(post),
      },
      el: <PostDetail postId={post.id} initialContent={loadMarkdown(post.id)} />,
    })),
  ];

  let ok = 0;
  const failed: string[] = [];
  for (const { meta, el } of pages) {
    try {
      const appHtml = renderApp(meta.path, el);
      const finalHtml = injectMeta(template, meta).replace(
        '<div id="root"></div>',
        () => `<div id="root">${appHtml}</div>`,
      );
      const rel = meta.path === "/" ? "index.html" : path.join(meta.path.slice(1), "index.html");
      const file = path.join(OUT_DIR, rel);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, finalHtml);
      ok++;
    } catch (err) {
      failed.push(`${meta.path}: ${(err as Error).message}`);
    }
  }

  if (failed.length) {
    console.error(`prerender: ${failed.length} 個頁面失敗：`);
    failed.forEach((f) => console.error("  - " + f));
  }
  console.log(`prerender: 成功輸出 ${ok}/${pages.length} 個靜態頁面`);
  if (ok === 0) throw new Error("prerender: 全部頁面渲染失敗");
  return ok;
}

// 直接用 tsx 執行時也自動跑一次
if (process.argv[1] && process.argv[1].includes("prerender")) {
  prerenderRoutes().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
