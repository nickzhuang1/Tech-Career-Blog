import { SiLinkedin } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-mono text-xs font-bold">N</span>
            </div>
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nick Zhuang. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/nick-zhuang/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover-elevate rounded-md p-1"
              data-testid="link-linkedin"
            >
              <SiLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
