import { ArrowUpRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blogData";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <a
      href={post.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover-elevate active-elevate-2"
      data-testid={`card-post-${post.id}`}
    >
      <article className="relative rounded-md border border-border/50 bg-card p-5 sm:p-6">
        <div className="absolute top-4 right-4">
          <ArrowUpRight className="w-4 h-4 text-primary/40" />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-primary/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-2 leading-snug" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </article>
    </a>
  );
}

export function FeaturedBlogCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover-elevate active-elevate-2"
      data-testid={`card-featured-${post.id}`}
    >
      <article className="relative rounded-md border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 sm:p-8">
        <div className="absolute top-5 right-5">
          <ArrowUpRight className="w-5 h-5 text-primary/40" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" className="text-xs">Latest</Badge>
          <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-3 leading-snug" data-testid={`text-featured-title-${post.id}`}>
          {post.title}
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 max-w-2xl">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
          <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground/70">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </article>
    </a>
  );
}
