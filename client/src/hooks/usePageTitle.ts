import { useEffect } from "react";

const SITE_URL = "https://nickzhuang.com";

/**
 * 更新頁面級 SEO meta：title、description、canonical、og:url/og:title/og:description、
 * twitter:title/twitter:description。
 *
 * SPA 所有頁面共用同一份 index.html，若不逐頁更新 canonical，
 * Google 會把文章頁全部判定為首頁的重複內容而不予個別索引。
 *
 * @param path 頁面路徑（如 "/posts/my-article"），會拼上網域寫入 canonical 與 og:url
 */
export function usePageTitle(title: string, description?: string, path?: string) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      selector: string,
      attr: "name" | "property",
      key: string,
      content: string,
    ) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }

    if (path) {
      // 與 prerender.tsx 保持一致：canonical 指向 Cloudflare 實際回 200 的結尾斜線 URL
      const url = SITE_URL + (path === "/" ? "/" : path.replace(/\/$/, "") + "/");
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
      setMeta('meta[property="og:url"]', "property", "og:url", url);
    }
  }, [title, description, path]);
}
