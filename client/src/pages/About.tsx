import { aboutData } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, BookOpen, Briefcase, ExternalLink } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function About() {
  usePageTitle("關於我 | Nick's Blog", "十年技術旅程，從工程師到技術長。");
  return (
    <div className="min-h-screen">
      <section className="border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">
              About Me
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            關於我
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            十年技術旅程，從工程師到技術長。
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-1" data-testid="text-name">
                {aboutData.name}
              </h2>
              <p className="text-primary font-mono text-sm mb-4" data-testid="text-title">
                {aboutData.title}
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base" data-testid="text-bio">
                {aboutData.bio}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">學歷</span>
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-education">
                  {aboutData.education}
                </p>
              </div>

              <div className="rounded-md border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">經驗</span>
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-experience">
                  {aboutData.experience}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-primary rounded-full" />
                <h3 className="font-semibold">專業領域</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {aboutData.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm font-normal py-1.5 px-3" data-testid={`badge-skill-${skill}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border/50 bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">著作</span>
              </div>
              <p className="text-sm font-medium mb-1" data-testid="text-book-title">
                {aboutData.book.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {aboutData.book.titleEn}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-border/50 bg-card p-5">
              <h3 className="text-sm font-medium mb-4">社群連結</h3>

              <div className="space-y-3">
                <a
                  href={aboutData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover-elevate rounded-md p-2 -m-2"
                  data-testid="link-about-linkedin"
                >
                  <SiLinkedin className="w-4 h-4 text-primary" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>

                <a
                  href={aboutData.social.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover-elevate rounded-md p-2 -m-2"
                  data-testid="link-about-blog"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Original Blog</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
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
      </section>
    </div>
  );
}
