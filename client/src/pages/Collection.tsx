import { Link, useLocation } from "wouter";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import {
  findCollection,
  collectionPath,
  collections,
  type CollectionKind,
} from "@/lib/collections";
import { usePageTitle } from "@/hooks/usePageTitle";
import { buildTitle } from "@/lib/seoTitle";

/**
 * 主題聚合頁（系列 / 分類 / 標籤）。
 *
 * 這個元件同時被兩條路徑使用：
 *   1. 瀏覽器：/series/:slug、/category/:slug、/tag/:slug（kind 由網址第一段決定）
 *   2. 建置時：script/prerender.tsx 直接以 props 指定 kind/slug 渲染成靜態 HTML
 */
export default function Collection({
  kind: kindProp,
  slug: slugProp,
}: {
  kind?: CollectionKind;
  slug?: string;
} = {}) {
  const [loc] = useLocation();
  const seg = loc.split("/").filter(Boolean);
  const kind = kindProp ?? (seg[0] as CollectionKind);
  const slug = slugProp ?? seg[1] ?? "";
  const data = findCollection(kind, slug);

  usePageTitle(
    data ? buildTitle(data.seoTitle) : buildTitle("找不到主題"),
    data?.description,
    data ? collectionPath(data) : "/posts",
  );

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-muted-foreground mb-4">找不到這個主題</p>
        <Link href="/posts">
          <span className="text-primary text-sm cursor-pointer" data-testid="link-back-to-posts">
            返回文章列表
          </span>
        </Link>
      </div>
    );
  }

  const related = data.related
    .map((path) => collections.find((c) => collectionPath(c) === path))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <nav
        aria-label="麵包屑"
        className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap"
        data-testid="nav-breadcrumb"
      >
        <Link href="/">
          <span className="hover:text-foreground cursor-pointer">首頁</span>
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/posts">
          <span className="hover:text-foreground cursor-pointer">所有文章</span>
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground/80">{data.name}</span>
      </nav>

      <header className="mb-10">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 leading-tight"
          data-testid="text-collection-title"
        >
          {data.name}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">{data.scope}</p>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground max-w-3xl">
          {data.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </header>

      <section aria-labelledby="collection-posts" className="mb-12">
        <h2 id="collection-posts" className="text-base font-semibold mb-4">
          共 {data.posts.length} 篇{data.kind === "series" ? "，依發佈順序排列" : ""}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="collection-related" className="mb-10">
          <h2 id="collection-related" className="text-base font-semibold mb-3">
            相關主題
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((c) => (
              <Link key={c.slug} href={collectionPath(c)}>
                <span
                  className="inline-flex items-center gap-1 rounded-md border border-border/50 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer"
                  data-testid={`link-related-${c.slug}`}
                >
                  {c.name}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-border/30 pt-6">
        <Link href="/posts">
          <span
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer"
            data-testid="link-back-to-posts-bottom"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回文章列表
          </span>
        </Link>
      </div>
    </div>
  );
}
