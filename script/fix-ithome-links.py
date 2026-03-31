#!/usr/bin/env python3
"""
將所有文章中的 iThome 連結替換成新網站內部連結；
iThome 圖片下載到本地後改用本地路徑。
"""

import re
import os
import urllib.request

BASE_URL = "https://nickzhuang.com"
ARTICLES_DIR = os.path.join(os.path.dirname(__file__), "../client/public/articles")

# ─── iThome 文章 URL → 新網站 post id ──────────────────────────────────────
# key 是 articles/{number} 路徑末段的數字（字串），value 是 post id
ARTICLE_NUM_TO_ID = {
    "10333017": "embedding",       # Day17 Gen-AI
    "10334298": "lora-theory",     # Day19 Gen-AI
    "10334853": "hypernetwork",    # Day20 Gen-AI
    "10338756": "dreambooth",      # sd-lora 中引用的 DreamBooth
    "10340057": "aigc-overview",   # 全文總結 Day30 Gen-AI
    "10218001": "k8s-monitoring-job",  # k8s管理篇初體驗 Day14
    "10216560": "docker-review",   # 第二天 Docker 複習 Day2
    "10224506": "k8s-aws-eoo",     # AWS EOO Day19 k8s
    "10224889": "k8s-eks-setup-1", # EKS上篇 Day20 k8s
}

def process_file(filepath: str) -> int:
    """回傳替換次數（含圖片下載計 1 次）"""
    with open(filepath, encoding="utf-8") as f:
        text = f.read()

    original = text
    count = 0
    article_id = os.path.basename(os.path.dirname(filepath))
    images_dir = os.path.join(os.path.dirname(filepath), "images")

    # ── 1. iThome 圖片：下載後改本地路徑 ──────────────────────────────
    img_re = re.compile(r'!\[([^\]]*)\]\((https?://(?:ithelp\.ithome\.com\.tw|s3-ap-northeast-1\.amazonaws\.com)[^)]+)\)')
    for m in img_re.finditer(original):
        img_url = m.group(2)
        alt = m.group(1)
        # 決定本地檔名（找現有 img_XXX 最大編號 + 1）
        existing = sorted([
            int(re.search(r'img_(\d+)', f).group(1))
            for f in os.listdir(images_dir)
            if re.search(r'img_(\d+)', f)
        ]) if os.path.isdir(images_dir) else []
        next_num = (existing[-1] + 1) if existing else 1
        ext = os.path.splitext(img_url.split("?")[0].split("/")[-1])[1] or ".png"
        local_name = f"img_{next_num:03d}{ext}"
        local_path = os.path.join(images_dir, local_name)
        try:
            os.makedirs(images_dir, exist_ok=True)
            req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                with open(local_path, "wb") as fout:
                    fout.write(resp.read())
            print(f"  [IMG] 下載 {img_url} → images/{local_name}")
            text = text.replace(m.group(0), f"![{alt}](./images/{local_name})")
            count += 1
        except Exception as e:
            print(f"  [IMG-FAIL] {img_url}: {e}")

    # ── 2. iThome 文章連結：替換成內部 post 連結或去掉連結 ─────────────
    def resolve_link(display: str, url: str, old_link: str) -> str:
        nonlocal count
        # a) 個別文章：articles/{num}
        art_m = re.search(r'/articles/(\d+)', url)
        if art_m:
            num = art_m.group(1)
            post_id = ARTICLE_NUM_TO_ID.get(num)
            if post_id:
                count += 1
                return f"[{display}]({BASE_URL}/posts/{post_id})"
            else:
                print(f"  [SKIP] 未知 iThome 文章 {num}，顯示文字：{display}，保留原樣")
                return old_link
        # b) ironman 系列頁：改成 /posts
        if "/ironman/" in url:
            count += 1
            return f"[{display}]({BASE_URL}/posts)"
        # c) 其他 iThome URL（外部文章）：去除超連結，僅保留文字
        print(f"  [STRIP] 去除外部連結，保留文字：{display}")
        count += 1
        return display

    # 用回溯法處理含 \[ 的嵌套括號
    url_re = re.compile(r'\]\((https?://ithelp\.ithome\.com\.tw[^)]+)\)')
    result: list[str] = []
    last_end = 0
    for m in url_re.finditer(text):
        url = m.group(1)
        open_pos = -1
        for i in range(m.start() - 1, -1, -1):
            if text[i] == '[' and (i == 0 or text[i - 1] != '\\'):
                open_pos = i
                break
        if open_pos == -1 or open_pos < last_end:
            continue
        display = text[open_pos + 1: m.start()]
        old_link = text[open_pos: m.end()]
        new_link = resolve_link(display, url, old_link)
        result.append(text[last_end:open_pos])
        result.append(new_link)
        last_end = m.end()
    result.append(text[last_end:])
    text = "".join(result)

    if text != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(text)

    return count


# ─── 掃描所有文章 ─────────────────────────────────────────────────────────
import glob

files = glob.glob(os.path.join(ARTICLES_DIR, "*/index.md"))
total = 0
changed = 0

for filepath in sorted(files):
    n = process_file(filepath)
    if n > 0:
        rel = os.path.relpath(filepath, ARTICLES_DIR)
        print(f"[UPDATED] {rel}  ({n} 處)")
        total += n
        changed += 1

print(f"\n完成：共更新 {changed} 個檔案，處理 {total} 項")
