import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { BlogPost } from "@/lib/blogData";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block hover-elevate active-elevate-2 rounded-md"
      data-testid={`card-post-${post.id}`}
    >
      <article className="relative rounded-md border border-border/40 bg-card p-5 h-full gradient-border">
        <div className="absolute top-4 right-4">
          <ArrowUpRight className="w-4 h-4 text-muted-foreground/40" />
        </div>

        <h3 className="text-[15px] font-semibold mb-2.5 leading-snug pr-6" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground/70 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="tag" className="text-[11px] font-normal py-0.5 px-2">
              {tag}
            </Badge>
          ))}
          {post.series && (
            <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 border-primary/30 text-primary">
              {post.series}
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
}

export function HeroBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block hover-elevate active-elevate-2 rounded-md h-full"
      data-testid={`card-featured-${post.id}`}
    >
      <article className="relative rounded-md p-6 sm:p-8 h-full bg-gradient-to-br from-purple-500/10 via-card to-cyan-400/5 border border-purple-500/20 gradient-border">
        <div className="absolute top-5 right-5">
          <ArrowUpRight className="w-5 h-5 text-primary/40" />
        </div>

        <Badge variant="default" className="text-[11px] mb-3">Latest</Badge>

        <h2 className="text-lg sm:text-xl font-bold mb-3 leading-snug pr-6" data-testid={`text-featured-title-${post.id}`}>
          {post.title}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground/70 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="tag" className="text-[11px] font-normal py-0.5 px-2">
              {tag}
            </Badge>
          ))}
        </div>
      </article>
    </Link>
  );
}
