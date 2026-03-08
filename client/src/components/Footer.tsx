import { SiLinkedin } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-mono text-xs font-bold">N</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Copyright &copy; {new Date().getFullYear()} Nick Zhuang. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/nick-zhuang/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors"
              data-testid="link-linkedin"
            >
              <SiLinkedin className="w-4 h-4" />
            </a>
            <span className="text-xs font-mono text-muted-foreground/50">v2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
