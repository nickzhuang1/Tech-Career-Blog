# ADR-0001: About 頁 showcase 拆成上下兩張圖

**Status:** Accepted
**Date:** 2026-08-08

## Context
原本 About 頁右欄「展示圖片」區只放一張合成圖 `/showcase.png`（書籍+獎盃+NVIDIA認證合併）。為了更清楚地分別展示「著作與獎盃」與「NVIDIA 認證」兩類素材，需要改成兩張圖。討論重點：

- 是否把既有 showcase.png 拆開？
- 圖片命名與存放位置。
- 展示型式（同一卡片上下 vs 兩個卡片）。

## Decision
- 保留一個展示卡片，內部改為上下排列的兩張圖，`space-y-2` 包含間隔。
- 圖片來源：使用者自行提供
  - 上層（書籍＋獎杯）：`/showcase.png`（沿用使用者定期更新的檔名，不再變動引用路徑）
  - 下層（NV認證）：`/nv-certs.png`
- 兩張圖直接放在 `client/public/` 根目錄（沿用既有 showcase.png 的位置習慣）。
- 不再保留原先舊的單張合成圖作為另一張下掛，避免意涵混淆；如果日後需要保留可被 git 回復（版本控制內）

## Consequences
- About 頁右欄展示區更清楚區分「著作/獎項」與「認證」，訪客能快速理解。
- 介面不影響 Certificates、Timeline 功能。
- 如果使用者自行更換 showcase.png / nv-certs.png，About 頁即時反映（因為 images 放置在 public/ 根目錄被直接提供）；無需重新 build，因為它是靜態 public 資產提供。