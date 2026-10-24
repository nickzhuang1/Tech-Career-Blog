import { aboutData } from "./blogData";

/**
 * 對外聯繫管道：Contact 頁、About 頁與文章頁的「關於作者」卡片共用同一份清單。
 *
 * 之前三邊各自寫死連結，於是 Contact 頁有 Facebook／Email 但沒有 iThome，
 * 作者卡有 iThome 但沒有 Facebook／Email —— 同一組身分資料出現三個版本
 * （這裡、頁面、JSON-LD）。現在所有網址都來自 aboutData.social，
 * 要加減管道只改這個陣列。
 *
 * ── 配色規則（2026-10 定案，別再逐次重新討論）───────────────────────
 * 圖示框的漸層顏色按「功能分組」，**不是**按品牌色還原。
 * 圖示本身一律被 text-primary-strong 染成站台主色，顏色只作用在背景漸層，
 * 所以它扮演的是分類提示，不是品牌標記。
 *
 *   紫 → 青   站台主色：對外聯繫與邀約（LinkedIn、Email）
 *   藍        社群（Facebook）
 *   灰        程式碼與開源（GitHub）
 *   橙／琥珀   保留給「獎項／系列文」；目前沒有管道使用 ——
 *             用了會跳色（iThome 曾用橘色，就是被拿掉的那次）
 *
 * 三個色系分五個管道已經足夠。**不要**為了還原品牌色而加同色系的深淺變體：
 * 漸層是 20% 透明度，疊在深色卡片上時深藍／亮藍／淺藍的差異幾乎看不出來，
 * 反而讓 LinkedIn／Facebook／iThome 撞成一團藍，區分度比現在更差。
 *
 * 圖示家族一律用 Font Awesome 實心（react-icons/fa、react-icons/fa6）。
 * lucide 是線性描邊，混在實心品牌圖示裡在 20px 下明顯偏細。
 * 例外：每列右側的 ExternalLink 是 lucide，那是所有列共有的裝飾圖示。
 */
export type ContactChannelKey = "linkedin" | "facebook" | "github" | "ithome" | "email";

export interface ContactChannel {
  key: ContactChannelKey;
  /** 顯示名稱 */
  label: string;
  /** 一句話說明這個管道拿來做什麼 */
  description: string;
  /** 作者卡用的短標籤（空間有限，不放說明） */
  shortLabel: string;
  href: string;
  /** 是否是新分頁開啟的外部連結（mailto 不開新頁） */
  external: boolean;
}

export const contactChannels: ContactChannel[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    description: "專業社群交流",
    shortLabel: "LinkedIn",
    href: aboutData.social.linkedin,
    external: true,
  },
  {
    key: "facebook",
    label: "Facebook",
    description: "社群互動交流",
    shortLabel: "Facebook",
    href: aboutData.social.facebook,
    external: true,
  },
  {
    key: "github",
    label: "GitHub",
    description: "開源專案與程式碼",
    shortLabel: "GitHub",
    href: aboutData.social.github,
    external: true,
  },
  {
    key: "ithome",
    label: "iThome 鐵人賽",
    description: "兩屆鐵人賽的完整系列文",
    shortLabel: "iThome 鐵人賽",
    href: aboutData.social.ithome,
    external: true,
  },
  {
    key: "email",
    label: "Email",
    description: "技術合作與邀約",
    shortLabel: "Email",
    href: aboutData.social.email,
    external: false,
  },
];
