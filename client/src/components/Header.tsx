import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "首頁", path: "/" },
  { label: "文章", path: "/posts" },
  { label: "關於", path: "/about" },
  { label: "聯繫", path: "/contact" },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 glass bg-background/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-mono text-sm font-bold">N</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-semibold text-sm leading-tight tracking-tight">Nick Zhuang</span>
                <span className="text-muted-foreground text-[10px] font-mono leading-tight">CTO的爐邊雜談</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`px-3.5 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                    location === item.path
                      ? "text-foreground font-medium bg-muted/50"
                      : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${item.label}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="切換主題"
              title="切換主題"
              className="flex items-center gap-1 px-2"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs font-mono">切換主題</span>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1" data-testid="nav-mobile">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`block px-3.5 py-2.5 rounded-md text-sm cursor-pointer ${
                    location === item.path
                      ? "text-foreground font-medium bg-muted/50"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${item.label}`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
