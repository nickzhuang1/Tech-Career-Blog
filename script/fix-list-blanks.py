#!/usr/bin/env python3
"""
將所有文章中「列表結尾後連續 2+ 個空行」縮減為 1 個空行。
"""
import glob, os, re

ARTICLES = glob.glob("client/public/articles/*/index.md")
IS_ITEM = re.compile(r"^ *(?:[-*]|\d+\.) ")

changed = 0
for path in sorted(ARTICLES):
    with open(path, encoding="utf-8") as f:
        original = f.read()

    lines = original.split("\n")
    new_lines = []
    i = 0
    modified = False

    while i < len(lines):
        new_lines.append(lines[i])

        # 剛輸出一行列表項目，往後看空行數量
        if IS_ITEM.match(lines[i]):
            # 找到這個 list block 真正的結尾（跳過 list 內部的空行）
            j = i + 1
            while j < len(lines) and (
                IS_ITEM.match(lines[j])
                or lines[j].strip() != ""
                or (j + 1 < len(lines) and IS_ITEM.match(lines[j + 1]))
            ):
                new_lines.append(lines[j])
                j += 1

            # 現在 j 指向第一個「list 後的空行」或 EOF
            blanks = 0
            k = j
            while k < len(lines) and lines[k].strip() == "":
                blanks += 1
                k += 1

            if blanks >= 2:
                # 只保留 1 個空行
                new_lines.append("")
                modified = True
            else:
                # blanks == 0 or 1，原樣保留
                for b in range(blanks):
                    new_lines.append(lines[j + b])

            i = k
            continue

        i += 1

    if modified:
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines))
        changed += 1
        aid = os.path.basename(os.path.dirname(path))
        print(f"[UPDATED] {aid}")

print(f"\n完成：共更新 {changed} 個檔案")
