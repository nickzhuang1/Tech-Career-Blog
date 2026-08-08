import { blogPosts } from "@/lib/blogData";
import { BlogCard, HeroBlogCard } from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Sparkles, BookOpen, Layers, Code2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Home() {
  usePageTitle("Nick's Blog - AI異想封印 | CTO的爐邊雜談", "CTO的爐邊雜談 — 分享 AI 技術、系統架構、與職涯探索的深度觀點。");

  const featured = blogPosts[0];
  const recent = blogPosts.slice(1, 7);
  const totalPosts = blogPosts.length;

  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
  const topTags = [
    "AI", "Gen AI", "Deep Learning", "Stable Diffusion", "NVIDIA",
    "K8S", "Docker", "AWS", "DevOps", "LLM", "Open Source", "職涯", "人生探索",
  ].filter((t) => allTags.includes(t));

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="hero-glow bg-purple-500 -top-40 -left-40" />
        <div className="hero-glow bg-cyan-400 -top-20 right-0" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Tech Blog</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
              <span className="gradient-text">AI 異想封印</span>
              <br />
              <span className="text-foreground">Nick 的職場幻界</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              12 年軟體開發，從前端到後端、從雲端到 AI。
              分享技術洞察、架構設計、與職涯成長的深度觀點。
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm">
              <div className="rounded-md border border-border/40 bg-card/50 p-3 text-center gradient-border" data-testid="stat-posts">
                <p className="text-lg font-bold gradient-text">{totalPosts}+</p>
                <p className="text-[11px] text-muted-foreground">篇文章</p>
              </div>
              <div className="rounded-md border border-border/40 bg-card/50 p-3 text-center gradient-border" data-testid="stat-categories">
                <p className="text-lg font-bold gradient-text">{allTags.length}</p>
                <p className="text-[11px] text-muted-foreground">個標籤</p>
              </div>
              <div className="rounded-md border border-border/40 bg-card/50 p-3 text-center gradient-border" data-testid="stat-experience">
                <p className="text-lg font-bold gradient-text">12+</p>
                <p className="text-[11px] text-muted-foreground">年經驗</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3 h-full">
            <HeroBlogCard post={featured} />
          </div>

          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-md border border-border/40 bg-card p-5 gradient-border">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500/20 to-cyan-400/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">著作出版</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                圖像生成式 AI 的生存指南：以 Stable Diffusion 為例
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                以膠囊網路做印刷電路板影像的瑕疵檢測
              </p>
            </div>

            <div className="rounded-md border border-border/40 bg-card p-5 gradient-border">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500/20 to-cyan-400/20 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">系列文章</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Link href="/posts?series=ironman-2023">
                  <span className="flex items-center justify-between text-xs text-muted-foreground cursor-pointer hover-elevate rounded p-1 -mx-1" data-testid="link-series-2023">
                    <span>2023 鐵人賽 - Gen AI</span>
                    <span className="text-primary font-mono">30</span>
                  </span>
                </Link>
                <Link href="/posts?series=ironman-2019">
                  <span className="flex items-center justify-between text-xs text-muted-foreground cursor-pointer hover-elevate rounded p-1 -mx-1" data-testid="link-series-2019">
                    <span>2019 鐵人賽 - K8S</span>
                    <span className="text-primary font-mono">30</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold" data-testid="text-all-posts">最新文章</h2>
          </div>
          <Link href="/posts">
            <span className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer" data-testid="link-view-all">
              查看全部
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center gap-2.5 mb-5">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold" data-testid="text-categories">探索主題</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <Link key={tag} href={`/posts?filter=${encodeURIComponent(tag)}`}>
              <Badge
                variant="tag"
                className="cursor-pointer text-sm font-normal py-1.5 px-3.5"
                data-testid={`badge-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
