import { aboutData } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, BookOpen, Briefcase, ExternalLink } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function About() {
  usePageTitle("關於我 | Nick's Blog", "AI 與雲端的技術探索之路 — Nick Zhuang 的職涯介紹。");

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="hero-glow bg-purple-500 -top-40 -right-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">About</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {aboutData.nameZh}{" "}
            <span className="gradient-text">{aboutData.name}</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">{aboutData.title}</p>
          <p className="text-muted-foreground text-xs">{aboutData.titleZh}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <h2 className="font-semibold mb-3 text-sm">關於我</h2>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-bio">
                {aboutData.bio}
              </p>
            </div>

            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">專業領域</h2>
              </div>
              <div className="flex flex-wrap gap-2" data-testid="text-expertise">
                {aboutData.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm font-normal py-1.5 px-3" data-testid={`badge-skill-${skill}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">著作出版</h2>
              </div>
              <div className="rounded-md bg-gradient-to-br from-purple-500/10 via-background to-cyan-400/5 border border-purple-500/20 p-4">
                <p className="text-sm font-medium mb-1" data-testid="text-book-title">
                  {aboutData.book.title}
                </p>
                <p className="text-xs text-muted-foreground">{aboutData.book.titleEn}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">背景</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">學歷</p>
                  <p data-testid="text-education">{aboutData.education}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">經驗</p>
                  <p data-testid="text-experience">{aboutData.experience}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <h2 className="font-semibold text-sm mb-4">連結</h2>
              <div className="space-y-2">
                <a
                  href={aboutData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-linkedin"
                >
                  <SiLinkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
                <a
                  href={aboutData.social.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-blog"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Notion Blog</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
              </div>
            </div>

            <div className="rounded-md border border-primary/20 bg-gradient-to-br from-card to-primary/5 p-5">
              <p className="font-mono text-xs text-primary/70 mb-2">// status</p>
              <p className="text-sm font-medium mb-1">{aboutData.titleZh}</p>
              <p className="text-xs text-muted-foreground">{aboutData.nameZh}</p>
              <div className="mt-3 h-px bg-border/50" />
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Active & Building</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
