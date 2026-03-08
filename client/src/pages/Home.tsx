import { blogPosts, categories } from "@/lib/blogData";
import { BlogCard, FeaturedBlogCard } from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Terminal, Cpu, Zap } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Home() {
  usePageTitle("Nick's Blog - AI異想封印 | CTO的爐邊雜談", "CTO的爐邊雜談 — 分享 AI 技術、系統架構、與職涯探索的深度觀點。");
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-50" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              Nick's Tech Blog
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight max-w-3xl">
            <span className="text-gradient">AI異想封印</span>
            <br />
            <span className="text-foreground/90">神經漫遊與模型的深層連結</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            CTO的爐邊雜談 — 分享 AI 技術、系統架構、與職涯探索的深度觀點。
            十年軟體開發經驗，從前端到後端，從雲端到人工智慧。
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground/70">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-primary/70" />
              <span>{blogPosts.length} 篇文章</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary/70" />
              <span>{categories.length} 個分類</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <FeaturedBlogCard post={featured} />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-lg font-semibold" data-testid="text-all-posts">所有文章</h2>
          </div>
          <Link href="/categories">
            <span className="flex items-center gap-1 text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-view-categories">
              瀏覽分類
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i + 1} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h2 className="text-lg font-semibold" data-testid="text-categories">分類標籤</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories?filter=${cat.id}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer text-sm font-normal py-1.5 px-3"
                data-testid={`badge-category-${cat.id}`}
              >
                {cat.name}
                <span className="ml-1.5 text-muted-foreground/60">{cat.count}</span>
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
