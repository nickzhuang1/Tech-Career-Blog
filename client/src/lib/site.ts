/**
 * 站台層級的品牌與個人事實，集中在這裡，避免同一段文案在多處寫死而不同步。
 *
 * 年資一律由 `CAREER_START` 推算 —— 之前在首頁副標、統計卡、description
 * 三處各寫了一次「12 年 / 十年 / 12+」，數字還彼此不一致。
 */

/** 第一份工作的到職日（2013-12-03）。之後所有「N 年經驗」都由此推算 */
export const CAREER_START = { year: 2013, month: 12, day: 3 };

/** 網站實體名稱（og:site_name、RSS 標題、JSON-LD WebSite.name 用） */
export const SITE_NAME = "Nick's Blog - AI異想封印";

/** 首頁標語，同時當 <title> 的主體 */
export const HOME_TAGLINE = "AI 異想封印：技術實戰與職涯思索";

/** 滿幾年（未滿週年不進位）。預設用現在時間，測試時可傳入固定日期 */
export function yearsOfExperience(now: Date = new Date()): number {
  const years = now.getFullYear() - CAREER_START.year;
  const beforeAnniversary =
    now.getMonth() + 1 < CAREER_START.month ||
    (now.getMonth() + 1 === CAREER_START.month && now.getDate() < CAREER_START.day);
  return beforeAnniversary ? years - 1 : years;
}

/**
 * 首頁 description。由現在時間推算年資，所以換年度建置時會自動更新，
 * 不需要記得回來改文案。
 */
export function homeDescription(now: Date = new Date()): string {
  return `分享 AI 技術實戰、系統架構與職涯思索。${yearsOfExperience(now)} 年軟體開發經驗，從前端到後端、從雲端到人工智慧。這裡有 K8S 與生成式 AI 的實作筆記、NVIDIA 認證備考心法，以及技術管理路上的職涯觀察。`;
}
