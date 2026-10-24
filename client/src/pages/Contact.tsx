import { MessageSquare } from "lucide-react";
import { FaLinkedin, FaFacebook, FaGithub, FaEnvelope } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa6";
import { contactChannels, type ContactChannelKey } from "@/lib/contactLinks";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { buildTitle } from "@/lib/seoTitle";

/**
 * 每個管道的圖示與配色，Contact 頁專用的呈現方式。
 * 配色規則（按功能分組、不還原品牌色）寫在 lib/contactLinks.ts 的檔頭，
 * 新增管道前先看那段再挑漸層。
 */
const CHANNEL_STYLE: Record<
  ContactChannelKey,
  { icon: React.ComponentType<{ className?: string }>; gradient: string; action: string }
> = {
  linkedin: { icon: FaLinkedin, gradient: "from-purple-500/20 to-cyan-400/20", action: "前往" },
  facebook: { icon: FaFacebook, gradient: "from-blue-500/20 to-blue-400/20", action: "前往" },
  github: { icon: FaGithub, gradient: "from-gray-500/20 to-gray-400/20", action: "前往" },
  ithome: { icon: FaTrophy, gradient: "from-purple-500/20 to-cyan-400/20", action: "前往" },
  email: { icon: FaEnvelope, gradient: "from-purple-500/20 to-cyan-400/20", action: "寄信" },
};

export default function Contact() {
  usePageTitle(buildTitle("聯繫我"), "如有任何技術合作、演講邀約或交流，歡迎聯繫。", "/contact");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <section className="border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary-strong" />
            <span className="font-mono text-xs text-primary-strong tracking-wider uppercase">Contact</span>
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
          {contactChannels.map((channel) => {
            const style = CHANNEL_STYLE[channel.key];
            const Icon = style.icon;
            return (
              <a
                key={channel.key}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block hover-elevate active-elevate-2 rounded-md"
                data-testid={`link-contact-${channel.key}`}
              >
                <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-primary-strong" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{channel.label}</p>
                      <p className="text-xs text-muted-foreground">{channel.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      tabIndex={-1}
                      data-testid={`button-visit-${channel.key}`}
                    >
                      {style.action}
                    </Button>
                  </div>
                </div>
              </a>
            );
          })}

          <div className="rounded-md border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 text-center">
            <p className="font-mono text-xs text-primary-strong/70 mb-3">// open to</p>
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
