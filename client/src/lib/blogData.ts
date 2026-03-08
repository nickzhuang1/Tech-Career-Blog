export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  externalUrl: string;
  readTime: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  count: number;
  icon: string;
}

export const categories: Category[] = [
  { id: "ai", name: "AI", nameEn: "AI", count: 7, icon: "bot" },
  { id: "career", name: "職涯", nameEn: "Career", count: 1, icon: "briefcase" },
  { id: "life", name: "人生探索", nameEn: "Life Exploration", count: 2, icon: "compass" },
  { id: "deep-learning", name: "深度學習", nameEn: "Deep Learning", count: 1, icon: "brain" },
  { id: "gen-ai", name: "Gen AI", nameEn: "Generative AI", count: 2, icon: "sparkles" },
  { id: "book", name: "書籍", nameEn: "Book", count: 1, icon: "book-open" },
  { id: "k8s-docker", name: "K8S & Docker", nameEn: "K8S & Docker", count: 1, icon: "container" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "dli-notes",
    title: "DLI講師筆記: 深度學習基礎",
    date: "2025-10-03",
    category: "ai",
    tags: ["AI", "Deep Learning", "NVIDIA"],
    excerpt: "身為 NVIDIA DLI 認證講師，分享深度學習基礎課程的教學筆記與心得，涵蓋神經網路架構、訓練技巧與實務應用。",
    externalUrl: "https://nick-zhuang.notion.site/DLI-280d2b68726680c1931de96b4fbb6440",
    readTime: "8 min",
  },
  {
    id: "about-ai-cloud",
    title: "關於我：AI與雲端的技術探索之路",
    date: "2025-09-14",
    category: "career",
    tags: ["職涯", "人生探索"],
    excerpt: "從軟體工程師到 CTO，超過十年的技術職涯歷程。分享在 AI 軟體開發與系統架構設計中的成長與蛻變。",
    externalUrl: "https://nick-zhuang.notion.site/AI-274d2b687266808da195e046d4c04ea1",
    readTime: "12 min",
  },
  {
    id: "mediatek-lecture",
    title: "聯發創新基地開源模型與百工百業應用講座",
    date: "2025-08-28",
    category: "ai",
    tags: ["AI", "Open Source"],
    excerpt: "受邀於聯發創新基地分享開源模型的應用場景，探討如何將 AI 技術落地到各行各業中。",
    externalUrl: "https://nick-zhuang.notion.site/26cd2b68726680638bc5ce2c00f1ee4b",
    readTime: "6 min",
  },
  {
    id: "nvidia-rag",
    title: "完課取證！史上體感難度最高的NVIDIA DLI課程：Building RAG Agents with LLMs",
    date: "2025-04-21",
    category: "ai",
    tags: ["AI", "RAG", "LLM", "NVIDIA"],
    excerpt: "挑戰 NVIDIA DLI 最高難度課程，深入學習 RAG Agent 的建構方式，結合 LLM 實現更精準的知識檢索與回答系統。",
    externalUrl: "https://nick-zhuang.notion.site/NVIDIA-DLI-Building-RAG-Agents-with-LLMs-1f3d2b6872668069b404d64fbf3ba97f",
    readTime: "10 min",
  },
  {
    id: "leave-wordpress",
    title: "一年之後，我離開了Wordpress",
    date: "2025-04-17",
    category: "life",
    tags: ["人生探索"],
    excerpt: "從 WordPress 遷移到 Notion 的心路歷程，探討為什麼選擇離開傳統部落格平台，以及新平台帶來的改變。",
    externalUrl: "https://nick-zhuang.notion.site/Wordpress-1f3d2b687266808da712fffdfe41d2fd",
    readTime: "7 min",
  },
  {
    id: "aia-forum-2025",
    title: "2025 AIA 春季論壇: 開源模型的衝擊與對應",
    date: "2025-03-28",
    category: "ai",
    tags: ["AI", "Open Source"],
    excerpt: "參與 AIA 春季論壇，深度分析開源模型對產業的衝擊，以及企業該如何佈局與應對這波技術變革。",
    externalUrl: "https://nick-zhuang.notion.site/2025-AIA-1f3d2b68726680a79096c6391e852d7f",
    readTime: "9 min",
  },
  {
    id: "cursor-ai-award",
    title: "我透過Cursor，拿到了AI比賽的最佳獎項",
    date: "2024-11-17",
    category: "ai",
    tags: ["AI", "Cursor"],
    excerpt: "利用 AI 輔助開發工具 Cursor 參加 AI 競賽並獲得最佳獎項的經驗分享，展示 AI 工具如何改變開發者的工作方式。",
    externalUrl: "https://nick-zhuang.notion.site/Cursor-AI-1f3d2b68726680f5ac92e5c09fbd1812",
    readTime: "8 min",
  },
  {
    id: "gen-ai-future",
    title: "生成式AI驅動未來變革：開源工具與技術架構的雙向探索",
    date: "2024-11-11",
    category: "gen-ai",
    tags: ["AI", "Gen AI"],
    excerpt: "探索生成式 AI 如何驅動未來的技術變革，從開源工具到企業級技術架構，雙向深入剖析。",
    externalUrl: "https://nick-zhuang.notion.site/AI-1ccd2b687266811db0d5d916d64501b8",
    readTime: "11 min",
  },
  {
    id: "ai-father-interview",
    title: "從「AI之父辛頓訪談 & AI四巨頭」看待自學AI這件事",
    date: "2024-10-10",
    category: "ai",
    tags: ["AI", "Self Learning"],
    excerpt: "從 Geoffrey Hinton 的訪談與 AI 領域四大巨頭的觀點出發，探討自學 AI 的方法論與未來發展方向。",
    externalUrl: "https://nick-zhuang.notion.site/AI-AI-AI-1f3d2b68726680f89563cb2b14e2d5d6",
    readTime: "10 min",
  },
  {
    id: "nvidia-diffusion",
    title: "NVIDIA課程：Generative AI with Diffusion Models 筆記分享",
    date: "2024-08-18",
    category: "deep-learning",
    tags: ["AI", "Diffusion Models", "NVIDIA"],
    excerpt: "NVIDIA DLI 擴散模型課程的完整學習筆記，從數學原理到實作，深入理解生成式 AI 的核心技術。",
    externalUrl: "https://nick-zhuang.notion.site/NVIDIA-Generative-AI-with-Diffusion-Models-1f3d2b6872668013b526fb87e55ec273",
    readTime: "15 min",
  },
];

export const aboutData = {
  name: "Nick Zhuang",
  nameZh: "莊裕順",
  title: "CTO @ C.Y. Intelligence",
  titleZh: "承羽智慧 技術長",
  education: "國立中央大學 資訊工程研究所 碩士",
  experience: "10+ 年軟體開發經驗",
  expertise: [
    "AI 軟體開發",
    "系統架構設計",
    "GPU 雲端架構",
    "生成式 AI",
    "容器虛擬化 (Docker/K8S)",
    "DevOps",
  ],
  bio: "從前端到後端，從雲端到 AI，十年以上的軟體開發經驗，目前擔任 CTO 負責 AI 軟體開發與系統架構設計。專注於容器虛擬化、編制、運算架構優化，以及 AI 模型應用開發。",
  book: {
    title: "圖像生成式AI的生存指南：以Stable Diffusion為例",
    titleEn: "A Survival Guide to Image Generative AI: Using Stable Diffusion as an Example",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/nick-zhuang/",
    blog: "https://www.nickzhuang.com",
  },
};
