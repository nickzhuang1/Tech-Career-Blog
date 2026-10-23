/**
 * SERP 標題長度控制。
 *
 * Google 的搜尋結果標題大約有 600px 可用；中文（全形）一個字佔兩倍寬，
 * 所以「字元數」不是可靠的指標 —— 60 個英文字母塞得下，30 個中文字就爆了。
 * 這裡用寬度估算（全形 2、半形 1）來決定要不要加站名後綴。
 *
 * 建置時（prerender）與執行時（usePageTitle）必須共用同一套規則，
 * 否則靜態 HTML 與 SPA 導覽後的標題會不一致。
 */

/** Google SERP 標題可用寬度（粗估） */
export const TITLE_MAX_WIDTH = 60;

/** 站名後綴。刻意用極短版本，把寬度留給標題本身 */
export const TITLE_SUFFIX = "| Nick";

// 全形字元：CJK、諺文、全形標點、全形符號
const FULL_WIDTH = /[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/;

/** 估算字串在 SERP 標題中佔用的寬度（emoji 視為全形） */
export function titleWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    const isEmoji = code >= 0x1f300 && code <= 0x1faff;
    width += isEmoji || FULL_WIDTH.test(ch) ? 2 : 1;
  }
  return width;
}

/**
 * 組成 `<title>`：標題本身 + 站名後綴。
 * 若加上後綴會超過 SERP 上限，就省略後綴 —— 寧可完整顯示標題，
 * 因為品牌名在搜尋結果的網址列本來就看得到。
 */
export function buildTitle(base: string, suffix: string = TITLE_SUFFIX): string {
  const withSuffix = `${base} ${suffix}`;
  return titleWidth(withSuffix) <= TITLE_MAX_WIDTH ? withSuffix : base;
}
