import { Mail, MessageSquare } from "lucide-react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Contact() {
  usePageTitle("聯繫我 | Nick's Blog", "如有任何技術合作、演講邀約或交流，歡迎聯繫。");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
          {/* 演講照片 */}
          <div className="rounded-md border border-border/40 bg-card overflow-hidden gradient-border">
            <img
              src="/contact-photo.jpg"
              alt="Nick Zhuang 旅遊照"
              className="w-full object-cover"
            />
            <div className="px-4 py-3">
              <p className="text-xs font-medium">Nick Zhuang 旅遊寫真</p>
              <p className="text-xs text-muted-foreground mt-0.5">Salzburg, Austria · 2025</p>
            </div>
          </div>
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
                  <FaLinkedin className="w-5 h-5 text-primary" />
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
            href="https://www.facebook.com/xiangning.zhuang/"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-elevate active-elevate-2 rounded-md"
            data-testid="link-contact-facebook"
          >
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500/20 to-blue-400/20 flex items-center justify-center">
                  <FaFacebook className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Facebook</p>
                  <p className="text-xs text-muted-foreground">社群互動交流</p>
                </div>
                <Button variant="ghost" size="sm" tabIndex={-1} data-testid="button-visit-facebook">
                  前往
                </Button>
              </div>
            </div>
          </a>

          <a
            href="https://github.com/nickzhuang1"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover-elevate active-elevate-2 rounded-md"
            data-testid="link-contact-github"
          >
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-500/20 to-gray-400/20 flex items-center justify-center">
                  <FaGithub className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-xs text-muted-foreground">開源專案與程式碼</p>
                </div>
                <Button variant="ghost" size="sm" tabIndex={-1} data-testid="button-visit-github">
                  前往
                </Button>
              </div>
            </div>
          </a>

          <a
            href="mailto:nickzhuang1@gmail.com"
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
