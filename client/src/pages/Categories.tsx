import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { categories, blogPosts } from "@/lib/blogData";
import { BlogCard } from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Grid3X3, Bot, Briefcase, Compass, Brain, Sparkles, BookOpen, Container } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  bot: <Bot className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  compass: <Compass className="w-4 h-4" />,
  brain: <Brain className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  "book-open": <BookOpen className="w-4 h-4" />,
  container: <Container className="w-4 h-4" />,
};

export default function Categories() {
  usePageTitle("文章分類 | Nick's Blog", "依主題瀏覽所有技術文章與職涯分享。");

  const search = useSearch();
  const params = new URLSearchParams(search);
  const filterParam = params.get("filter");
  const [activeFilter, setActiveFilter] = useState<string | null>(filterParam);

  useEffect(() => {
    setActiveFilter(filterParam);
  }, [filterParam]);

  const filteredPosts = activeFilter
    ? blogPosts.filter((p) => p.category === activeFilter)
    : blogPosts;

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              Categories
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            文章分類
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            依主題瀏覽所有技術文章與職涯分享。
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={activeFilter === null ? "default" : "secondary"}
            className="cursor-pointer text-sm font-normal py-1.5 px-3"
            onClick={() => setActiveFilter(null)}
            data-testid="badge-filter-all"
          >
            全部
            <span className="ml-1.5 opacity-60">{blogPosts.length}</span>
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={activeFilter === cat.id ? "default" : "secondary"}
              className="cursor-pointer text-sm font-normal py-1.5 px-3"
              onClick={() => setActiveFilter(activeFilter === cat.id ? null : cat.id)}
              data-testid={`badge-filter-${cat.id}`}
            >
              <span className="mr-1.5">{iconMap[cat.icon]}</span>
              {cat.name}
              <span className="ml-1.5 opacity-60">{cat.count}</span>
            </Badge>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">此分類目前沒有文章。</p>
          </div>
        )}
      </section>
    </div>
  );
}
