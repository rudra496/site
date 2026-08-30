#!/usr/bin/env python3
"""
sync_blogs.py - Automated Blog Synchronization Engine for rudra496.github.io/site
Author: Rudra Sarker
Maintained by: Rudra Junior

This script ensures that whenever a new blog article is created in site/blog/:
1. All blog HTML files are inventoried and counted accurately.
2. blog/blog-manifest.json is generated/updated with full metadata and count.
3. FULL_SEARCH_INDEX in blog.html and blog/index.html is synchronized.
4. All article counters across index.html (stat cards, hero CTAs, section links) are updated.
5. All navigation dropdown descriptions across all 40+ site pages are updated.
6. sitemap.xml is updated to include any new blog articles automatically.
"""

import os
import re
import json
import glob
from datetime import datetime, timezone

SITE_ROOT = os.path.dirname(os.path.abspath(__file__))
BLOG_DIR = os.path.join(SITE_ROOT, "blog")
INDEX_FILE = os.path.join(SITE_ROOT, "index.html")
BLOG_HTML = os.path.join(SITE_ROOT, "blog.html")
BLOG_INDEX_HTML = os.path.join(BLOG_DIR, "index.html")
SITEMAP_FILE = os.path.join(SITE_ROOT, "sitemap.xml")
MANIFEST_FILE = os.path.join(BLOG_DIR, "blog-manifest.json")

def get_all_blog_files():
    files = glob.glob(os.path.join(BLOG_DIR, "*.html"))
    return [os.path.basename(f) for f in files if os.path.basename(f) != "index.html"]

def parse_blog_metadata(blog_filename):
    filepath = os.path.join(BLOG_DIR, blog_filename)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    # Title extraction
    title_match = re.search(r"<title>(.*?)(?:\| Rudra Sarker)?</title>", html, re.I)
    title = title_match.group(1).strip() if title_match else blog_filename.replace(".html", "").replace("-", " ").title()

    # Description / Excerpt
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I)
    excerpt = desc_match.group(1).strip() if desc_match else ""

    # Badge / Category
    badge = "Research Article"
    if "Q1" in html or "Journal" in html:
        badge = "Peer-Reviewed · Publication"
    elif "Zenodo" in html or "DOI" in html:
        badge = "CERN Zenodo · Open Science"
    elif "Hardware" in html or "Robot" in html or "Sensor" in html:
        badge = "Hardware · Robotics"

    # Date
    time_match = re.search(r'<time\s+datetime=["\'](.*?)["\']>(.*?)</time>', html, re.I)
    if time_match:
        date_iso = time_match.group(1).strip()
        date_str = time_match.group(2).strip()
    else:
        date_iso = datetime.today().strftime("%Y-%m-%d")
        date_str = datetime.today().strftime("%b %d, %Y")

    slug = blog_filename.replace(".html", "")
    return {
        "id": slug[:30],
        "title": title,
        "file": blog_filename,
        "cat": "tools",
        "badge": badge,
        "date": date_str,
        "date_iso": date_iso,
        "read": 7,
        "excerpt": excerpt,
        "tags": [word.capitalize() for word in slug.split("-") if len(word) > 3][:8],
        "index": f"{title} {excerpt} {slug}".lower()
    }

def sync_search_index(blog_files):
    with open(BLOG_HTML, "r", encoding="utf-8") as f:
        blog_content = f.read()

    m = re.search(r"const FULL_SEARCH_INDEX = (\[.*?\]);", blog_content, re.DOTALL)
    existing_items = []
    indexed_files = set()
    if m:
        try:
            existing_items = json.loads(m.group(1))
            indexed_files = {item["file"] for item in existing_items}
        except Exception as e:
            print(f"[!] Warning: Could not parse existing FULL_SEARCH_INDEX: {e}")

    updated_items = list(existing_items)
    new_found = 0
    for bf in blog_files:
        if bf not in indexed_files:
            meta = parse_blog_metadata(bf)
            updated_items.append(meta)
            indexed_files.add(bf)
            new_found += 1
            print(f"[+] Added new blog to search index: {bf}")

    current_blog_set = set(blog_files)
    final_items = [item for item in updated_items if item.get("file") in current_blog_set]

    json_str = json.dumps(final_items, ensure_ascii=False)
    replacement = f"const FULL_SEARCH_INDEX = {json_str};"

    # Update in blog.html
    new_blog_content = re.sub(
        r"const FULL_SEARCH_INDEX = \[.*?\];",
        lambda _: replacement,
        blog_content,
        flags=re.DOTALL
    )

    count = len(final_items)
    new_blog_content = re.sub(r"\d+ published articles", f"{count} published articles", new_blog_content)
    new_blog_content = re.sub(r'<span id="search-stats-badge"[^>]*>.*?</span>', f'<span id="search-stats-badge" class="grand-search-stats">{count} of {count} Articles</span>', new_blog_content)
    new_blog_content = re.sub(r'<span id="visible-count">\d+</span>', f'<span id="visible-count">{count}</span>', new_blog_content)

    with open(BLOG_HTML, "w", encoding="utf-8") as f:
        f.write(new_blog_content)

    # Update in blog/index.html
    if os.path.exists(BLOG_INDEX_HTML):
        with open(BLOG_INDEX_HTML, "r", encoding="utf-8") as f:
            blog_idx_content = f.read()

        new_blog_idx_content = re.sub(
            r"const FULL_SEARCH_INDEX = \[.*?\];",
            lambda _: replacement,
            blog_idx_content,
            flags=re.DOTALL
        )
        new_blog_idx_content = re.sub(r"\d+ published articles", f"{count} published articles", new_blog_idx_content)
        new_blog_idx_content = re.sub(r'<span id="search-stats-badge"[^>]*>.*?</span>', f'<span id="search-stats-badge" class="grand-search-stats">{count} of {count} Articles</span>', new_blog_idx_content)
        new_blog_idx_content = re.sub(r'<span id="visible-count">\d+</span>', f'<span id="visible-count">{count}</span>', new_blog_idx_content)

        with open(BLOG_INDEX_HTML, "w", encoding="utf-8") as f:
            f.write(new_blog_idx_content)

    return count, final_items

def update_manifest(count, items):
    manifest = {
        "count": count,
        "lastSync": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "articles": [
            {
                "id": item.get("id"),
                "title": item.get("title"),
                "file": item.get("file"),
                "date": item.get("date"),
                "cat": item.get("cat"),
                "badge": item.get("badge")
            }
            for item in items
        ]
    }
    with open(MANIFEST_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"[✓] Generated manifest at: {MANIFEST_FILE}")

def update_index_html(count):
    if not os.path.exists(INDEX_FILE):
        return

    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update Stat Card: <div class="stat-num">...</div> followed by Articles Published
    content = re.sub(
        r'(<div class="stat-card">\s*<div class="stat-num"[^>]*>)\d+(</div>\s*<div class="stat-label">Articles Published</div>)',
        rf'\g<1>{count}\g<2>',
        content
    )

    # 2. Update Hero Button: Blog Hub (32 Articles) &rarr;
    content = re.sub(
        r'Blog Hub \(\d+ Articles\)',
        f'Blog Hub ({count} Articles)',
        content
    )

    # 3. Update Section 6 link: View All 32 Articles &rarr;
    content = re.sub(
        r'View All \d+ Articles',
        f'View All {count} Articles',
        content
    )

    # 4. Update dropdown desc in index.html
    content = re.sub(
        r'<span class="dropdown-desc">\d+ Inverted-Search Articles</span>',
        f'<span class="dropdown-desc">{count} Inverted-Search Articles</span>',
        content
    )

    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[✓] Updated index.html with blog count = {count}")

def update_all_navigation_dropdowns(count):
    pattern = re.compile(r'<span class="dropdown-desc">\d+ Inverted-Search Articles</span>')
    replacement = f'<span class="dropdown-desc">{count} Inverted-Search Articles</span>'

    updated_count = 0
    for root, _, files in os.walk(SITE_ROOT):
        if ".git" in root:
            continue
        for filename in files:
            if filename.endswith(".html"):
                filepath = os.path.join(root, filename)
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()

                if pattern.search(file_content):
                    new_file_content = pattern.sub(replacement, file_content)
                    if new_file_content != file_content:
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(new_file_content)
                        updated_count += 1

    print(f"[✓] Updated dropdown descriptions across {updated_count} HTML files to '{count} Inverted-Search Articles'.")

def update_sitemap(blog_files):
    if not os.path.exists(SITEMAP_FILE):
        return

    with open(SITEMAP_FILE, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    today_str = datetime.today().strftime("%Y-%m-%d")
    added = 0

    for bf in blog_files:
        loc_str = f"https://rudra496.github.io/site/blog/{bf}"
        if loc_str not in sitemap_content:
            new_url_entry = f"""  <url>
    <loc>{loc_str}</loc>
    <lastmod>{today_str}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>"""
            sitemap_content = sitemap_content.replace("</urlset>", new_url_entry)
            added += 1
            print(f"[+] Added sitemap URL entry for: {bf}")

    if added > 0:
        with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
            f.write(sitemap_content)
        print(f"[✓] Updated sitemap.xml with {added} new blog entries.")
    else:
        print("[✓] Sitemap is already up-to-date with all blog URLs.")

def main():
    print("=" * 60)
    print("🚀 Rudra Portfolio Blog Auto-Sync Engine Starting...")
    print("=" * 60)

    blog_files = get_all_blog_files()
    total_blogs = len(blog_files)
    print(f"[*] Found {total_blogs} published blog files in blog/ directory.")

    count, items = sync_search_index(blog_files)
    update_manifest(count, items)
    update_index_html(count)
    update_all_navigation_dropdowns(count)
    update_sitemap(blog_files)

    print("=" * 60)
    print(f"✨ Blog synchronization completed successfully! Total blogs: {count}")
    print("=" * 60)

if __name__ == "__main__":
    main()
