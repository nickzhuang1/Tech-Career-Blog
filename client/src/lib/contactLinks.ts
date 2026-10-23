import { aboutData } from "./blogData";

/**
 * 對外聯繫管道：Contact 頁與文章頁的「關於作者」卡片共用同一份清單。
 *
 * 之前兩邊各自寫死連結，於是 Contact 頁有 Facebook／Email 但沒有 iThome，
 * 作者卡有 iThome 但沒有 Facebook／Email —— 同一組身分資料出現三個版本
 * （這裡、頁面、JSON-LD）。現在所有網址都來自 aboutData.social，
 * 要加減管道只改這個陣列。
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
