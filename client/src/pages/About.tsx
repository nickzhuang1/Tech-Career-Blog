import { aboutData } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import {
  User,
  GraduationCap,
  BookOpen,
  Briefcase,
  ExternalLink,
  Award,
  Mic,
  ShieldCheck,
  Mail,
  Link2,
  Activity,
  Heart,
  History,
} from "lucide-react";
import { useLocation } from "wouter";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function About() {
  usePageTitle("關於我 | Nick's Blog", "AI 與雲端的技術探索之路 — Nick Zhuang 的職涯介紹。");
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero 區塊 - 不變 */}
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
          {/* 左欄 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 簡介 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">關於我</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-bio">
                {aboutData.bio}
              </p>
            </div>

            {/* 專業領域 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">專業領域</h2>
              </div>
              <div className="flex flex-wrap gap-2" data-testid="text-expertise">
                {aboutData.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm font-normal py-1.5 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 著作 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">著作出版</h2>
              </div>
              <div className="space-y-3">
                {aboutData.books.map((book, i) => (
                  <div key={i} className="rounded-md bg-gradient-to-br from-purple-500/10 via-background to-cyan-400/5 border border-purple-500/20 p-4">
                    <p className="text-sm font-medium mb-1">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.titleEn}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 認證 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">認證</h2>
              </div>
              <ul className="space-y-2">
                {aboutData.certifications.filter((cert) => cert.name.startsWith("NVIDIA Certified")).map((cert, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{cert.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 榮譽 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">榮譽</h2>
              </div>
              <ul className="space-y-2">
                {aboutData.honors.map((honor, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{honor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 演講 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">演講</h2>
              </div>
              <ul className="space-y-2">
                {aboutData.talks.map((talk, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{talk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 右欄 */}
          <div className="flex flex-col gap-4">
            {/* 背景 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border overflow-hidden">
              <img
                src="/avatar.png"
                alt="Nick Zhuang"
                className="float-right ml-4 mb-3 w-32 h-32 rounded-md object-cover object-top border border-border/40"
              />
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">背景</h2>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">現任</p>
                  <p>{aboutData.current}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">經歷</p>
                  <ul className="space-y-1">
                    {aboutData.workHistory.map((w, i) => (
                      <li key={i} className="text-muted-foreground text-xs">{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs mb-1">學歷</p>
                    <ul className="space-y-1">
                      {aboutData.education.map((e, i) => (
                        <li key={i} className="text-xs text-muted-foreground">{e}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => navigate("/timeline")}
                    title="查看職涯大事記"
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] font-mono text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/50 rounded-md px-2 py-1 transition-colors"
                  >
                    <History className="w-3 h-3" />
                    大事記
                  </button>
                  <button
                    onClick={() => navigate("/certificates")}
                    title="查看證書牆"
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] font-mono text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/50 rounded-md px-2 py-1 transition-colors"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    證書牆
                  </button>
                </div>
              </div>
            </div>

            {/* 展示圖片 */}
            <div className="rounded-md border border-border/40 bg-card p-4 gradient-border space-y-2">
              <img
                src="/showcase.png"
                alt="著作與獎盃"
                className="w-full rounded-md object-cover"
              />
              <img
                src="/nv-certs.png"
                alt="NVIDIA 認證"
                className="w-full rounded-md object-cover"
              />
            </div>

            {/* 連結 */}
            <div className="rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">連結</h2>
              </div>
              <div className="space-y-2">
                <a
                  href={aboutData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-linkedin"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
                <a
                  href={aboutData.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
                <a
                  href={aboutData.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-github"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
                <a
                  href={aboutData.social.email}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-1.5 -mx-1.5"
                  data-testid="link-about-email"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                </a>
              </div>
            </div>

            {/* 興趣 */}
            <div className="flex-1 rounded-md border border-border/40 bg-card p-6 gradient-border">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">興趣</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {aboutData.interests.map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs font-normal py-1 px-2.5">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status 區塊已移除 */}
          </div>
        </div>
      </div>
    </div>
  );
}
