import { useState } from "react";
import { aboutData } from "@/lib/blogData";
import { ShieldCheck, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";
export default function Certificates() {
  usePageTitle("證書牆 | Nick's Blog", "Nick Zhuang 所獲得的所有專業證書展示。");
  const [, navigate] = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const certs = aboutData.certifications;

  // 分類
  const categories = ["NVIDIA", "GOOGLE", "AWS", "K8s", "Udemy"];
  const grouped = categories.map(cat => ({
    name: cat,
    certs: certs.filter(c => c.category === cat)
  })).filter(g => g.certs.length > 0);

  // 展平所有分類後的 index 對應
  const flatCerts = grouped.flatMap(g => g.certs);

  const handlePrev = () => {
    if (openIndex === null) return;
    setOpenIndex((prev) => (prev! - 1 + flatCerts.length) % flatCerts.length);
  };
  const handleNext = () => {
    if (openIndex === null) return;
    setOpenIndex((prev) => (prev! + 1) % flatCerts.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero 區塊（與 Timeline 一致） */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="hero-glow bg-purple-500 -top-40 -left-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <button
            onClick={() => navigate("/about")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回關於我
          </button>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Certificates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            我的 <span className="gradient-text">證書牆</span>
          </h1>
          <p className="text-muted-foreground text-sm">依類別分組，點擊可放大瀏覽</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        {grouped.map((group, groupIdx) => (
          <div key={group.name} className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-primary/80 border-l-4 border-primary pl-2">{group.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {group.certs.map((cert, i) => {
                // 全域 index
                const globalIdx = grouped.slice(0, groupIdx).reduce((acc, g) => acc + g.certs.length, 0) + i;
                return (
                  <button
                    key={cert.name}
                    className="group relative focus:outline-none"
                    onClick={() => setOpenIndex(globalIdx)}
                    title={cert.name}
                  >
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-full aspect-[4/3] object-contain rounded shadow border border-border/30 bg-white group-hover:scale-105 transition-transform"
                        style={{ maxHeight: 160 }}
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] flex items-center justify-center bg-muted/30 rounded border border-dashed border-border/30">
                        <ShieldCheck className="w-10 h-10 text-primary/30" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Credly 證書連結區塊 */}
        <div className="max-w-4xl mx-auto px-4 pb-10">
          <div className="bg-muted/40 border border-border/30 rounded-lg p-6 flex flex-col items-center text-center">
            <span className="font-semibold text-lg mb-2">更多證書請見 Credly</span>
            <a
              href="https://www.credly.com/users/nick-zhuang/badges#credly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors shadow"
            >
              前往 Credly 證書頁面
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 md:px-12">
          <div className="relative bg-card rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-lg md:max-w-4xl flex flex-col items-center overflow-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
              onClick={() => setOpenIndex(null)}
              aria-label="關閉"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full hover:bg-muted/40 focus:outline-none"
                aria-label="上一張"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              {flatCerts[openIndex].image ? (
                <img
                  src={flatCerts[openIndex].image}
                  alt={flatCerts[openIndex].name}
                  className="rounded border border-border/30 bg-white object-contain max-w-full max-h-[50vh] md:max-h-[60vh]"
                  style={{ width: 'auto', height: 'auto' }}
                />
              ) : (
                <div className="w-64 h-48 md:w-96 md:h-72 flex items-center justify-center bg-muted/30 rounded border border-dashed border-border/30">
                  <ShieldCheck className="w-12 h-12 text-primary/30" />
                </div>
              )}
              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-muted/40 focus:outline-none"
                aria-label="下一張"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg mb-2">{flatCerts[openIndex].name}</div>
              {/* 可擴充更多詳細資訊 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
