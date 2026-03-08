# Nick's Blog - AI異想封印 | CTO的爐邊雜談

## Project Overview
A modern blog website for Nick Zhuang with purple-to-cyan gradient aesthetic, glassmorphism effects, and bento-style layouts. Rebuilt from Nick's original Notion-based blog with all 73 articles scraped and rendered internally.

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js (minimal, serving static content)
- **Routing**: wouter (client-side)
- **Styling**: Dark-first theme with Plus Jakarta Sans + Inter (sans), Lora (serif), JetBrains Mono (mono)

## Key Files
- `client/src/lib/blogData.ts` - All 73 blog posts metadata, 6 categories, and about info
- `client/src/content/articles.json` - Full article content (markdown), ~1MB, keyed by article ID
- `client/src/pages/PostDetail.tsx` - Article detail page with custom markdown renderer (sanitized)
- `client/src/components/ThemeProvider.tsx` - Dark/light theme toggle with localStorage persistence
- `client/src/components/Header.tsx` - Navigation header with glassmorphism effect
- `client/src/components/Footer.tsx` - Minimal footer
- `client/src/components/BlogCard.tsx` - Blog post card components using internal Link (wouter)
- `client/src/pages/Home.tsx` - Homepage with hero, bento-style layout, featured post, stats
- `client/src/pages/Posts.tsx` - All posts with category filters and search (URL-driven)
- `client/src/pages/About.tsx` - About page with bio, skills, book info
- `client/src/pages/Contact.tsx` - Contact page with LinkedIn and email links
- `client/src/hooks/usePageTitle.ts` - SEO page title hook

## Design Tokens
- Primary color: Purple (262 hue) for AI/tech feel
- Gradient accents: Purple-to-cyan gradients
- Dark background: Deep navy (240 hue, 5% lightness)
- CSS utilities: `.gradient-text`, `.gradient-border`, `.glass`, `.hero-glow`, `.dot-grid`

## Pages
1. `/` - Home (hero + stats + featured post + recent posts + category tags)
2. `/posts` - All posts with search + category filter
3. `/posts/:id` - Individual article with full markdown content
4. `/about` - About Nick Zhuang
5. `/contact` - Contact info
6. `404` - Not found page

## Article Content
- 73 articles scraped from Notion, cleaned (stripped metadata/nav/Base64 images)
- Content stored in `client/src/content/articles.json` keyed by article ID
- Custom markdown renderer with HTML sanitization (escapeHtml before processing)
- Supports: headings (h1-h3), code blocks, images, lists (ul/ol), blockquotes, bold, italic, inline code, links, horizontal rules
- Fallback for missing content: shows "此文章內容尚未收錄" with link to original Notion page

## Categories
- AI (10 articles)
- 職涯/Career (2)
- 人生探索/Life (3)
- 深度學習/Deep Learning (1)
- Gen AI (31 articles, includes 2023 鐵人賽 series)
- K8S & Docker (30 articles, 2019 鐵人賽 series)

## Notes
- Blog cards use internal wouter Links (not external hrefs)
- No database needed - static blog content stored in blogData.ts and articles.json
- Dark theme is default, with light mode toggle
- All article pages include "原始來源" link to original Notion page
