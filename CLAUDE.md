# Pantone Converter — Project Context

@AGENTS.md

## What is this?

A dynamic OG Image generation system for a plastics injection factory. Converts Pantone color codes to visual preview cards that render correctly when shared on LINE, Slack, Facebook, etc.

See `docs/prd.md` for full product requirements and tech architecture.

## Repository Structure

Single Next.js app at root.

```
pantone-converter/                # Git root = Next.js app
├── docs/                         # PRD, tech stack, plan
├── src/
│   ├── features/color/           # Pantone data + color utilities
│   │   ├── data/pantone-map.ts   # 279 Pantone C → HEX entries
│   │   └── lib/color-utils.ts    # Luminance + contrast utils
│   └── app/
│       ├── page.tsx              # Homepage gallery + use cases
│       ├── color/[pantone]/      # Color detail page + OG meta
│       └── api/
│           ├── og/route.tsx      # OG image (Edge Runtime)
│           └── health/route.ts   # Health check
├── public/
├── vercel.json
├── package.json
└── vitest.config.ts
```

## Tech Stack

- **Next.js 16.2.1** (App Router) — read `node_modules/next/dist/docs/` before using any Next.js API; this version has breaking changes from earlier versions
- **React 19.2.4**
- **Tailwind CSS 4** via PostCSS
- **TypeScript 5** (strict)
- **pnpm** workspace
- **`next/og`** (Satori) for OG image generation — built into Next.js 16, NOT `@vercel/og`
- **Vitest** + **React Testing Library** for testing
- **Vercel** deployment target (Edge Functions)

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

- **Language**: Code in English, user-facing text and documentation may be in Traditional Chinese (繁體中文)
- **Styling**: Tailwind CSS utility classes only; no CSS modules
- **Data**: Pantone-to-HEX mapping lives in `src/features/color/data/pantone-map.ts` as a TypeScript Record (279 entries)
- **OG Images**: Generated via `next/og` (built-in) in Edge Runtime at `/api/og?pantone=XXX`
- **Routing**: `/color/[pantone]` dynamic route for individual color pages
- **Fallback**: Unknown Pantone codes show a grey placeholder, never error
- **Architecture**: Feature-based (`src/features/color/`) for domain logic, `src/app/` for routes
- **Tests**: Colocated `__tests__/` directories next to source files

## Important Notes

- This is Next.js **16**, not 14 or 15. APIs and conventions differ. Always check the docs in `node_modules/next/dist/docs/` before writing Next.js code.
- Dynamic params are **Promise-based** in Next.js 16: `params: Promise<{ pantone: string }>` — must await.
- OG image route must use Edge Runtime (`export const runtime = 'edge'`).
- Text color on OG images must auto-contrast (black/white) based on background luminance (WCAG AA).
- Use `import { ImageResponse } from 'next/og'` — NOT from `@vercel/og`.
