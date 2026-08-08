# ADR-0003: 新增 NVIDIA Certified Associate | Accelerated Data Science 證書＆timeline 補充

**Status:** Accepted
**Date:** 2026-08-08

## Context
使用者獲得一張新證書「NVIDIA Certified Associate | Accelerated Data Science」（縮寫 NCA-ADS）。需要：
1. 將它登記在 certificates 陣列（與其他 NVIDIA Certified 一致）——About 頁的「認證」區塊和 Certificates 頁 Wall 都直接取自這個陣列。
2. 讓 timeline 2026 補上對應的學習活動（NVIDIA 課程研習）。
3. 之前使用者討論過另一個命名：「Data Scientist Acceleration」，但官方名稱是「Accelerated Data Science」（NVIDIA提供了對應證照圖 `NVIDIA Certified Associate | Accelerated Data Science.png`），因此統一使用官方命名，避免 Vitemeta 和 path 不一致。

## Decision
1. certificates 陣列插入一筆：`{ name: "NVIDIA Certified Associate | Accelerated Data Science", image: "/certificates/NVIDIA Certified Associate | Accelerated Data Science.png", category: "NVIDIA" }`，位置緊接在 「AI Infrastructure and Operations」（亦為 Associate 證書群）之後。
2. timeline 2026 items 最後增加「NVIDIA 課程研習」一項；沿用 timeline 短名寫法（之前已有『NCA-ADS認證』與『NCA-GENM認證』）。
3. timeline「NVIDIA 課程研習」不加 highlight，維持原本 highlights [1]（NCP-AII 認證）不變；不同年份重複出現同名學習活動（2019/2024 也出現「NVIDIA 課程研習」）屬實際狀況，反而保留通名不改寫，避免改名門檻。

## Consequences
- Certificates 頁自動出現新證書（category 為 NVIDIA）。
- About 頁『認證』區塊，會因為 `cert.name.startsWith("NVIDIA Certified")` 篩選到，所以新證書會出現在第 5 位（在 Associate 群列後）。
- 如果後續再新增證書，可遵循現行 certificates 陣列新增順序；如果想更細分，可以另行操作，但目前手動管理可行且風格一致。
- timeline 不移除或更改既有資料；不形成錯亂。（除另有學業，其情況下可以直接改名「NVIDIA DS 課程研習」或加註來區別，例如學術分組想標示不同主題時——我們目前没有這個需求。）
