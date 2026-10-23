import { blogPosts, type BlogPost } from "./blogData";

/**
 * 主題聚合頁（collection）定義。
 *
 * 背景：分類與系列原本只是 `/posts?series=…` 的查詢字串，canonical 一律指向 `/posts`，
 * 因此這些聚合頁永遠不會被 Google 獨立索引。這裡把「值得被搜尋到的聚落」明確定義成
 * 有自己 URL 的落地頁，並各自附上一段獨一無二的導讀文案（避免變成 thin content）。
 *
 * 收錄原則（依實際資料決定，不是照分類清單全做）：
 * - 系列頁優先：2019 / 2023 各 30 篇，是目前最大的內容資產
 * - 只做「排除系列後仍有獨立內容」的聚落；gen-ai（31 篇中 30 篇在系列內）、
 *   k8s-docker（30 篇全在系列內）、Stable Diffusion（15 篇全在系列內）等
 *   會與系列頁近乎重複，因此不建獨立頁
 */
export type CollectionKind = "series" | "category" | "tag";

export interface CollectionDef {
  kind: CollectionKind;
  /** URL 片段：/series/<slug>/ */
  slug: string;
  /** 對應的原始鍵值：系列 id / 分類 id / 標籤名稱 */
  source: string;
  /** H1 與麵包屑顯示的名稱 */
  name: string;
  /** <title> 用（不含站名） */
  seoTitle: string;
  /** meta description（60–155 字元） */
  description: string;
  /** 一行範圍說明，放在 H1 下方 */
  scope: string;
  /** 導讀段落（旁觀者視角，說明這個聚落涵蓋什麼、適合誰） */
  intro: string[];
  /** 這個聚落包含的文章 */
  posts: BlogPost[];
  /** 互相關聯的其他聚落路徑（避免成為孤島頁） */
  related: string[];
}

const asc = (a: BlogPost, b: BlogPost) => (a.date < b.date ? -1 : 1);
const desc = (a: BlogPost, b: BlogPost) => (a.date < b.date ? 1 : -1);

const bySeries = (id: string) =>
  blogPosts.filter((p) => p.series === id).sort(asc);
const byCategory = (id: string) =>
  blogPosts.filter((p) => p.category === id).sort(desc);
const byTag = (name: string) =>
  blogPosts.filter((p) => p.tags.includes(name)).sort(desc);

export const collections: CollectionDef[] = [
  {
    kind: "series",
    slug: "ironman-2023",
    source: "ironman-2023",
    name: "2023 鐵人賽：AIGC 三十天",
    seoTitle: "2023 鐵人賽 AIGC 系列（30 篇）",
    description:
      "2023 iThome 鐵人賽 AIGC 系列共 30 篇：先講 VAE、GAN、Diffusion、Transformer、CLIP 等生成模型原理，再進到 Stable Diffusion 安裝、LoRA、ControlNet 與 SDXL 實作。",
    scope: "30 篇 · 生成模型原理 → Stable Diffusion 實作",
    intro: [
      "2023 年的 iThome 鐵人賽，作者用三十篇的篇幅把生成式 AI 的技術脈絡梳理了一遍，編排邏輯是「先懂原理、再動手」。前段回到模型本身：VAE、GAN、Pixel RNN、Flow、Diffusion、Transformer、NeRF、CLIP 依序登場，每一篇說明該模型為了解決什麼問題而出現，以及在實務上留下哪些限制。",
      "後段轉入實作：Stable Diffusion 的安裝與基礎操作、Embedding 與 Dreambooth 的微調概念、LoRA 與 HyperNetwork 的原理差異，接著是 Civitai、HuggingFace 等資源站、基礎與進階插件、ControlNet 的條件控制、SwinIR 的影像重建，最後以 Checkpoint 與 LoRA 的訓練流程、SDXL 的演進收尾。",
      "適合已經在玩生成式 AI、但對「為什麼這個參數有效」還想弄清楚的讀者。",
    ],
    posts: bySeries("ironman-2023"),
    related: ["/tag/deep-learning", "/category/ai"],
  },
  {
    kind: "series",
    slug: "ironman-2019",
    source: "ironman-2019",
    name: "2019 鐵人賽：Kubernetes 三十天",
    seoTitle: "2019 鐵人賽 Kubernetes 系列（30 篇）",
    description:
      "2019 iThome 鐵人賽 Kubernetes 系列共 30 篇：從 Docker 複習與 minikube 起步，逐篇拆解 Pod、Deployment、Ingress、StatefulSet、RBAC，最後在 AWS EKS 上重做一次。",
    scope: "30 篇 · k8s 核心物件 → EKS 上雲",
    intro: [
      "2019 年的 iThome 鐵人賽，作者把 Kubernetes 從入門帶到實務，三十篇的順序刻意設計成可以照著讀：先回頭複習 Docker 與常用指令，再用 minikube 建一個本機測試環境，接著才拆解 Node、Master、Object 這些容易混淆的架構名詞。",
      "中段依序走過基礎篇（Pod、Deployment、Service）、進階篇（Ingress、Volume、StatefulSet、DaemonSet、Affinity 與 Taints）、管理篇（Monitoring、Resource Quota、RBAC）與實務篇（EKS 上雲、Helm、HPA/CA、EBS/EFS）。系列的特色是同一組概念講兩次：先在本機叢集操作，再到 AWS EKS 上重做一遍，兩者差異之處正好是需要留意的地方。",
      "適合正在把服務搬上叢集，或想弄清楚每個資源物件為何存在的人。",
    ],
    posts: bySeries("ironman-2019"),
    related: ["/category/ai"],
  },
  {
    kind: "category",
    slug: "ai",
    source: "ai",
    name: "AI 實務與認證",
    seoTitle: "AI 實務與認證（12 篇）",
    description:
      "NVIDIA DLI 課程與證照準備心得、企業 AI 基礎建設藍圖、開源模型觀察，以及自學 AI 的實務紀錄。",
    scope: "12 篇 · 課程、證照與企業導入",
    intro: [
      "這個分類收的是作者近年關於 AI 的實務紀錄，主題看似分散，但有一條共同線：把 AI 從「會用」推到「能在組織裡落地」。內容包含 NVIDIA DLI 課程的完課筆記（Generative AI with Diffusion Models、Building RAG Agents with LLMs、深度學習基礎）、五張 NVIDIA 認證的準備方式，以及企業 AI 基礎建設從網路底層到應用層的規劃藍圖。",
      "另一部分偏向觀察與反思：開源模型的能力邊界、AI 素養與自學路徑、社群活動的現場筆記。相較於教學型的系列文章，這裡更接近「真實組織導入 AI 會遇到什麼」。",
    ],
    posts: byCategory("ai"),
    related: ["/tag/nvidia", "/tag/deep-learning"],
  },
  {
    kind: "tag",
    slug: "nvidia",
    source: "NVIDIA",
    name: "NVIDIA 認證與 DLI 課程",
    seoTitle: "NVIDIA 認證與 DLI 課程（6 篇）",
    description:
      "NVIDIA DLI 課程完課紀錄、五張 NVIDIA 認證的準備方式，以及企業級 AI 基礎建設的實務整理。",
    scope: "6 篇 · 課程、考照與 AI 基礎建設",
    intro: [
      "NVIDIA 認證與課程相關的文章集中在這裡：三堂 DLI 課程的完課紀錄（Generative AI with Diffusion Models、Building RAG Agents with LLMs、深度學習基礎講師筆記）、證照準備的實際做法與體感，以及第五張 NVIDIA 認證到手當天的紀錄。",
      "如果想先知道「DLI 課程到底難不難、考照要準備多久、企業導入 AI 該從哪一層開始」，這六篇是最短的入口。",
    ],
    posts: byTag("NVIDIA"),
    related: ["/category/ai", "/tag/deep-learning"],
  },
  {
    kind: "tag",
    slug: "deep-learning",
    source: "Deep Learning",
    name: "深度學習",
    seoTitle: "深度學習（15 篇）",
    description:
      "從 VAE、GAN、Diffusion、Transformer、CLIP 到膠囊網路與 SwinIR：理解模型內部運作的深度學習筆記。",
    scope: "15 篇 · 模型原理與學習筆記",
    intro: [
      "深度學習是本站橫跨最久的標籤：從 2023 年鐵人賽的生成模型原理（VAE、GAN、Pixel RNN、Flow、Diffusion、Transformer、NeRF、CLIP），到膠囊網路的技術白皮書、影像重建的 SwinIR，再到近年的 NVIDIA 課程與學習筆記。",
      "這個聚落適合當作「理解模型怎麼運作」的補充教材 —— 特別是對已經會操作工具、但想補上理論基礎的人。",
    ],
    posts: byTag("Deep Learning"),
    related: ["/series/ironman-2023", "/tag/nvidia"],
  },
];

/** 正規化的頁面路徑（不含結尾斜線，供 wouter Link 使用） */
export const collectionPath = (c: CollectionDef) => `/${c.kind}/${c.slug}`;

export function findCollection(
  kind: CollectionKind,
  slug: string,
): CollectionDef | undefined {
  return collections.find((c) => c.kind === kind && c.slug === slug);
}

/** 依系列 id 找聚合頁（文章頁的「系列目錄」連結用） */
export function collectionForSeries(seriesId: string): CollectionDef | undefined {
  return collections.find((c) => c.kind === "series" && c.source === seriesId);
}

/** 依分類 id 找聚合頁 */
export function collectionForCategory(categoryId: string): CollectionDef | undefined {
  return collections.find((c) => c.kind === "category" && c.source === categoryId);
}

/** 依標籤名稱找聚合頁（只有被收錄的標籤才有頁面） */
export function collectionForTag(tagName: string): CollectionDef | undefined {
  return collections.find((c) => c.kind === "tag" && c.source === tagName);
}

/** 首頁／所有文章以外的站內「主題」連結，供 footer 使用（提升聚合頁的可爬性） */
export const collectionLinks = collections.map((c) => ({
  href: collectionPath(c),
  label: c.name,
}));
