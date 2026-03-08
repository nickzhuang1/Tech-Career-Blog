# Nick's Blog - AI異想封印 | CTO的爐邊雜談

## Project Overview
A modern blog website for Nick Zhuang with purple-to-cyan gradient aesthetic, glassmorphism effects, and bento-style layouts. Rebuilt from Nick's original Notion-based blog with all articles included.

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js (minimal, serving static content)
- **Routing**: wouter (client-side)
- **Styling**: Dark-first theme with Plus Jakarta Sans + Inter (sans), Lora (serif), JetBrains Mono (mono)

## Key Files
- `client/src/lib/blogData.ts` - All blog post data (35+ articles), categories (10), and about info
- `client/src/components/ThemeProvider.tsx` - Dark/light theme toggle with localStorage persistence
- `client/src/components/Header.tsx` - Navigation header with glassmorphism effect
- `client/src/components/Footer.tsx` - Minimal footer
- `client/src/components/BlogCard.tsx` - Blog post card components (regular + featured hero)
- `client/src/pages/Home.tsx` - Homepage with hero, bento-style layout, featured post, stats
- `client/src/pages/Posts.tsx` - All posts with category filters and search
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
3. `/about` - About Nick Zhuang
4. `/contact` - Contact info
5. `404` - Not found page

## Notes
- Blog posts link externally to Nick's Notion pages
- No database needed - static blog content stored in blogData.ts
- Dark theme is default, with light mode toggle
- Categories: AI, 職涯, 人生探索, 深度學習, Gen AI, 規劃, 書籍, 2023鐵人賽, 2019鐵人賽, K8S&Docker
