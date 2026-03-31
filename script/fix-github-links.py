#!/usr/bin/env python3
"""
Replace github.com/x1y2z3456/ironman/... links with nickzhuang.com/posts/... URLs.
Scans all index.md files under client/public/articles/.
"""

import re
import os
from pathlib import Path

# Day number → post slug mapping
DAY_TO_SLUG = {
    1:  "k8s-intro",
    3:  "k8s-minikube",
    5:  "k8s-node-master",
    6:  "k8s-abstraction",
    8:  "k8s-pod-basics",
    9:  "k8s-deploy-svc",
    10: "k8s-svc-discovery",
    11: "k8s-ingress-vol",
    12: "k8s-statefulset",
    13: "k8s-affinity",
    14: "k8s-monitoring-job",
    15: "k8s-quota-ns",
    16: "k8s-pv-pod",
    17: "k8s-user-mgmt",
    18: "k8s-harbor-helm",
    19: "k8s-aws-eoo",
    20: "k8s-eks-setup-1",
    21: "k8s-eks-setup-2",
    22: "k8s-pod-label",
    23: "k8s-ingress-elb",
    24: "k8s-scheduling",
    25: "k8s-mgmt-discovery",
    26: "k8s-mgmt-rbac",
    27: "k8s-app-helm",
    28: "k8s-app-ebs-efs",
    29: "k8s-cluster-ha",
    30: "k8s-summary",
}

# Matches https://github.com/x1y2z3456/ironman/(tree|blob)/master/day<N>[/optional/path]
GITHUB_PATTERN = re.compile(
    r'https://github\.com/x1y2z3456/ironman/(?:tree|blob)/master/day(\d+)(?:/[^\s\)\"\']*)?'
)

def replace_link(match: re.Match) -> str:
    day = int(match.group(1))
    slug = DAY_TO_SLUG.get(day)
    if slug:
        return f"https://nickzhuang.com/posts/{slug}"
    # No mapping found — leave as-is and warn
    print(f"  WARNING: no slug mapping for day{day}, leaving unchanged: {match.group(0)}")
    return match.group(0)

articles_dir = Path(__file__).parent.parent / "client" / "public" / "articles"
changed = 0

for md_file in sorted(articles_dir.rglob("index.md")):
    original = md_file.read_text(encoding="utf-8")
    updated = GITHUB_PATTERN.sub(replace_link, original)
    if updated != original:
        md_file.write_text(updated, encoding="utf-8")
        changed += 1
        # Show which links were replaced
        for m in GITHUB_PATTERN.finditer(original):
            day = int(m.group(1))
            slug = DAY_TO_SLUG.get(day)
            if slug:
                print(f"  [{md_file.parent.name}] day{day} → /posts/{slug}")
        print(f"  ✓ {md_file.parent.name}")

print(f"\nDone. {changed} file(s) updated.")
