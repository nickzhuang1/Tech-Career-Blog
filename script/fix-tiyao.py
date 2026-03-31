"""
修正所有系列文章 index.md 中「提要」段落的連結格式：
1. 統一標題為 ## 提要
2. 每個連結改成 - [text](#text) 格式
3. 移除各連結項目之間的空行
"""
import os
import re

ARTICLES_DIR = os.path.join(os.path.dirname(__file__), "..", "client", "public", "articles")

def fix_file(md_path: str, article_id: str) -> bool:
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "提要" not in content:
        return False

    lines = content.split("\n")
    new_lines = []
    in_tiyao = False
    tiyao_links: list[str] = []   # 暫存提要段落的連結行
    changed = False

    def flush_tiyao_links():
        """把暫存的連結一口氣寫出（去除項目間空行），前後補空行"""
        if tiyao_links:
            new_lines.append("")           # 提要標題後的空行
            for lk in tiyao_links:
                new_lines.append(lk)
            new_lines.append("")           # 最後一項後的空行
        tiyao_links.clear()

    i = 0
    while i < len(lines):
        line = lines[i]

        # 偵測提要標題
        if re.match(r"^#{1,4} 提要\s*$", line):
            # 統一改成 ## 提要
            normalized = "## 提要"
            if line.strip() != normalized:
                changed = True
            new_lines.append(normalized)
            in_tiyao = True
            i += 1
            continue

        if in_tiyao:
            # 遇到下一個標題 → 結束提要段落
            if re.match(r"^#{1,4} ", line):
                flush_tiyao_links()
                in_tiyao = False
                new_lines.append(line)
                i += 1
                continue

            # 空行：在提要段落中跳過（等全部收集完再輸出）
            if line.strip() == "":
                i += 1
                continue

            # 有連結的行：可能有 - 前綴，也可能沒有
            lm = re.match(r"^(?:-\s*)?\[([^\]]+)\]\(([^)]+)\)\s*$", line)
            if lm:
                text, url = lm.group(1), lm.group(2)
                new_link = f"- [{text}](#{text})"
                if line.strip() != new_link:
                    changed = True
                tiyao_links.append(new_link)
                i += 1
                continue

            # 非連結行（正常段落文字） → 輸出
            flush_tiyao_links()
            new_lines.append(line)
            i += 1
            continue

        new_lines.append(line)
        i += 1

    # 文件若以提要結尾
    if in_tiyao:
        flush_tiyao_links()

    has_tiyao = any(re.match(r"^#{1,4} 提要\s*$", l) for l in lines)
    if not has_tiyao:
        return False

    # 只要有提要就重寫（確保空行格式正確，冪等）
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(new_lines))
    return True


updated = []
skipped = []
for article_id in sorted(os.listdir(ARTICLES_DIR)):
    md_path = os.path.join(ARTICLES_DIR, article_id, "index.md")
    if not os.path.exists(md_path):
        continue
    if fix_file(md_path, article_id):
        updated.append(article_id)
    else:
        skipped.append(article_id)

print(f"\nUpdated ({len(updated)}):")
for a in updated:
    print(f"  ✓ {a}")
print(f"\nNo change needed ({len(skipped)}):")
for a in skipped:
    print(f"  - {a}")
