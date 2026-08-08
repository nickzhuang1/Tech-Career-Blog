# Content Model Glossary

Blog 資料模型的關鍵名詞，統一理解。

## post (BlogPost)
一篇部落格文章，由 `client/src/lib/blogData.ts` 中的 `blogPosts` 陣列管理。每篇要有：
- `id`（publish folder name in `client/public/articles/{id}/` 一致）
- `title` / `titleEn`
- `date`（YYYY-MM-DD）
- `category`（對應 `categories` 陣列的 id）
- `tags[]`（freeform tag labels）
- `excerpt` / `readTime`
- 選配 `series`：掛進某系列的話，填 `series` registry 的 **id**（英文 slug，如 `ironman-2023`），不填顯示名。顯示、卡片、篩選都靠 id。

內容本體放在 `client/public/articles/{id}/index.md`，可以用相對路徑圖片（`./images/...`）也支援絕對路徑。

Markdown 慣例：
- **不放 H1**（`# 標題`）在文中——H1 已由頁面標題渲染，重複會出現兩個標題（如 `8815927`、`1d4a630` 兩次修正的教訓）。
- 封面圖放第一行（`![...](./images/cover...)`），即呈現在頁面標題正下方。
- 文末署名用 `---` 分隔線＋斜體（如 `*Nick 2026.08.08 於 桃園*`）。

## category（categories）and Tags（tags）
- `category` 指定文章歸屬的大分類，用來對應 Posts 頁面上的分類篩選列。
- `tags`則让文章具備細緻的主題標籤，為頁面上的標籤篩選列與文章卡面命名。
- 有「Mirror Tags」的群組：分類名稱與同名標籤（例如 `ai` 分類對應 `AI` 標籤等），標籤過濾列想知道分類；經手確認後我們目前已把標籤篩選列：隱藏與分類同名（鏡像）的標籤， 確保 左 touc場景 "分類＝大類、標籤＝細主題" 呈現出比較不重复。

## series（series registry）
- 系列是可選的文章群組（目前有 2023 鐵人賽、2019 鐵人賽，各 30 篇）。Registry 型別 `Series { id, name }`。
- `id` 是過濾與 URL 的 key（`?series=ironman-2023`），`name` 是顯示字串。UI 呈現時需用 `series.find(s => s.id === …)?.name` 對照。
- Posts 頁的篩選維度完整名單：`series` → `category` → `filter`（tag）→ 搜尋字串。
- tag ≠ series（歷史教訓見 `ADR-0004`）：tag 是 freeform 標籤，系列是固定清單，兩者不可混用。

## certifications（NVIDIA/⋯）
All certification achievements；在 `blogData.certifications` array 中，每筆須具有 `name`、 `image`（可選）和`category`。 About 頁使用 `startsWith("NVIDIA Certified")` 的過濾 器來找到證書； Certificates 頁依照 category 分組顯示。

## AboutData
describes your professional profile：名字、職稱、簡介、專業领 域、著作出版、認證、榮譽、演講、social 連結、喜好；Timeline and 背景因果等，都從這裡出來。

## Timeline
`timeline`陣列，每年一筆 `{ year, items: string[], highlights?: number[], current?: boolean }`。 items 是當年度的行動與其他活動，由於是新陣列第一項維持 2026；雖沒有必要子排序（專用於 timeline 圖片做反轉後呈現），後沒有就恢到最早到最上面的直向順序。 timeline 頁會反轉它，最終在 Timeline 頁上方呈現最新資料くなります。

## Image Conventions
- public/assets 图档位置：`client/public/`（根）
- 文章资料： `client/public/articles/{id}/images/...`（relative from the article）
- rerunstatic build `dist/` 時，外圖文件是複製過去、並改寫 markdown image links 為 `/articles/{id}/...`.
