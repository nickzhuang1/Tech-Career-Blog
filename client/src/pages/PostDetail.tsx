import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { blogPosts } from "@/lib/blogData";
import articleContent from "@/content/articles.json";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listItems.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag key={`list-${elements.length}`} className={listType === "ol" ? "list-decimal pl-6 space-y-1 my-3" : "list-disc pl-6 space-y-1 my-3"}>
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: processInline(item) }} />
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  }

  function processInline(text: string): string {
    let result = escapeHtml(text);
    result = result
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, linkText, url) => {
        const safeUrl = url.startsWith("http") || url.startsWith("/") ? url : "#";
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2">${linkText}</a>`;
      });
    return result;
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flushList();
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${elements.length}`} className="bg-muted/50 border border-border/30 rounded-md p-4 my-4 overflow-x-auto">
          <code className="text-[13px] font-mono leading-relaxed whitespace-pre" data-lang={lang || undefined}>
            {codeLines.join("\n")}
          </code>
        </pre>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={i} className="text-lg font-bold mt-8 mb-3" dangerouslySetInnerHTML={{ __html: processInline(line.slice(4)) }} />
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={i} className="text-xl font-bold mt-10 mb-4" dangerouslySetInnerHTML={{ __html: processInline(line.slice(3)) }} />
      );
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={i} className="text-2xl font-bold mt-10 mb-4" dangerouslySetInnerHTML={{ __html: processInline(line.slice(2)) }} />
      );
    } else if (line.startsWith("![")) {
      flushList();
      const imgMatch = line.match(/!\[([^\]]*)\]\(([^\)]+)\)/);
      if (imgMatch && imgMatch[2].startsWith("http")) {
        elements.push(
          <figure key={i} className="my-6">
            <img src={imgMatch[2]} alt={imgMatch[1] || ""} className="rounded-md max-w-full" loading="lazy" />
          </figure>
        );
      }
    } else if (/^\d+\\?\.\s/.test(line)) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(line.replace(/^\d+\\?\.\s/, ""));
    } else if (/^[-*]\s/.test(line)) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(line.replace(/^[-*]\s/, ""));
    } else if (line.startsWith("---")) {
      flushList();
      elements.push(<hr key={i} className="my-6 border-border/40" />);
    } else if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote key={i} className="border-l-2 border-primary/40 pl-4 my-4 text-muted-foreground italic">
          <p dangerouslySetInnerHTML={{ __html: processInline(line.slice(2)) }} />
        </blockquote>
      );
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={i} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: processInline(line) }} />
      );
    }
    i++;
  }
  flushList();
  return elements;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);
  const content = id ? (articleContent as Record<string, string>)[id] : undefined;

  usePageTitle(
    post ? `${post.title} | Nick's Blog` : "文章未找到 | Nick's Blog",
    post?.excerpt
  );
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到這篇文章</p>
          <Link href="/posts">
            <span className="text-primary text-sm cursor-pointer" data-testid="link-back-to-posts">返回文章列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link href="/posts">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground mb-6 cursor-pointer" data-testid="link-back">
              <ArrowLeft className="w-3.5 h-3.5" />
              返回文章列表
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span data-testid="text-post-date">{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal py-0.5 px-2">
                {tag}
              </Badge>
            ))}
            {post.series && (
              <Badge variant="outline" className="text-xs font-normal py-0.5 px-2 border-primary/30 text-primary">
                {post.series}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10" data-testid="article-content">
        {content ? (
          <div className="text-sm sm:text-[15px] text-foreground/90">
            {renderMarkdown(content)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">此文章內容尚未收錄</p>
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm"
              data-testid="link-external"
            >
              前往 Notion 閱讀完整內容
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div className="border-t border-border/30 pt-6 flex items-center justify-between">
          <Link href="/posts">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer" data-testid="link-bottom-back">
              <ArrowLeft className="w-3.5 h-3.5" />
              返回文章列表
            </span>
          </Link>
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            data-testid="link-notion-source"
          >
            原始來源
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
