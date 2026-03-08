# Nick's Blog - AI異想封印 | CTO的爐邊雜談

## Project Overview
A modern, minimalist blog website with AI/tech aesthetic, rebuilt from Nick Zhuang's original Notion-based blog. Features a dark theme by default with cyan/blue gradient accents and a futuristic tech feel.

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js (minimal, serving static content)
- **Routing**: wouter (client-side)
- **Styling**: Dark-first theme with Space Grotesk + JetBrains Mono fonts

## Key Files
- `client/src/lib/blogData.ts` - All blog post data, categories, and about info
- `client/src/components/ThemeProvider.tsx` - Dark/light theme toggle with localStorage persistence
- `client/src/components/Header.tsx` - Navigation header with responsive mobile menu
- `client/src/components/Footer.tsx` - Site footer
- `client/src/components/BlogCard.tsx` - Blog post card components (regular + featured)
- `client/src/pages/Home.tsx` - Homepage with hero, featured post, post grid, categories
- `client/src/pages/Categories.tsx` - Category filter page
- `client/src/pages/About.tsx` - About page with bio, skills, book info
- `client/src/pages/Contact.tsx` - Contact page with LinkedIn and email links
- `client/src/pages/not-found.tsx` - 404 page

## Design Tokens
- Primary color: Cyan (195 hue) for tech/AI feel
- Dark background: Deep navy (222 hue, 6% lightness)
- Fonts: Space Grotesk (sans), Lora (serif), JetBrains Mono (mono)
- Custom CSS utilities: `.glow-line`, `.grid-pattern`, `.text-gradient`

## Pages
1. `/` - Home (hero + featured post + all posts grid + category tags)
2. `/categories` - Filterable category view
3. `/about` - About Nick Zhuang
4. `/contact` - Contact info
5. `404` - Not found page

## Notes
- Blog posts link externally to Nick's Notion pages
- No database needed - static blog content stored in blogData.ts
- Dark theme is default, with light mode toggle available
