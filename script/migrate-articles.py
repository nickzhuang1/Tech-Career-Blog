"""
migrate-articles.py

For each client/public/articles/*.md:
1. Create client/public/articles/<id>/images/
2. Download all Notion image URLs, save with sequential filenames
3. Replace URLs in MD content with ./images/<filename>
4. Write content to client/public/articles/<id>/index.md
5. Delete original .md file

Usage:
    python3 script/migrate-articles.py
"""

import os
import re
import urllib.request
import urllib.parse
import time
import sys

ARTICLES_DIR = os.path.join(os.path.dirname(__file__), '..', 'client', 'public', 'articles')
ARTICLES_DIR = os.path.abspath(ARTICLES_DIR)

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def guess_ext(content_type: str, url: str) -> str:
    ct = (content_type or '').lower()
    if 'jpeg' in ct or 'jpg' in ct:
        return '.jpg'
    if 'png' in ct:
        return '.png'
    if 'gif' in ct:
        return '.gif'
    if 'webp' in ct:
        return '.webp'
    if 'svg' in ct:
        return '.svg'
    # fallback: try to get from URL
    parsed = urllib.parse.urlparse(url)
    path = parsed.path.lower()
    for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']:
        if ext in path:
            return ext.replace('.jpeg', '.jpg')
    return '.jpg'

def download_image(url: str, dest_path: str) -> bool:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as res:
            if res.status != 200:
                return False
            data = res.read()
        with open(dest_path, 'wb') as f:
            f.write(data)
        return True
    except Exception as e:
        print(f'    ERROR downloading: {e}')
        return False

def migrate_file(md_path: str):
    article_id = os.path.basename(md_path)[:-3]  # strip .md
    article_dir = os.path.join(ARTICLES_DIR, article_id)
    images_dir = os.path.join(article_dir, 'images')

    print(f'\n[{article_id}]')

    content = open(md_path, encoding='utf-8').read()

    # Find all image URLs: ![alt](url)
    img_pattern = re.compile(r'(!\[[^\]]*\]\()([^)]+)(\))')
    urls = [m.group(2) for m in img_pattern.finditer(content)]
    notion_urls = [u for u in urls if 'notion.site' in u or 'notion.so' in u]

    if notion_urls:
        os.makedirs(images_dir, exist_ok=True)

    url_to_local = {}
    for i, url in enumerate(notion_urls, 1):
        # Download to determine extension
        tmp_path = os.path.join(images_dir, f'img_{i:03d}_tmp')
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                ct = res.headers.get('Content-Type', '')
                ext = guess_ext(ct, url)
                data = res.read()
            filename = f'img_{i:03d}{ext}'
            dest = os.path.join(images_dir, filename)
            with open(dest, 'wb') as f:
                f.write(data)
            url_to_local[url] = f'./images/{filename}'
            print(f'  [{i}/{len(notion_urls)}] {filename} ({len(data)//1024}KB)')
        except Exception as e:
            print(f'  [{i}/{len(notion_urls)}] FAILED: {e}')
            url_to_local[url] = url  # keep original on failure
        time.sleep(0.1)  # be polite

    # Replace URLs in content
    def replace_url(m):
        url = m.group(2)
        local = url_to_local.get(url, url)
        return m.group(1) + local + m.group(3)

    new_content = img_pattern.sub(replace_url, content)

    # Write index.md
    os.makedirs(article_dir, exist_ok=True)
    index_path = os.path.join(article_dir, 'index.md')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    # Remove original .md
    os.remove(md_path)
    print(f'  -> {article_id}/index.md  ({len(notion_urls)} images)')


def main():
    md_files = sorted([
        os.path.join(ARTICLES_DIR, f)
        for f in os.listdir(ARTICLES_DIR)
        if f.endswith('.md')
    ])

    if not md_files:
        print('No .md files found. Already migrated?')
        return

    print(f'Found {len(md_files)} .md files to migrate.')
    print('Press Enter to start, Ctrl-C to cancel...')
    input()

    failed = []
    for i, path in enumerate(md_files, 1):
        print(f'({i}/{len(md_files)})', end='')
        try:
            migrate_file(path)
        except Exception as e:
            print(f'  FATAL ERROR: {e}')
            failed.append(path)

    print('\n=== Done ===')
    if failed:
        print(f'Failed: {len(failed)} files:')
        for f in failed:
            print(f'  {f}')
    else:
        print('All files migrated successfully.')

if __name__ == '__main__':
    main()
