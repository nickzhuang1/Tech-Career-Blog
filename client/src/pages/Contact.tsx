import { Mail, MessageSquare } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Contact() {
  usePageTitle("聯繫我 | Nick's Blog", "如有任何技術合作、演講邀約或交流，歡迎聯繫。");

  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Contact</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">聯繫我</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            如有任何技術合作、演講邀約或交流，歡迎透過以下方式聯繫。
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-lg mx-auto space-y-4">
          <a
            href="https://www.linkedin.com/in/nick-zhuang/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-elevate active-elevate-2 rounded-md"
            data-testid="link-contact-linkedin"
          >
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500/20 to-cyan-400/20 flex items-center justify-center">
                  <SiLinkedin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-xs text-muted-foreground">專業社群交流</p>
                </div>
                <Button variant="ghost" size="sm" tabIndex={-1} data-testid="button-visit-linkedin">
                  前往
                </Button>
              </div>
            </div>
          </a>

          <a
            href="mailto:contact@nickzhuang.com"
            className="block hover-elevate active-elevate-2 rounded-md"
            data-testid="link-contact-email"
          >
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500/20 to-cyan-400/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">技術合作與邀約</p>
                </div>
                <Button variant="ghost" size="sm" tabIndex={-1} data-testid="button-send-email">
                  寄信
                </Button>
              </div>
            </div>
          </a>

          <div className="rounded-md border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 text-center">
            <p className="font-mono text-xs text-primary/70 mb-3">// open to</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1.5 rounded-md bg-muted text-xs">技術演講</span>
              <span className="px-3 py-1.5 rounded-md bg-muted text-xs">企業顧問</span>
              <span className="px-3 py-1.5 rounded-md bg-muted text-xs">AI 合作</span>
              <span className="px-3 py-1.5 rounded-md bg-muted text-xs">技術交流</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
