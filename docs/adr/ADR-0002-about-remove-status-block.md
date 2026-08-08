# ADR-0002: 移除 About 頁 // status 卡片

**Status:** Accepted
**Date:** 2026-08-08

## Context
About 頁右欄原本有一個風格化小卡「// status」，內容包含姓名、標題，以及「Active & Building」的閃爍綠點。審視後使用者認為該內容重複、且缺乏具體資訊；想讓右欄更簡潔。

## Decision
直接將 `// status` 卡片移除，連同創作中的 Active & Building 動態元素一起。右欄只保留：背景（avatar）、展示圖（2 張）、連結（LinkedIn／Facebook／GitHub／Email）、興趣。

## Consequences
- 右欄整體長度縮短、視覺更清爽。
- 無其它頁面或功能依賴該區塊（未在其他地方引用 `aboutData.titleZh` 或綠燈元素）。
