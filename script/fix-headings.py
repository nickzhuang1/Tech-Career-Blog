#!/usr/bin/env python3
import os, glob, re

ARTICLES = glob.glob("client/public/articles/*/index.md")
changed = 0

for path in sorted(ARTICLES):
    with open(path, encoding="utf-8") as f:
        original = f.read()

    text = original

    # 只處理含 ### 章節標題的文章（降一層）
    if re.search(r'^### ', text, re.MULTILINE):
        # #### → ### 先做，避免被下一步再降一級
        text = re.sub(r'^#### ', '### ', text, flags=re.MULTILINE)
        # ### → ##
        text = re.sub(r'^### ', '## ', text, flags=re.MULTILINE)

    # 結尾統一為恰好一個換行
    text = text.rstrip("\n") + "\n"

    if text != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        changed += 1
        relpath = os.path.relpath(path, "client/public/articles")
        print(f"[UPDATED] {relpath}")

print(f"\n完成：共更新 {changed} 個檔案")
