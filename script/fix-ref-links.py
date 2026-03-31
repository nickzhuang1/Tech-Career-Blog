#!/usr/bin/env python3
"""
將所有文章中「獨占一行的裸 Markdown 連結」改為列表項目格式：
[text](url)  →  - [text](url)
"""
import os, glob, re

ARTICLES = glob.glob("client/public/articles/*/index.md")
changed = 0

# 只匹配整行就是一個 markdown 連結的情況
BARE_LINK = re.compile(r'^\[([^\]]+)\]\(([^)]+)\)$')

for path in sorted(ARTICLES):
    with open(path, encoding="utf-8") as f:
        original = f.read()

    lines = original.split('\n')
    new_lines = []
    modified = False

    for line in lines:
        stripped = line.strip()
        # 跳過已是列表項目的連結
        if line.startswith('- ') or line.startswith('* ') or re.match(r'^\d+\.', line):
            new_lines.append(line)
            continue
        # 整行只是一個 markdown 連結 → 加上 - 前綴
        if BARE_LINK.match(stripped) and stripped:
            new_lines.append('- ' + stripped)
            modified = True
        else:
            new_lines.append(line)

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        changed += 1
        aid = os.path.basename(os.path.dirname(path))
        print(f"[UPDATED] {aid}")

print(f"\n完成：共更新 {changed} 個檔案")
