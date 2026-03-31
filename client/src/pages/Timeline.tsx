import { aboutData } from "@/lib/blogData";
import { useState, useRef, useEffect } from "react";
import { History, ArrowLeft, X } from "lucide-react";
import { useLocation } from "wouter";
import { usePageTitle } from "@/hooks/usePageTitle";

type TimelineEntry = { year: number; items: string[]; highlights?: number[]; current?: boolean };
// 最新在最上方
const entries: TimelineEntry[] = [...aboutData.timeline].reverse();

const NODE_HEIGHT = 140;
const CANVAS_WIDTH = 600;
const LEFT_X = 120;
const RIGHT_X = 480;
const NODE_R = 40;

function getNodeX(i: number) { return i % 2 === 0 ? LEFT_X : RIGHT_X; }
function getNodeY(i: number) { return 60 + i * NODE_HEIGHT; }

function buildPath(entries: TimelineEntry[]) {
  const segs: string[] = [];
  for (let i = 0; i < entries.length - 1; i++) {
    const x1 = getNodeX(i), y1 = getNodeY(i);
    const x2 = getNodeX(i + 1), y2 = getNodeY(i + 1);
    if (x1 === x2) {
      const midY = (y1 + y2) / 2;
      const offX = x1 === LEFT_X ? -60 : 60;
      segs.push(`M ${x1} ${y1} C ${x1 + offX} ${midY} ${x2 + offX} ${midY} ${x2} ${y2}`);
    } else {
      segs.push(`M ${x1} ${y1} C ${x1} ${y1 + NODE_HEIGHT * 0.6} ${x2} ${y2 - NODE_HEIGHT * 0.6} ${x2} ${y2}`);
    }
  }
  return segs;
}

type CardPos = { top: number; left?: number; right?: number };

export default function Timeline() {
  usePageTitle("大事記 | Nick's Blog", "Nick Zhuang 的職涯大事記時間線");
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [cardPos, setCardPos] = useState<CardPos | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgHeight = getNodeY(entries.length - 1) + 80;
  const pathSegs = buildPath(entries);

  function calcCardPos(nodeIndex: number): CardPos | null {
    const svgEl = svgRef.current;
    const containerEl = containerRef.current;
    if (!svgEl || !containerEl) return null;
    const svgRect = svgEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    const scale = svgRect.width / CANVAS_WIDTH;
    const top = (svgRect.top - containerRect.top) + getNodeY(nodeIndex) * scale - 16;
    if (nodeIndex % 2 === 0) {
      // 左節點 → 卡片貼右
      return { top, left: (getNodeX(nodeIndex) + NODE_R + 10) * scale };
    } else {
      // 右節點 → 卡片貼左
      return { top, right: (CANVAS_WIDTH - getNodeX(nodeIndex) + NODE_R + 10) * scale };
    }
  }

  function handleNodeClick(entry: TimelineEntry, i: number) {
    if (expanded === entry.year) {
      setExpanded(null);
      setCardPos(null);
    } else {
      setExpanded(entry.year);
      setCardPos(calcCardPos(i));
    }
  }

  // 視窗大小改變時關閉卡片（位置會過期）
  useEffect(() => {
    const handler = () => { setExpanded(null); setCardPos(null); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // 預設展開最新年份（index 0）
  useEffect(() => {
    const pos = calcCardPos(0);
    setExpanded(entries[0].year);
    setCardPos(pos);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const expandedEntry = entries.find(e => e.year === expanded) ?? null;

  return (
    <div className="min-h-screen">
      {/* Hero */}
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
            <History className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            職涯 <span className="gradient-text">大事記</span>
          </h1>
          <p className="text-muted-foreground text-sm">點擊各年份節點查看詳細事項</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {/* position: relative 作為浮動卡片的定位基準 */}
        <div ref={containerRef} className="relative w-full">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_WIDTH} ${svgHeight}`}
            className="w-full"
          >
            {pathSegs.map((d, i) => (
              <path key={i} d={d} fill="none" strokeWidth="2" className="stroke-border/60" />
            ))}

            {entries.map((entry, i) => {
              const cx = getNodeX(i);
              const cy = getNodeY(i);
              const isLeft = i % 2 === 0;
              const isActive = expanded === entry.year;

              return (
                <g key={entry.year} className="cursor-pointer" onClick={() => handleNodeClick(entry, i)}>
                  {(entry.current || isActive) && (
                    <circle cx={cx} cy={cy} r={NODE_R + 12}
                      className={`fill-primary/10 ${isActive ? "stroke-primary/40" : "stroke-transparent"}`}
                      strokeWidth="1"
                    />
                  )}
                  <circle cx={cx} cy={cy} r={NODE_R}
                    className={isActive ? "fill-primary stroke-primary" : entry.current ? "fill-primary/20 stroke-primary" : "fill-card stroke-border/70"}
                    strokeWidth="1.5"
                    style={{ transition: "all 0.2s" }}
                  />
                  <text
                    x={cx} y={cy + 1}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="20" fontFamily="monospace" fontWeight="700"
                    className={isActive ? "fill-primary-foreground" : entry.current ? "fill-primary" : "fill-muted-foreground"}
                  >
                    {entry.year}
                  </text>

                  {/* 摘要標籤（節點旁，展開時淡出） */}
                  <foreignObject
                    x={isLeft ? cx + NODE_R + 10 : cx - NODE_R - 10 - 300}
                    y={cy - 40}
                    width="300"
                    height="90"
                    className="pointer-events-none"
                  >
                    <div className={`text-lg leading-relaxed px-1 transition-opacity duration-150 ${isActive ? "opacity-20" : "opacity-100"} ${isLeft ? "" : "text-right"}`}>
                      {/* 優先顯示第一個重點項目，否則顯示 items[0] */}
                      <div className="line-clamp-2 text-muted-foreground/80">
                        {entry.highlights && entry.highlights.length > 0
                          ? entry.items[entry.highlights[0]]
                          : entry.items[0]}
                      </div>
                      {entry.items.length > 1 && (
                        <div className="text-primary/60">{`+${entry.items.length - 1} 項`}</div>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* 浮動詳情卡片 — 絕對定位於節點旁 */}
          {expandedEntry && cardPos && (
            <div
              className="absolute z-20 w-44 min-[480px]:w-56 sm:w-72 rounded-md border border-primary/30 bg-card/95 backdrop-blur-sm shadow-lg p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-150"
              style={{
                top: cardPos.top,
                ...(cardPos.left !== undefined
                  ? { left: cardPos.left }
                  : { right: cardPos.right }),
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-bold text-primary shrink-0">{expandedEntry.year}</span>
                  {expandedEntry.current && (
                    <span className="text-[9px] sm:text-[11px] font-mono bg-primary/10 text-primary rounded px-1.5 py-0.5 shrink-0">進行中</span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(null); setCardPos(null); }}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors ml-1 shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 max-h-56 sm:max-h-72 overflow-y-auto">
                {expandedEntry.items.map((item, idx) => {
                  const isHighlight = expandedEntry.highlights?.includes(idx) ?? false;
                  return (
                    <li key={idx} className={`flex items-start gap-1.5 text-xs sm:text-sm leading-snug ${
                      isHighlight ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      <span className={`shrink-0 mt-0.5 ${isHighlight ? "text-primary" : "text-primary/50"}`}>
                        {isHighlight ? "★" : "›"}
                      </span>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
