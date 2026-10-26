import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { blogPosts, series, aboutData, shortBio } from "@/lib/blogData";
import { contactChannels } from "@/lib/contactLinks";
import { collectionForSeries, collectionForTag, collectionPath } from "@/lib/collections";
import imageMetaJson from "@/lib/imageMeta.json";

/**
 * 建置時由 script/optimize-images.ts 產生的圖片尺寸對照表。
 * key = "<articleId>/<markdown 內的相對路徑>"，value = 實際輸出檔（webp）與原始尺寸。
 * 用途：1) 把 src 換成 webp  2) 補 width/height 避免 CLS
 */
type ImageMetaEntry = { src: string; w: number; h: number };
const IMAGE_META = imageMetaJson as Record<string, ImageMetaEntry>;

// 開發模式（vite dev）直接吃 client/public 的原圖，不指向建置才產生的 webp；
// production bundle 會把這個判斷常數化並移除死分支。
const IS_DEV = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);

function resolveArticleImage(
  rawSrc: string,
  articleId?: string,
): { src: string; w?: number; h?: number } {
  if (rawSrc.startsWith("http") || !articleId) return { src: rawSrc };
  const rel = rawSrc.replace(/^\.\//, "");
  const entry = IMAGE_META[`${articleId}/${rel}`];
  if (entry && entry.w && entry.h) {
    const src = IS_DEV ? `/articles/${articleId}/${rel}` : `/articles/${entry.src}`;
    return { src, w: entry.w, h: entry.h };
  }
  return { src: `/articles/${articleId}/${rel}` };
}

function seriesName(id: string) {
  return series.find((s) => s.id === id)?.name ?? id;
}
import { usePageTitle } from "@/hooks/usePageTitle";
import { buildTitle } from "@/lib/seoTitle";
import { useTheme } from "@/components/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ChevronRight, Clock, ExternalLink } from "lucide-react";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("yaml", yaml);

function MermaidDiagram({ chart, id }: { chart: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useEffect(() => {
    if (!ref.current) return;
    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: theme === "dark" ? "dark" : "default" });
      mermaid.render(`${id}-${theme}`, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      }).catch(() => {
        if (ref.current) ref.current.textContent = chart;
      });
    });
  }, [chart, id, theme]);
  return <div ref={ref} className="my-6 overflow-x-auto" />;
}

// 系列分組查表：seriesId → 依 blogData 順序排列的 articleId 陣列
const seriesGroups: Record<string, string[]> = (() => {
  const groups: Record<string, string[]> = {};
  for (const post of blogPosts) {
    if (post.series) {
      if (!groups[post.series]) groups[post.series] = [];
      groups[post.series].push(post.id);
    }
  }
  return groups;
})();

/**
 * 相關文章：tag 交集為主，同分類／同系列為輔。
 *
 * 重寫前，文章頁的靜態 HTML 裡「文章 → 文章」的內部連結是 0 條，
 * 79 篇文章等於只有 /posts 一個入口，主題聚落彼此沒有訊號交流。
 * 這裡補上 3 條，讓相關主題互相串連（排序必須穩定，否則 prerender 與 hydration 會不一致）。
 */
function relatedPosts(current: (typeof blogPosts)[number], count = 3) {
  return blogPosts
    .filter((p) => p.id !== current.id)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => current.tags.includes(t)).length;
      const score =
        sharedTags * 2 +
        (p.category === current.category ? 1 : 0) +
        (p.series && p.series === current.series ? 1 : 0);
      return { post: p, score };
    })
    // 門檻 2 分＝至少一個共同標籤。只有「同分類」的 1 分不算相關：
    // 全站分類只有 6 個，光憑分類會把毫無關係的文章湊在一起
    // （實測：SEO 健檢文底部曾出現 NVIDIA 考照與研發主管心得）。
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, count)
    .map((x) => x.post);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderMarkdown(md: string, articleId?: string, fallbackAlt?: string): JSX.Element[] {
  const rawLines = md.split("\n");
  const out: JSX.Element[] = [];
  let keyIdx = 0;
  const nk = () => `md-${keyIdx++}`;

  // ── 標題錨點：先把整篇的 id 算好 ─────────────────────────────────
  // 為什麼要先掃一遍而不是邊渲染邊算：「提要」清單的錨點連結出現在所有標題之前，
  // 等渲染到它時後面的標題都還沒登記，只能靠預掃才對得上。
  // 重複標題（6 篇文章有）依出現順序加上 -2、-3，避免重複 id 讓第二個錨點永遠跳到第一個。
  const headingIdBySlug = new Map<string, string>();
  {
    let inFence = false;
    for (const line of rawLines) {
      if (line.replace(/^[\u200B\uFEFF\u00A0\u180E\u2060]+/, "").startsWith("```")) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const m = line.match(/^#{1,4} (.*)$/);
      if (!m) continue;
      const slug = slugifyHeading(m[1]) || "section";
      // 只記每個 slug 的第一次出現：內文的 `#錨點` 一律指向第一個同名標題，
      // 後面的重複標題會拿到 -2、-3 後綴（見下面的渲染計數）。
      if (!headingIdBySlug.has(slug)) headingIdBySlug.set(slug, slug);
    }
  }
  // 重複標題必須拿到不同 id，否則第二個以後的錨點永遠跳到第一個
  const usedHeadingIds = new Map<string, number>();
  const headingId = (text: string) => {
    const base = slugifyHeading(text) || "section";
    const n = (usedHeadingIds.get(base) ?? 0) + 1;
    usedHeadingIds.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
  /** 內文寫的 `#錨點` 也走同一套轉換，才不會因為大小寫或標點全形半形而斷鏈 */
  const anchorHref = (frag: string) => {
    const slug = slugifyHeading(frag);
    return `#${headingIdBySlug.get(slug) ?? slug}`;
  };

  // ── 圖片處理（SEO / CWV）──────────────────────────────────────────
  // 1) 第一章圖 eager + fetchpriority=high：它通常是 LCP 元素，原本被 lazy 延後
  // 2) 其餘 lazy
  // 3) 缺 alt 時用最近的標題當描述，至少有上下文而不是空字串
  //    （2026-10 已為 247 張補上人工撰寫的 alt；剩下 74 張是各篇封面與裝飾圖，刻意留空）
  let imgSeq = 0;
  let lastHeading = "";
  const altOf = (alt: string): string => {
    const t = alt.trim();
    if (t) return t;
    const base = lastHeading || fallbackAlt || "";
    return base ? `${base} 示意圖` : "";
  };
  const imgLoading = (): { loading: "eager" | "lazy"; fetchpriority?: "high" } => {
    const first = imgSeq === 0;
    imgSeq++;
    return first ? { loading: "eager", fetchpriority: "high" } : { loading: "lazy" };
  };

  function esc(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(text: string): string {
    let s = esc(text);
    // 先將跳脫的 \* \[ \] 換成 HTML entity，避免誤判為格式標記
    s = s.replace(/\\\*/g, "&#42;");
    s = s.replace(/\\\[/g, "&#91;");
    s = s.replace(/\\\]/g, "&#93;");
    s = s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
      // image-as-link: [![alt](imgSrc)extraText](linkUrl)
      .replace(/\[!\[([^\]]*)\]\(([^)]+)\)([^\]]*)\]\(([^)]+)\)/g, (_, alt, imgSrc, extraText, url) => {
        const resolvedSrc = resolveArticleImage(imgSrc, articleId).src;
        const safe = url.startsWith("#") ? anchorHref(url.slice(1))
          : url.startsWith("http") || url.startsWith("/") ? url : "#";
        const ext = !url.startsWith("#") ? ` target="_blank" rel="noopener noreferrer"` : "";
        return `<a href="${safe}"${ext} class="inline-flex items-center gap-1.5 text-primary-strong underline underline-offset-2">`
          + `<img src="${resolvedSrc}" alt="${alt}" class="inline-block h-5 w-5 object-contain align-middle" />`
          + (extraText.trim() ? `<span>${extraText.trim()}</span>` : "")
          + `</a>`;
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, url) => {
        const safe = url.startsWith("#") ? anchorHref(url.slice(1))
          : url.startsWith("http") || url.startsWith("/") ? url : "#";
        const ext = !url.startsWith("#") ? ` target="_blank" rel="noopener noreferrer"` : "";
        return `<a href="${safe}"${ext} class="text-primary-strong underline underline-offset-2">${t}</a>`;
      });
    return s;
  }

  const stripInvis = (l: string) => l.replace(/^[\u200B\uFEFF\u00A0\u180E\u2060]+/, "");
  const isCodeFence = (l: string) => stripInvis(l).startsWith("```");
  const indentOf = (l: string) => (l.match(/^( *)/) ?? ["", ""])[1].length;
  const isItem = (l: string) => /^ *(?:[-*]|\d+\\?\.) \S/.test(l);
  const isOrd = (l: string) => /^ *\d+\\?\. /.test(l);
  const itemTxt = (l: string) => l.replace(/^ *(?:[-*]|\d+\\?\.) /, "");
  const isBlock = (l: string) => isCodeFence(l) || /^(?:#{1,4} |---|!\[|>|\|)/.test(l);
  const UL_MARKERS = ['●', '○', '■', '□', '▶', '▷'];

  /** 遞迴將 list block 的行組成巢狀 JSX */
  function buildList(ls: string[], base: number, k: string, depth: number = 0): JSX.Element {
    type Item = { text: string; ord: boolean; sub: string[] };
    const items: Item[] = [];

    for (let j = 0; j < ls.length;) {
      const line = ls[j];
      if (line.trim() === "") { j++; continue; }
      if (isItem(line) && indentOf(line) === base) {
        items.push({ text: itemTxt(line), ord: isOrd(line), sub: [] });
      } else if (items.length) {
        items[items.length - 1].sub.push(line);
      }
      j++;
    }

    if (!items.length) return <></>;

    const ordered = items[0].ord;
    const Tag = ordered ? "ol" : "ul";
    const cls = ordered
      ? "list-decimal pl-6 my-2 space-y-1"
      : "list-none pl-6 my-2 space-y-1";
    const marker = ordered ? null : UL_MARKERS[depth % 6];

    return (
      <Tag key={k} className={cls}>
        {items.map((item, idx) => {
          const subItems = item.sub.filter(isItem);
          const hasNested = subItems.length > 0;
          const nestedBase = hasNested ? Math.min(...subItems.map(indentOf)) : 0;
          const cont = item.sub.filter(l => !isItem(l) && l.trim() !== "");

          return (
            <li key={`${k}-${idx}`} className={`leading-relaxed${marker ? " flex gap-2" : ""}`}>
              {marker && <span className="shrink-0 mt-0.5 select-none">{marker}</span>}
              <div>
                {(() => {
                  const hm = item.text.match(/^(#{1,4}) (.+)/);
                  if (hm) {
                    const hcls = ["text-base font-bold", "text-base font-bold", "text-sm font-bold", "text-sm font-semibold"][hm[1].length - 1];
                    return <span className={hcls} dangerouslySetInnerHTML={{ __html: inline(hm[2]) }} />;
                  }
                  return <span dangerouslySetInnerHTML={{ __html: inline(item.text) }} />;
                })()}
                {cont.map((l, ci) => {
                  const imgM = l.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                  if (imgM) {
                    const img = resolveArticleImage(imgM[2], articleId);
                    return (
                      <img
                        key={ci}
                        src={img.src}
                        alt={altOf(imgM[1] || "")}
                        width={img.w}
                        height={img.h}
                        className="rounded-md max-w-full h-auto my-2"
                        {...imgLoading()}
                      />
                    );
                  }
                  return (
                    <span key={ci} className="block mt-0.5"
                      dangerouslySetInnerHTML={{ __html: inline(l.trim()) }} />
                  );
                })}
                {hasNested && buildList(item.sub, nestedBase, `${k}-${idx}`, depth + 1)}
              </div>
            </li>
          );
        })}
      </Tag>
    );
  }

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];

    if (isCodeFence(line)) {
      const lang = stripInvis(line).slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < rawLines.length && !isCodeFence(rawLines[i])) code.push(rawLines[i++]);
      if (lang === "mermaid") {
        const k = nk();
        out.push(<MermaidDiagram key={k} id={k} chart={code.join("\n")} />);
      } else {
        const raw = code.join("\n");
        const hasRedMark = /\*\*[^]+?\*\*/.test(raw);

        let highlighted: string;
        if (hasRedMark) {
          // 有紅字標記時，跳過 hljs，手動 escape 並注入紅色 span
          highlighted = raw
            .split(/(\*\*[^]+?\*\*)/)
            .map(part => {
              if (part.startsWith("**") && part.endsWith("**")) {
                const inner = part.slice(2, -2)
                  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return `<span class="text-red-400 font-semibold">${inner}</span>`;
              }
              return part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            })
            .join("");
        } else {
          try {
            highlighted = lang && hljs.getLanguage(lang)
              ? hljs.highlight(raw, { language: lang }).value
              : hljs.highlightAuto(raw).value;
          } catch {
            highlighted = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          }
        }

        out.push(
          <pre key={nk()} className="hljs bg-muted/50 border border-border/30 rounded-md p-4 my-4 overflow-x-auto">
            <code
              className="text-[13px] font-mono leading-relaxed whitespace-pre"
              data-lang={lang || undefined}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </pre>
        );
      }
    } else if (line.startsWith("\\#")) {
      const txt = line.slice(1); // 去掉反斜線，保留 "# ..."
      out.push(
        <p key={nk()} className="my-3 leading-relaxed">
          <span className="text-blue-500 font-medium"
            dangerouslySetInnerHTML={{ __html: inline(txt) }} />
        </p>
      );
    } else if (/^(#{1,4}) /.test(line)) {
      const mdLevel = (line.match(/^(#{1,4}) /) ?? ["", ""])[1].length;
      // 文章標題已是頁面唯一的 h1；內文的 "# " 降一階渲染成 h2。
      // 79 篇裡有 60 篇原本會出現兩個 h1，爬蟲難以判斷頁面主題。
      const lv = mdLevel === 1 ? 2 : mdLevel;
      const txt = line.replace(/^#{1,4} /, "");
      lastHeading = plainHeading(txt);
      const Tag = `h${lv}` as "h2" | "h3" | "h4";
      const hcls = [
        "text-2xl font-bold mt-10 mb-4 scroll-mt-20",
        "text-xl font-bold mt-10 mb-4 scroll-mt-20",
        "text-lg font-bold mt-8 mb-3 scroll-mt-20",
        "text-base font-bold mt-6 mb-2 scroll-mt-20",
      ][lv - 1];
      out.push(<Tag key={nk()} id={headingId(txt)} className={hcls} dangerouslySetInnerHTML={{ __html: inline(txt) }} />);
    } else if (line.startsWith("![")) {
      const m = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (m) {
        const img = resolveArticleImage(m[2], articleId);
        out.push(
          <figure key={nk()} className="my-6">
            <img
              src={img.src}
              alt={altOf(m[1] || "")}
              width={img.w}
              height={img.h}
              className="rounded-md max-w-full h-auto"
              {...imgLoading()}
            />
          </figure>
        );
      }
    } else if (line.startsWith("---")) {
      out.push(<hr key={nk()} className="my-6 border-border/40" />);
    } else if (line.startsWith("> ")) {
      out.push(
        <blockquote key={nk()} className="border-l-2 border-primary/40 pl-4 my-4 text-muted-foreground">
          <p dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />
        </blockquote>
      );
    } else if (isItem(line)) {
      // 收集完整 list block（含空行、巢狀、continuation text）
      const block: string[] = [];
      let blanks = 0;
      while (i < rawLines.length) {
        const cur = rawLines[i];
        if (isBlock(cur) && block.length) break;
        if (cur.trim() === "") {
          blanks++;
          if (blanks >= 2) break;
          // 看下一個非空行，若是 block-level 或非縮排的普通段落，就停止收集
          let j = i + 1;
          while (j < rawLines.length && rawLines[j].trim() === "") j++;
          if (j < rawLines.length && (isBlock(rawLines[j]) || (!isItem(rawLines[j]) && indentOf(rawLines[j]) === 0))) break;
          block.push(cur); i++;
        } else {
          blanks = 0;
          block.push(cur); i++;
        }
      }
      const base = Math.min(...block.filter(isItem).map(indentOf));
      out.push(buildList(block, base, nk()));
      continue;
    } else if (line.startsWith("|")) {
      // 收集連續的表格行
      const block: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|")) {
        block.push(rawLines[i]);
        i++;
      }
      if (block.length >= 2) {
        const parseRow = (row: string) =>
          row.split("|").slice(1, -1).map(cell => cell.trim());
        const headers = parseRow(block[0]);
        // block[1] 是分隔行 |---|---|，直接跳過
        const rows = block.slice(2).map(parseRow);
        out.push(
          <div key={nk()} className="my-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {headers.map((h, hi) => (
                    <th key={hi} className="px-3 py-2 text-left font-semibold"
                      dangerouslySetInnerHTML={{ __html: inline(h) }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-muted/30" : ""}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 border-b border-border/30"
                        dangerouslySetInnerHTML={{ __html: inline(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    } else if (line.trim() !== "") {
      out.push(
        <p key={nk()} className="my-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: inline(line) }} />
      );
    }

    i++;
  }

  return out;
}

/**
 * 標題的純文字（去掉 Markdown 標記），用於圖片缺 alt 時的備援描述。
 */
function plainHeading(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

/**
 * 標題 → 錨點 id。
 *
 * 舊版直接把原始中文標題當 id，於是 675 個標題裡有 219 個帶著空白、標點或全形括號
 * （例如 `3. 部署MySQL後端`、`Update（更新，升版）`），在網址裡會變成一大串
 * percent-encoding；同一篇出現重複標題時還會產生重複 id（6 篇文章有這個問題）。
 *
 * 規則：小寫、只留文字與數字（含中文），其餘字元一律收斂成單一連字號。
 * 全形／半形標點都在這一步被吃掉，所以 `#什麼是AIGC?` 這種半形問號的連結
 * 也能對到 `## 什麼是AIGC？` 這個全形問號的標題。
 */
function slugifyHeading(text: string): string {
  return plainHeading(text)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostDetail(
  { postId, initialContent }: { postId?: string; initialContent?: string } = {}
) {
  const { id: paramId } = useParams<{ id: string }>();
  // postId / initialContent 由建置時預渲染腳本注入；瀏覽器端走原本 useParams + fetch
  const id = postId ?? paramId;
  const post = blogPosts.find((p) => p.id === id);

  // 系列導覽（P0-3）：讓 30 篇的系列串成一個強連結聚落
  const seriesHub = post?.series ? collectionForSeries(post.series) : undefined;
  const seriesIds = post?.series ? (seriesGroups[post.series] ?? []) : [];
  const posInSeries = id ? seriesIds.indexOf(id) : -1;
  const prevInSeries = posInSeries > 0 ? seriesIds[posInSeries - 1] : undefined;
  const nextInSeries =
    posInSeries >= 0 && posInSeries < seriesIds.length - 1 ? seriesIds[posInSeries + 1] : undefined;

  const related = post ? relatedPosts(post, 3) : [];
  const [content, setContent] = useState<string | undefined>(initialContent);
  const { theme } = useTheme();

  // 隨 theme 動態切換 highlight.js CSS 主題
  useEffect(() => {
    const linkId = "hljs-theme";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const isDark = theme === "dark";
    // 動態 import CSS 並取得 Vite 處理後的 URL
    if (isDark) {
      import("highlight.js/styles/github-dark.css?url").then(m => { if (link) link.href = m.default; });
    } else {
      import("highlight.js/styles/github.css?url").then(m => { if (link) link.href = m.default; });
    }
  }, [theme]);

  usePageTitle(
    post ? buildTitle(post.seoTitle ?? post.title) : buildTitle("文章未找到"),
    post?.excerpt,
    post ? `/posts/${post.id}` : "/posts"
  );
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (!id) return;
    setContent(undefined);
    fetch(`/articles/${id}/index.md`)
      .then(r => {
        if (!r.ok) throw new Error("not found");
        return r.text();
      })
      .then(setContent)
      .catch(() => setContent(undefined));
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到這篇文章</p>
          <Link href="/posts">
            <span className="text-primary-strong text-sm cursor-pointer" data-testid="link-back-to-posts">返回文章列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* 麵包屑：與 JSON-LD 的 BreadcrumbList 同一層級，讓畫面上看到的
              導覽路徑與機器讀到的結構一致（也讓那條從文章頁流出的內鏈
              帶有「所有文章」的錨文字，而不是「返回」這種無語意的字） */}
          <nav aria-label="麵包屑" className="mb-6">
            <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link href="/">
                  <span className="inline-flex items-center gap-1.5 cursor-pointer hover:text-foreground" data-testid="crumb-home">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    首頁
                  </span>
                </Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 opacity-40" /></li>
              <li>
                <Link href="/posts">
                  <span className="cursor-pointer hover:text-foreground" data-testid="link-back">所有文章</span>
                </Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 opacity-40" /></li>
              <li className="text-foreground/60 truncate max-w-[14rem] sm:max-w-md" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date} data-testid="text-post-date">
                {formatDate(post.date)}
              </time>
              {post.updated && post.updated !== post.date && (
                <span className="text-muted-foreground">
                  ｜更新於 <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {post.tags.map((tag) => {
              const linked = collectionForTag(tag);
              const badge = (
                <Badge variant="tag" className="text-xs font-normal py-0.5 px-2">
                  {tag}
                </Badge>
              );
              // 只有被收錄成聚合頁的標籤才做成連結，避免指向不存在的頁面
              return linked ? (
                <Link key={tag} href={collectionPath(linked)}>
                  <span className="cursor-pointer" data-testid={`link-tag-${linked.slug}`}>
                    {badge}
                  </span>
                </Link>
              ) : (
                <span key={tag}>{badge}</span>
              );
            })}
            {post.series &&
              (collectionForSeries(post.series) ? (
                <Link href={collectionPath(collectionForSeries(post.series)!)}>
                  <span className="cursor-pointer" data-testid="link-series-hub">
                    <Badge
                      variant="outline"
                      className="text-xs font-normal py-0.5 px-2 border-primary/30 text-primary-strong"
                    >
                      {seriesName(post.series)}
                    </Badge>
                  </span>
                </Link>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs font-normal py-0.5 px-2 border-primary/30 text-primary-strong"
                >
                  {seriesName(post.series)}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10" data-testid="article-content">
        {content ? (
          <div className="text-sm sm:text-[15px] text-foreground/90">
            {renderMarkdown(content, id, post.title)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">此文章內容尚未收錄</p>
            <div className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
              尚未提供外部連結
            </div>
          </div>
        )}
      </article>

      {/* 關於作者：文章讀完的當下是唯一會想「這誰寫的」的時刻。
          資料全部來自 aboutData／shortBio，不在這裡另寫一份。 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
        <div className="rounded-md border border-border/40 bg-card p-5 gradient-border">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-primary-strong">NZ</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1.5">
                <p className="text-sm font-semibold" data-testid="text-author-name">{aboutData.nameZh}</p>
                <span className="text-xs text-muted-foreground">{aboutData.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{shortBio}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <Link href="/about">
                  <span className="text-primary-strong cursor-pointer hover:underline" data-testid="link-author-about">
                    關於我 →
                  </span>
                </Link>
                {/* 與 Contact 頁同一份清單：新增管道只要改 contactLinks.ts */}
                {contactChannels.map((channel) => (
                  <a
                    key={channel.key}
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    data-testid={`author-channel-${channel.key}`}
                  >
                    {channel.shortLabel}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {post.series && seriesIds.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-medium text-primary-strong">{seriesName(post.series)}</p>
              <span className="text-xs font-mono text-muted-foreground">
                {posInSeries + 1} / {seriesIds.length}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              {prevInSeries ? (
                <Link href={`/posts/${prevInSeries}`}>
                  <span className="inline-flex items-center gap-1 text-muted-foreground cursor-pointer" data-testid="link-series-prev">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    上一篇
                  </span>
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">系列首篇</span>
              )}
              <Link
                href={
                  seriesHub
                    ? collectionPath(seriesHub)
                    : `/posts?series=${post.series}`
                }
              >
                <span className="text-primary-strong cursor-pointer" data-testid="link-series-index">系列目錄</span>
              </Link>
              {nextInSeries ? (
                <Link href={`/posts/${nextInSeries}`}>
                  <span className="inline-flex items-center gap-1 text-muted-foreground cursor-pointer" data-testid="link-series-next">
                    下一篇
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </span>
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">系列完結</span>
              )}
            </div>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10" data-testid="section-related">
          <h2 className="text-base font-semibold mb-3">相關文章</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/posts/${p.id}`} className="block hover-elevate rounded-md">
                <article className="h-full rounded-md border border-border/40 bg-card p-4 gradient-border">
                  <p className="text-sm font-medium leading-snug mb-2 line-clamp-3">{p.title}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(p.date)}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div className="border-t border-border/30 pt-6 flex items-center justify-between">
          <Link href="/posts">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer" data-testid="link-bottom-back">
              <ArrowLeft className="w-3.5 h-3.5" />
              返回文章列表
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
