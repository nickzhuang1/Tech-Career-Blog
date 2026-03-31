import { useState, useMemo, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { blogPosts } from "@/lib/blogData";
import { BlogCard } from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Search, LayoutGrid } from "lucide-react";

const TAG_ORDER = [
  "AI", "Gen AI", "Deep Learning", "Stable Diffusion", "LoRA", "AIGC",
  "NVIDIA", "LLM", "RAG", "Open Source", "Cursor",
  "K8S", "Docker", "AWS", "EKS", "Helm", "DevOps", "RBAC", "minikube",
  "職涯", "人生探索", "規劃",
];

function buildTagList(posts: typeof blogPosts) {
  const countMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }
  const ordered = TAG_ORDER.filter((t) => countMap.has(t));
  const rest = Array.from(countMap.keys()).filter((t) => !TAG_ORDER.includes(t)).sort();
  return [...ordered, ...rest].map((tag) => ({ tag, count: countMap.get(tag)! }));
}

export default function Posts() {
  usePageTitle("所有文章 | Nick's Blog", "瀏覽所有技術文章與職涯分享。");

  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const activeFilter = params.get("filter");
  const [searchQuery, setSearchQuery] = useState("");

  const tagList = useMemo(() => buildTagList(blogPosts), []);

  const setActiveFilter = (filter: string | null) => {
    if (filter) {
      setLocation(`/posts?filter=${encodeURIComponent(filter)}`);
    } else {
      setLocation("/posts");
    }
  };

  const filteredPosts = useMemo(() => {
    let posts = activeFilter
      ? blogPosts.filter((p) => p.tags.includes(activeFilter))
      : blogPosts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              All Posts
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            所有文章
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-6">
            {blogPosts.length} 篇文章，涵蓋 AI、雲端、容器化、職涯成長等主題。
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="搜尋文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              data-testid="input-search"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={activeFilter === null ? "default" : "secondary"}
            className="cursor-pointer text-sm font-normal py-1.5 px-3.5"
            onClick={() => setActiveFilter(null)}
            data-testid="badge-filter-all"
          >
            全部
            <span className="ml-1.5 opacity-60 font-mono text-xs">{blogPosts.length}</span>
          </Badge>
          {tagList.map(({ tag, count }) => (
            <Badge
              key={tag}
              variant={activeFilter === tag ? "default" : "secondary"}
              className="cursor-pointer text-sm font-normal py-1.5 px-3.5"
              onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              data-testid={`badge-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tag}
              <span className="ml-1.5 opacity-60 font-mono text-xs">{count}</span>
            </Badge>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">
              {searchQuery ? `找不到「${searchQuery}」相關的文章。` : "此標籤目前沒有文章。"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
