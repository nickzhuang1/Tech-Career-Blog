# ADR-0004: 系列文章篩選改用獨立 `series` 維度＋英文 slug

**Status:** Accepted
**Date:** 2026-08-08

## Context
首頁「系列文章」卡片的兩條連結原本指向 tag 篩選（`/posts?filter=Gen%20AI`、`/posts?filter=K8S`），但 tag 語意 ≠ 系列歸屬：

- tag `Gen AI` 有 33 篇＝30 篇 2023 鐵人賽系列＋3 篇非系列（如 mediatek-lecture、dli-notes）
- tag `K8S` 有 31 篇＝30 篇 2019 鐵人賽系列＋nvidia-cert-pro

卡片上卻顯示「30」，與實際結果不符。另外若直接以中文系列名 `series: "2023 鐵人賽"` 作 URL 查詢值，網址會充滿百分號編碼、可讀性差。

## Decision
1. Posts 頁新增第三個篩選維度：`?series=<slug>`，過濾鏈為 **series → category → tag → 搜尋 → 排序**，與既有 `updateParams` 連動（互不抵消）。
2. series 升等為 registry：`export const series: Series[] = [{ id: "ironman-2023", name: "2023 鐵人賽" }, { id: "ironman-2019", name: "2019 鐵人賽" }]`；60 篇文章的 `series` 欄位值改存 **id（英文 slug）**，顯示時用查找對應 name（`seriesName()`）。
3. UI 採用「條件式顯示」：僅當 URL 帶 `?series=` 時，在分類列上方出現一行「系列：<name> ✕」活躍 chip（primary 樣式），點擊即解除；平常不顯示，避免頁面多一條絕大多數人用不到的篩選列。
4. Home 卡片連結改為 `/posts?series=ironman-2023`、`/posts?series=ironman-2019`。

## Consequences
- 系列入口的結果精確等於 30 篇，與卡片數字一致。
- `BlogCard` / `PostDetail` 的系列 badge 需透過 `seriesName()` 把 id 轉回顯示名（fallback：顯示原始 id，避免異常值破版）。
- `PostDetail` 的系列「下一篇」導航是按 `post.series` 字串分組、順序取鄰，與字串值無關，因此不受 slug 化影響。
- 未來新增系列：在 `series` registry 加一筆 `{id, name}`，文章掛新 id 即可。
- 舊連結 `/posts?filter=Gen%20AI` 仍合法（tag 篩選），只是不再代表系列。
