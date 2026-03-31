#!/usr/bin/env python3
"""
還原：上次腳本把閉合的 ``` 也改成了 ```bash，這裡修正回來
然後再對開啟且無語言標籤的 fence 補 bash
"""
import glob, os, re

ARTICLES = glob.glob("client/public/articles/*/index.md")
STRIP = re.compile(r"^[\u200b\ufeff\u00a0\u180e\u2060]+")
changed = 0

for path in sorted(ARTICLES):
    with open(path, encoding="utf-8") as f:
        original = f.read()

    lines = original.split("\n")
    new_lines = []
    in_code = False
    modified = False

    for line in lines:
        stripped = STRIP.sub("", line)
        is_fence = stripped.startswith("```")

        if is_fence:
            lang = stripped[3:].strip()
            if not in_code:
                # 開啟 fence
                if lang == "":
                    # 補 bash
                    new_lines.append("```bash")
                    modified = True
                else:
                    new_lines.append(line)
                in_code = True
            else:
                # 閉合 fence — 一律輸出純 ```
                if line.strip() != "```":
                    modified = True
                new_lines.append("```")
                in_code = False
        else:
            new_lines.append(line)

    result = "\n".join(new_lines)
    if result != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(result)
        changed += 1
        aid = os.path.basename(os.path.dirname(path))
        print(f"[FIXED] {aid}")

print(f"\n完成：共修正 {changed} 個檔案")

