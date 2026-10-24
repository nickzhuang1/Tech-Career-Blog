import { useState, useMemo } from "react";
import { useSearch, useLocation } from "wouter";
import { blogPosts, categories, series } from "@/lib/blogData";
import { BlogCard } from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Search, LayoutGrid } from "lucide-react";
import { buildTitle } from "@/lib/seoTitle";

// 分類列用紫色系，標籤列用青色系，兩者顏色區隔
// 標籤列採用 Badge 的 "tag" 變體（青色系，全站文章標籤統一）；這裡只覆寫分類列的紫色
const tagBadgeClass = (active: boolean) =>
  active
    // Badge 的 tag 變體自帶 dark:text-cyan-300，權重比 text-white 高（.dark 選擇器），
    // 所以這裡必須用 !text-white；底色同時壓深到 cyan-700 才有 5.9:1
    ? "border-transparent bg-cyan-700 !text-white shadow-xs"
    : "";
const categoryBadgeClass = (active: boolean) =>
  active
    ? "border-transparent bg-purple-600 text-white shadow-xs"
    : "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/15";

const TAG_ORDER = [
  "AI", "Gen AI", "Deep Learning", "Stable Diffusion", "LoRA", "AIGC",
  "NVIDIA", "LLM", "RAG", "Open Source", "Cursor",
  "K8S", "Docker", "AWS", "EKS", "Helm", "DevOps", "RBAC", "minikube",
  "職涯", "人生探索", "規劃",
];

// 與分類同名的鏡像標籤——這些已經由上方的分類列代表，標籤列不再重複顯示，
// 讓上排「分類＝大類」、下排「標籤＝細主題」語意區隔清楚。
const MIRROR_TAGS = new Set(["AI", "Gen AI", "Deep Learning", "職涯", "人生探索", "K8S"]);

function buildTagList(posts: typeof blogPosts) {
  const countMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (MIRROR_TAGS.has(tag)) continue;
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }
  const ordered = TAG_ORDER.filter((t) => countMap.has(t));
  const rest = Array.from(countMap.keys()).filter((t) => !TAG_ORDER.includes(t)).sort();
  return [...ordered, ...rest].map((tag) => ({ tag, count: countMap.get(tag)! }));
}

export default function Posts() {
  usePageTitle(buildTitle("所有文章"), "瀏覽所有技術文章與職涯分享。", "/posts");

  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const activeFilter = params.get("filter");
  const activeCategory = params.get("category");
  const activeSeries = params.get("series");
  const [searchQuery, setSearchQuery] = useState("");

  const tagList = useMemo(() => buildTagList(blogPosts), []);

  // 各分類的即時篇數
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of blogPosts) {
      map.set(post.category, (map.get(post.category) ?? 0) + 1);
    }
    return map;
  }, []);

  // 以當前 query 為基底套用變更，保留其他 param（null 代表移除該 key）
  const updateParams = (partial: { filter?: string | null; category?: string | null; series?: string | null }) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(partial)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    const qs = next.toString();
    setLocation(qs ? `/posts?${qs}` : "/posts");
  };

  const filteredPosts = useMemo(() => {
    let posts = blogPosts;

    if (activeSeries) {
      posts = posts.filter((p) => p.series === activeSeries);
    }

    if (activeCategory) {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (activeFilter) {
      posts = posts.filter((p) => p.tags.includes(activeFilter));
    }

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
  }, [activeSeries, activeCategory, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="w-4 h-4 text-primary-strong" />
            <span className="font-mono text-xs text-primary-strong tracking-wider uppercase">
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
        {/* 系列篩選列（僅在 URL 帶 ?series= 時出現，點擊解除） */}
        {activeSeries && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant="default"
              className="cursor-pointer text-sm font-normal py-1.5 px-3.5"
              onClick={() => updateParams({ series: null })}
              data-testid={`badge-series-${activeSeries}`}
            >
              系列：{series.find((s) => s.id === activeSeries)?.name ?? activeSeries}
              <span className="ml-1.5" aria-hidden="true">✕</span>
            </Badge>
          </div>
        )}

        {/* 分類篩選列 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant={activeCategory === null ? "default" : "secondary"}
            className={cn("cursor-pointer text-sm font-normal py-1.5 px-3.5", categoryBadgeClass(activeCategory === null))}
            onClick={() => updateParams({ category: null })}
            data-testid="badge-category-all"
          >
            全部分類
            <span className="ml-1.5 font-mono text-xs">{blogPosts.length}</span>
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "secondary"}
              className={cn("cursor-pointer text-sm font-normal py-1.5 px-3.5", categoryBadgeClass(activeCategory === cat.id))}
              onClick={() => updateParams({ category: activeCategory === cat.id ? null : cat.id })}
              data-testid={`badge-category-${cat.id}`}
            >
              {cat.name}
              <span className="ml-1.5 font-mono text-xs">{categoryCounts.get(cat.id) ?? 0}</span>
            </Badge>
          ))}
        </div>

        {/* 標籤篩選列 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant="tag"
            className={cn("cursor-pointer text-sm font-normal py-1.5 px-3.5", tagBadgeClass(activeFilter === null))}
            onClick={() => updateParams({ filter: null })}
            data-testid="badge-filter-all"
          >
            全部標籤
            <span className="ml-1.5 font-mono text-xs">{blogPosts.length}</span>
          </Badge>
          {tagList.map(({ tag, count }) => (
            <Badge
              key={tag}
              variant="tag"
              className={cn("cursor-pointer text-sm font-normal py-1.5 px-3.5", tagBadgeClass(activeFilter === tag))}
              onClick={() => updateParams({ filter: activeFilter === tag ? null : tag })}
              data-testid={`badge-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tag}
              <span className="ml-1.5 font-mono text-xs">{count}</span>
            </Badge>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} headingLevel={2} />
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
