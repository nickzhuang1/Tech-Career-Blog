#!/usr/bin/env python3
"""
將所有文章中的 notion.site 連結替換成新網站的 /posts/{id} 連結。
mapping 來源：blogData.ts 中每筆 post 的 externalUrl 尾端 32 碼 hex。
"""

import re
import os
import glob

# ─── 1. 從 blogData.ts 手動列出 notion-hash → post-id 的對照表 ──────────────
# 格式：notion URL 尾端的 32 碼 hex（去掉 slug 前綴）→ post id
NOTION_HASH_TO_ID = {
    # 2023 鐵人賽
    "1e9d2b68726680208557eb7448c15fc0": "aigc-origin",
    "1e9d2b687266809887f1dbd5800e6a60": "aigc-what",
    "1e9d2b68726680d5895dcf748570a1bb": "aigc-features",
    "1e9d2b68726680a0b1aad118f8725125": "aigc-evolution",
    "1e9d2b6872668072929dd74a75aa6b62": "vae",
    "1e9d2b68726680738259c7fa6400c1ec": "gan",
    "1e9d2b6872668072a09be3e4ec387f3b": "pixel-rnn",
    "1e9d2b68726680bfaa1bd0ad16488cbc": "flow",
    "1e9d2b68726680bbaf43eeb616d089df": "diffusion",
    "1e9d2b68726680049bbcfff1ab9fee1a": "transformer",
    "1e9d2b68726680b69ec0c1711f8f0444": "nerf",
    "1e9d2b68726680b5912ad1470c2e992e": "clip",
    "1e9d2b6872668043b9c9db94ab8a4f5f": "gai-tools",
    "1e9d2b6872668032a2fcd1f3b1c7ee0e": "sd-principle",
    "1e9d2b687266803083ebfa42a148dae4": "sd-install",
    "1e8d2b68726680e08ea5c22f869acc82": "sd-basic",
    "1e8d2b687266807fb94afb8f922ee7d7": "embedding",
    "1e8d2b68726680ec974dfc9cbe016d01": "dreambooth",
    "1e8d2b6872668020b5c8fb97c7276be4": "lora-theory",
    "1e8d2b68726680e4a239c4b429eb4d60": "hypernetwork",
    "1e8d2b68726680818d9bdb97ee49fc4b": "civitai",
    "1e8d2b687266801ba8eacafcf287b2d9": "sd-plugin-1",
    "1e8d2b68726680d9999df6f6079b4ff4": "sd-plugin-2",
    "1e8d2b687266806ba36bf7451f04dc77": "controlnet",
    "1e8d2b687266805596d8ccf7c3b4c2f2": "swinir",
    "1e8d2b687266805f979ce6ee6182954a": "sd-advanced",
    "1e8d2b68726680a0b848c037848481b0": "sd-checkpoint",
    "1e8d2b68726680939a4aead23e32b99c": "sd-lora",
    "1e8d2b687266808ebcaaec4768b14376": "sd-xl",
    "1e8d2b687266808ca88ddeda8e1c0503": "aigc-overview",
    # 2019 鐵人賽
    "1e9d2b68726680b4b6a5d53ee88014fb": "k8s-intro",
    "1e9d2b6872668018a774df1c34ddc7fb": "docker-review",
    "1e9d2b68726680ec9e4cdffa7af1c0fe": "k8s-minikube",
    "1e9d2b68726680049139f77c9ae39021": "docker-vs-k8s-commands",
    "1e9d2b68726680d19265f238cb174616": "k8s-node-master",
    "1e9d2b68726680c79b63f285c9ff6992": "k8s-abstraction",
    "1e9d2b68726680f59fe8d5f37bc29e50": "devops",
    "1e9d2b687266807487bedc9d924465ac": "k8s-pod-label",
    "1ead2b687266802ea4dbc285f67c5b63": "k8s-deploy-svc",
    "1efd2b68726680fd8e10f382478dc3cf": "k8s-svc-discovery",
    "1f0d2b687266806b92fefb8bd3dbe589": "k8s-ingress-vol",
    "1f0d2b68726680c69dadd98cacafb481": "k8s-statefulset",
    "1f0d2b6872668080b20af8cb58ba6022": "k8s-affinity",
    "1f0d2b68726680d0995bfe1b9a6008a0": "k8s-monitoring-job",
    "1f0d2b687266804a9236faaaaeefe4cb": "k8s-quota-ns",
    "1f0d2b687266803096d7f86170e1ca3c": "k8s-user-mgmt",
    "1f0d2b68726680f1b69eda34aa091f98": "k8s-pv-pod",
    "1f0d2b687266804793dbf80040d218f9": "k8s-harbor-helm",
    "1f0d2b68726680ac80b5fcb63700f600": "k8s-aws-eoo",
    "1f0d2b6872668041ab6fea00e8dd55f1": "k8s-eks-setup-1",
    "1f0d2b68726680b7be99e32ac7b29bbb": "k8s-eks-setup-2",
    "1f0d2b68726680c99b41ca046abf72b8": "k8s-pod-basics",
    "1f0d2b6872668013bf47dfa5b607e559": "k8s-ingress-elb",
    "1f0d2b68726680bd90ffc3629c6e5a76": "k8s-scheduling",
    "1f0d2b687266803a8955ef8f4d794ddd": "k8s-mgmt-discovery",
    "1f0d2b687266807f9ccfffcabc81da74": "k8s-mgmt-rbac",
    "1f0d2b6872668062a919dd160ad5a85f": "k8s-app-helm",
    "1f0d2b68726680bd9a34c99d63b844b7": "k8s-app-ebs-efs",
    "1f0d2b68726680bc9dd5dd7b27b4f749": "k8s-cluster-ha",
    "1e9d2b687266802585b4c4a9ae6be18d": "k8s-summary",
}

BASE_URL = "https://nickzhuang.com"

# ─── 2. 替換函式 ─────────────────────────────────────────────────────────────
def _notion_id_to_post(url: str) -> str | None:
    """從 notion URL 抽出 32 碼 hex 並查表，回傳 post_id 或 None"""
    path = url.split("?")[0].rstrip("/")
    last_seg = path.split("/")[-1]
    hex_match = re.search(r"([0-9a-f]{32})$", last_seg)
    if not hex_match:
        return None
    return NOTION_HASH_TO_ID.get(hex_match.group(1))


def _find_link_open(text: str, before_pos: int) -> int:
    """從 before_pos 往前找最後一個「未被 \\ 逃脫的 [」的位置"""
    for i in range(before_pos - 1, -1, -1):
        if text[i] == '[' and (i == 0 or text[i - 1] != '\\'):
            return i
    return -1


def replace_notion_links(text: str) -> tuple[str, int]:
    """
    找每一個 ](https://nick-zhuang.notion.site...) 片段，
    向前回溯找最外層的 [ 作為連結文字起點，建構新連結取代之。
    回傳 (替換後的文字, 替換次數)
    """
    url_re = re.compile(r'\]\((https://nick-zhuang\.notion\.site[^)]+)\)')
    result: list[str] = []
    last_end = 0
    count = 0

    for m in url_re.finditer(text):
        url = m.group(1)
        post_id = _notion_id_to_post(url)
        if not post_id:
            path = url.split("?")[0].split("/")[-1]
            print(f"  [SKIP] 找不到對應 post_id：{path}")
            continue

        # m.start() 是 ']' 的位置，往前找真正的 '['
        open_pos = _find_link_open(text, m.start())
        if open_pos == -1 or open_pos < last_end:
            continue  # 找不到正確起點，略過

        display = text[open_pos + 1: m.start()]  # '[' 和 ']' 之間的文字
        new_url = f"{BASE_URL}/posts/{post_id}"

        result.append(text[last_end:open_pos])      # 連結前的內容
        result.append(f"[{display}]({new_url})")    # 新連結
        last_end = m.end()
        count += 1

    result.append(text[last_end:])
    return "".join(result), count


# ─── 3. 掃描所有文章 ─────────────────────────────────────────────────────────
articles_dir = os.path.join(os.path.dirname(__file__), "../client/public/articles")
files = glob.glob(os.path.join(articles_dir, "*/index.md"))

total_replaced = 0
files_changed = 0

for filepath in sorted(files):
    with open(filepath, encoding="utf-8") as f:
        original = f.read()

    updated, n = replace_notion_links(original)
    if n > 0:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated)
        rel = os.path.relpath(filepath, articles_dir)
        print(f"[UPDATED] {rel}  ({n} 處)")
        total_replaced += n
        files_changed += 1

print(f"\n完成：共更新 {files_changed} 個檔案，替換 {total_replaced} 個連結")
