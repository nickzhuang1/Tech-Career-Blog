import { Link } from "wouter";
import { SiLinkedin } from "react-icons/si";
import { collectionLinks } from "@/lib/collections";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 主題導覽：讓系列／分類／標籤聚合頁從每一頁都有一條爬取路徑 */}
        <nav aria-label="主題導覽" className="mb-8">
          <p className="text-xs font-medium text-muted-foreground/60 mb-2">主題</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {collectionLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  data-testid={`footer-link-${link.href}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <a
              href="/rss.xml"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="footer-link-rss"
            >
              RSS
            </a>
          </div>
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-mono text-xs font-bold">N</span>
            </div>
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nick Zhuang. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
