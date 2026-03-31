#!/usr/bin/env python3
"""
1. 移除列表項目之間的空行（列表內部的空行）
2. 無語言標籤的 code fence 補上 bash
"""
import glob, os, re

ARTICLES = glob.glob("client/public/articles/*/index.md")
IS_ITEM = re.compile(r"^[ \t]*(?:[-*]|\d+\.) ")
changed = 0

for path in sorted(ARTICLES):
    with open(path, encoding="utf-8") as f:
        original = f.read()

    lines = original.split("\n")
    new_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # ── 任務 2：補 bash ──────────────────────────────
        stripped = line.lstrip("\u200b\ufeff\u00a0\u180e\u2060")
        if stripped == "```":
            new_lines.append(line.replace("```", "```bash", 1))
            i += 1
            continue

        # ── 任務 1：在列表區塊內移除空行 ──────────────────
        # 進入列表區塊
        if IS_ITEM.match(line):
            # 收集整個 list block（含巢狀縮排，但遇到 2 個以上連續空行 or block 元素就停）
            block = []
            while i < len(lines):
                cur = lines[i]
                c_stripped = cur.lstrip("\u200b\ufeff\u00a0\u180e\u2060")
                # 遇到 code fence / heading / --- / 圖片 等 block 元素就停
                if c_stripped.startswith("```") or re.match(r"^#{1,4} |^---|^!\[|^>\s|^\|", c_stripped):
                    break
                # 空行：看下一個非空行，若不是列表項目（且縮排為 0）就停
                if cur.strip() == "":
                    j = i + 1
                    while j < len(lines) and lines[j].strip() == "":
                        j += 1
                    next_line = lines[j] if j < len(lines) else ""
                    # 下一行是列表項目 or 縮排延伸 → 屬於列表內部，吸入但稍後去除空行
                    if IS_ITEM.match(next_line) or (next_line.strip() and not re.match(r"^#{1,4} |^---|^!\[|^>\s|^\|", next_line.lstrip("\u200b\ufeff\u00a0\u180e\u2060")) and len(next_line) - len(next_line.lstrip()) > 0):
                        block.append(cur)
                        i += 1
                        continue
                    else:
                        break
                block.append(cur)
                i += 1

            # 輸出 block，移除相鄰列表項目之間的空行
            # 規則：空行的前一個非空行是列表項目，後一個非空行也是列表項目 → 移除
            j = 0
            while j < len(block):
                if block[j].strip() == "":
                    # 找前一個非空行
                    prev = j - 1
                    while prev >= 0 and block[prev].strip() == "":
                        prev -= 1
                    # 找後一個非空行
                    nxt = j + 1
                    while nxt < len(block) and block[nxt].strip() == "":
                        nxt += 1
                    prev_is_item = prev >= 0 and IS_ITEM.match(block[prev])
                    next_is_item = nxt < len(block) and IS_ITEM.match(block[nxt])
                    if prev_is_item and next_is_item:
                        j += 1
                        continue  # 跳過這個空行
                new_lines.append(block[j])
                j += 1
            continue

        new_lines.append(line)
        i += 1

    result = "\n".join(new_lines)
    if result != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(result)
        changed += 1
        aid = os.path.basename(os.path.dirname(path))
        print(f"[UPDATED] {aid}")

print(f"\n完成：共更新 {changed} 個檔案")
