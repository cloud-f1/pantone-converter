# Pantone Converter — Project Context

@AGENTS.md

## What is this?

A dynamic OG Image generation system for a plastics injection factory. Converts Pantone color codes to visual preview cards that render correctly when shared on LINE, Slack, Facebook, etc.

**Production URL**: https://pantone-converter.vercel.app

See `docs/prd.md` for full product requirements, `docs/plan.md` for implementation plan.

## Repository Structure

Single Next.js app at root. Feature-based architecture.

```
pantone-converter/                # Git root = Next.js app
├── docs/                         # PRD, tech stack, plan
├── src/
│   ├── i18n/                     # Internationalization
│   │   ├── config.ts             # Locale list (en, zh-tw, zh-cn)
│   │   ├── get-locale.ts         # Cookie-based locale detection
│   │   ├── get-dictionary.ts     # Dynamic dictionary loader
│   │   └── dictionaries/         # en.json, zh-tw.json, zh-cn.json
│   ├── components/               # Shared UI components
│   │   ├── icons.tsx             # 8 SVG icon components
│   │   ├── color-tabs.tsx        # Color grid with tabs, search, sort
│   │   ├── copy-button.tsx       # Clipboard copy with toast
│   │   ├── locale-switcher.tsx   # Headless UI language dropdown
│   │   └── toast-provider.tsx    # react-hot-toast provider
│   ├── features/color/           # Pantone data + color utilities
│   │   ├── data/pantone-map.ts   # 1000+ Pantone C → HEX (with family)
│   │   └── lib/color-utils.ts    # Luminance, contrast, fallback
│   └── app/
│       ├── page.tsx              # Homepage: hero, use cases, color grid
│       ├── layout.tsx            # Root layout (metadataBase, fonts, toast)
│       ├── globals.css           # Tailwind globals
│       ├── color/[pantone]/      # Color detail + OG metadata + copy buttons
│       └── api/
│           ├── og/route.tsx      # OG image with logo (Edge Runtime)
│           └── health/route.ts   # Health check
├── public/
│   └── favicon.svg               # Gradient palette logo
├── vercel.json
├── vitest.config.ts
└── package.json
```

## Tech Stack

- **Next.js 16.2.1** (App Router) — read `node_modules/next/dist/docs/` before using any Next.js API; this version has breaking changes
- **React 19.2.4**
- **Tailwind CSS 4** via PostCSS
- **TypeScript 5** (strict)
- **`next/og`** (Satori) for OG image generation — built into Next.js 16, NOT `@vercel/og`
- **@headlessui/react** for accessible dropdown components
- **react-hot-toast** for copy notifications
- **Vitest** + **React Testing Library** for testing
- **pnpm** package manager
- **Vercel** deployment (Edge Functions)

## Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm test         # Run tests (watch mode)
pnpm test:run     # Run tests once
```

## Key Conventions

- **Language**: Code in English; UI supports en, zh-TW, zh-CN via cookie-based i18n
- **Styling**: Tailwind CSS utility classes only; no CSS modules
- **Data**: `src/features/color/data/pantone-map.ts` — 1000+ entries, each with `hex`, `name`, `family` fields
- **OG Images**: Generated via `next/og` in Edge Runtime at `/api/og?pantone=XXX`, includes gradient logo + bottom bar
- **Routing**: `/color/[pantone]` dynamic route for individual color pages
- **Fallback**: Unknown Pantone codes show a grey placeholder, never error
- **Architecture**: Feature-based (`src/features/color/`) for domain logic, `src/components/` for shared UI, `src/app/` for routes
- **i18n**: Dictionary JSON files in `src/i18n/dictionaries/`, loaded server-side via `getDictionary()`, locale from cookie via `getLocale()`
- **Tests**: Colocated `__tests__/` directories; homepage tests mock i18n modules
- **Icons**: Inline SVG components in `src/components/icons.tsx` (no icon library dependency)
- **Copy**: `CopyButton` client component + `react-hot-toast` for clipboard operations
- **Domain**: `pantone-converter.vercel.app` used in `metadataBase`, copy URLs, and code examples

## Important Notes

- This is Next.js **16**, not 14 or 15. Always check `node_modules/next/dist/docs/` before writing Next.js code.
- Dynamic params are **Promise-based**: `params: Promise<{ pantone: string }>` — must await.
- OG image route uses Edge Runtime (`export const runtime = 'edge'`).
- Text color on OG images auto-contrasts (black/white) via W3C luminance formula (WCAG AA).
- Use `import { ImageResponse } from 'next/og'` — NOT from `@vercel/og`.
- Homepage is an **async Server Component** (uses `getLocale()` + `getDictionary()`). Tests must mock these.
- `LocaleSwitcher` uses Headless UI `Menu` — sets `locale` cookie then calls `router.refresh()`.
- Color entries have a `family` field used for tab filtering (red, orange, yellow, green, blue, purple, pink, brown, teal, neutral).
