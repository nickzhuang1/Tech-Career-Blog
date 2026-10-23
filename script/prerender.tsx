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
import Collection from "../client/src/pages/Collection";
import { blogPosts, aboutData } from "../client/src/lib/blogData";
import { collections, collectionPath } from "../client/src/lib/collections";
import { ogFileForPost, ogFileForCollection } from "./generate-og";
import { buildTitle } from "../client/src/lib/seoTitle";
import NotFound from "../client/src/pages/not-found";
import { HOME_TAGLINE, homeDescription } from "../client/src/lib/site";

const SITE = "https://nickzhuang.com";
const OUT_DIR = path.resolve(process.cwd(), "dist/public");
const ARTICLES_DIR = path.resolve(process.cwd(), "client/public/articles");

interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  jsonLd?: object;
  /** 文章頁專用：時間與分類語意（對應 article:published_time 等 meta） */
  article?: { published: string; modified: string; section: string };
  /** 這頁專屬的分享圖（未指定時沿用 index.html 的站台預設圖） */
  image?: { url: string; width: number; height: number; alt: string };
  /** 不該被索引的頁面（如 404）：移除 canonical 與 og:url，改標 noindex, follow */
  noindex?: boolean;
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
  if (meta.noindex) {
    // 404 這類頁面：canonical 指向任何網址都是錯的（它不該有標準網址），
    // og:url 同理；改用 noindex, follow 讓爬蟲不要索引、但仍可沿著連結走。
    out = out.replace(/\s*<link rel="canonical"[^>]*>/, "");
    out = out.replace(/\s*<meta property="og:url"[^>]*>/, "");
    out = out.replace("</head>", `  <meta name="robots" content="noindex, follow">\n</head>`);
  } else {
    out = rep(
      out,
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`,
    );
  }
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
  if (meta.image) {
    out = rep(
      out,
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${meta.image.url}"`,
    );
    out = rep(
      out,
      /<meta property="og:image:width" content="[^"]*"/,
      `<meta property="og:image:width" content="${meta.image.width}"`,
    );
    out = rep(
      out,
      /<meta property="og:image:height" content="[^"]*"/,
      `<meta property="og:image:height" content="${meta.image.height}"`,
    );
    out = rep(
      out,
      /<meta property="og:image:alt" content="[^"]*"/,
      `<meta property="og:image:alt" content="${escAttr(meta.image.alt)}"`,
    );
    out = rep(
      out,
      /<meta name="twitter:image" content="[^"]*"/,
      `<meta name="twitter:image" content="${meta.image.url}"`,
    );
  }

  // 語意標記：每頁都標註作者（E-E-A-T）；文章頁再加上發佈／更新時間與分類，
  // 讓搜尋結果有機會顯示時間戳，也讓 JSON-LD 與 meta 兩邊說法一致。
  const semanticTags = [`<meta name="author" content="${escAttr(aboutData.name)}">`];
  if (meta.article) {
    semanticTags.push(
      `<meta property="article:published_time" content="${meta.article.published}">`,
      `<meta property="article:modified_time" content="${meta.article.modified}">`,
      `<meta property="article:section" content="${escAttr(meta.article.section)}">`,
    );
  }
  out = out.replace("</head>", `  ${semanticTags.join("\n  ")}\n</head>`);

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

const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const HOME_DESCRIPTION = homeDescription();

/**
 * 首頁的實體資訊（WebSite + Person）。
 * 目的是讓 Google 把「nickzhuang.com」與「Nick Zhuang / 莊翔甯」這個人綁在一起，
 * sameAs 指向 GitHub / LinkedIn 作為身分佐證（E-E-A-T 的基礎）。
 */
const homeJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${SITE}/`,
      name: "Nick's Blog - AI異想封印",
      description: HOME_DESCRIPTION,
      inLanguage: "zh-TW",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: aboutData.name,
      alternateName: aboutData.nameZh,
      url: `${SITE}/about/`,
      jobTitle: aboutData.title,
      description: aboutData.bio,
      worksFor: {
        "@type": "Organization",
        name: "C.Y. Intelligence",
        alternateName: "承羽智慧",
      },
      sameAs: [aboutData.links.github, aboutData.links.linkedin],
      knowsAbout: aboutData.expertise,
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "國立中央大學" },
        { "@type": "CollegeOrUniversity", name: "國立中興大學" },
      ],
    },
  ],
});

function articleJsonLd(post: (typeof blogPosts)[number]): object {
  // 與 canonical 相同：一律使用平台實際回 200 的結尾斜線 URL
  const url = `${SITE}/posts/${post.id}/`;
  // 沒有實質更新就沿用發佈日，不憑空造 dateModified
  const modified = post.updated ?? post.date;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.seoTitle ?? post.title,
        description: post.excerpt,
        inLanguage: "zh-TW",
        datePublished: post.date,
        dateModified: modified,
        author: {
          "@type": "Person",
          name: aboutData.name,
          url: `${SITE}/about/`,
          sameAs: [aboutData.links.github, aboutData.links.linkedin],
        },
        publisher: {
          "@type": "Person",
          name: aboutData.name,
          url: `${SITE}/about/`,
        },
        image: [`${SITE}/${ogFileForPost(post.id)}`],
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: post.category,
        keywords: post.tags.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "所有文章", item: `${SITE}/posts/` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

/**
 * 主題聚合頁的結構化資料：CollectionPage + ItemList + BreadcrumbList。
 * ItemList 讓 Google 知道這頁是一個有順序的內容集合，而不是零散連結。
 */
function collectionJsonLd(c: (typeof collections)[number]): object {
  const url = `${SITE}${collectionPath(c)}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: c.name,
        description: c.description,
        url,
        inLanguage: "zh-TW",
        isPartOf: {
          "@type": "WebSite",
          name: "Nick's Blog - AI異想封印",
          url: `${SITE}/`,
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: c.posts.length,
          itemListElement: c.posts.map((post, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/posts/${post.id}/`,
            name: post.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首頁", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "所有文章", item: `${SITE}/posts/` },
          { "@type": "ListItem", position: 3, name: c.name, item: url },
        ],
      },
    ],
  };
}

export async function prerenderRoutes(): Promise<number> {
  const template = readFileSync(path.join(OUT_DIR, "index.html"), "utf8");

  const pages: PageDef[] = [
    {
      meta: {
        title: buildTitle(HOME_TAGLINE),
        description: HOME_DESCRIPTION,
        path: "/",
        jsonLd: homeJsonLd(),
      },
      el: <Home />,
    },
    {
      meta: {
        title: buildTitle("所有文章"),
        description: "瀏覽所有技術文章與職涯分享。",
        path: "/posts",
      },
      el: <Posts />,
    },
    {
      meta: {
        title: buildTitle("關於我"),
        description: "AI 與雲端的技術探索之路 — Nick Zhuang 的職涯介紹。",
        path: "/about",
      },
      el: <About />,
    },
    {
      meta: {
        title: buildTitle("大事記"),
        description: "Nick Zhuang 的職涯大事記時間線",
        path: "/timeline",
      },
      el: <Timeline />,
    },
    {
      meta: {
        title: buildTitle("證書牆"),
        description: "Nick Zhuang 所獲得的所有專業證書展示。",
        path: "/certificates",
      },
      el: <Certificates />,
    },
    {
      meta: {
        title: buildTitle("聯繫我"),
        description: "如有任何技術合作、演講邀約或交流，歡迎聯繫。",
        path: "/contact",
      },
      el: <Contact />,
    },
    ...collections.map((c) => ({
      meta: {
        title: buildTitle(c.seoTitle),
        description: c.description,
        path: collectionPath(c),
        jsonLd: collectionJsonLd(c),
        image: {
          url: `${SITE}/${ogFileForCollection(c)}`,
          width: 1200,
          height: 630,
          alt: c.name,
        },
      },
      el: <Collection kind={c.kind} slug={c.slug} />,
    })),
    ...blogPosts.map((post) => ({
      meta: {
        title: buildTitle(post.seoTitle ?? post.title),
        description: post.excerpt,
        path: `/posts/${post.id}`,
        ogType: "article" as const,
        jsonLd: articleJsonLd(post),
        article: {
          published: post.date,
          modified: post.updated ?? post.date,
          section: post.category,
        },
        image: {
          url: `${SITE}/${ogFileForPost(post.id)}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      },
      el: <PostDetail postId={post.id} initialContent={loadMarkdown(post.id)} />,
    })),
  ];

  let ok = 0;
  const failed: string[] = [];
  for (const { meta, el } of pages) {
    try {
      const appHtml = renderApp(meta.path, el);
      const finalHtml = injectMeta(template, meta)
        .replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
        // React 18 會把 dateTime 原樣序列化成 dateTime="…"（HTML 屬性名大小寫不敏感，
        // 瀏覽器解析後就是 datetime，功能正常）。輸出成小寫讓驗證工具與人眼都不困惑。
        .replace(/dateTime="/g, 'datetime="');
      const rel = meta.path === "/" ? "index.html" : path.join(meta.path.slice(1), "index.html");
      const file = path.join(OUT_DIR, rel);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, finalHtml);
      ok++;
    } catch (err) {
      failed.push(`${meta.path}: ${(err as Error).message}`);
    }
  }

  // 404：Cloudflare 對不存在的路徑回這個檔案（狀態碼仍是 404）。
  // 用真正的 NotFound 頁預渲染，沒有 JS 的訪客才看得到內容；
  // 同時 noindex + 不帶 canonical，避免被當成首頁的重複內容。
  try {
    const notFoundHtml = injectMeta(template, {
      title: buildTitle("找不到頁面"),
      description: "找不到這個頁面。可能是網址有誤，或文章已經搬家。回首頁或所有文章重新開始。",
      path: "/404",
      noindex: true,
    })
      .replace('<div id="root"></div>', () => `<div id="root">${renderApp("/404", <NotFound />)}</div>`)
      .replace(/dateTime="/g, 'datetime="');
    writeFileSync(path.join(OUT_DIR, "404.html"), notFoundHtml);
    console.log("prerender: 404.html（noindex、無 canonical、含 NotFound 內容）");
  } catch (err) {
    failed.push(`404: ${(err as Error).message}`);
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
