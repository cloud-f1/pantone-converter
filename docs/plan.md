# Pantone Converter — Implementation Plan

## Context

Fresh Next.js 16 project. Implement all PRD features with a feature-based folder structure. Start with ~200 common Pantone Coated colors; full set (~2000+) planned for next phase.

**Key**: `next/og` is built-in to Next.js 16 — no `@vercel/og` install needed.

---

## Step 1: Install Dependencies + Config

**Install** (testing only):
```bash
cd pantone-converter
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

**Create/modify**:
- `vitest.config.ts` — jsdom env, `@/` alias, setup file
- `src/test/setup.ts` — jest-dom matchers
- `package.json` — add `"test"` and `"test:run"` scripts
- `docs/techstack.md` — change `@vercel/og (待安裝)` → `next/og (Next.js 16 內建)`

---

## Step 2: Pantone Data + Color Utilities (Feature-based)

**Feature-based structure**:
```
src/features/color/
├── data/
│   └── pantone-map.ts        # Record<string, { hex, name }> ~200 entries
├── lib/
│   └── color-utils.ts        # hexToRgb, getRelativeLuminance, getContrastTextColor, FALLBACK_COLOR
```

- `pantone-map.ts`: Export `PANTONE_MAP` with ~200 common Pantone C colors + `getPantoneColor(code)` with input normalization (uppercase, strip spaces/hyphens)
- `color-utils.ts`: W3C luminance formula, threshold 0.179 for WCAG AA contrast

---

## Step 3: OG Image API Route (Edge Runtime)

```
src/app/api/og/route.tsx
```

- `export const runtime = 'edge'`
- `import { ImageResponse } from 'next/og'`
- GET: read `?pantone=`, lookup → color or fallback (grey + "Unknown Color")
- Return 1200×630 PNG with centered text (name + hex), auto black/white contrast

---

## Step 4: Color Detail Page

```
src/app/color/[pantone]/page.tsx
```

- `generateMetadata()`: dynamic title, description, `og:image` → `/api/og?pantone=XXX`
- Page: large swatch, Pantone name, HEX code, back link
- Next.js 16: `params: Promise<{ pantone: string }>` (must await)

---

## Step 5: Homepage Gallery + Use Cases

Replace `src/app/page.tsx` boilerplate:
- Responsive grid of clickable color cards (all ~200 colors)
- Each links to `/color/[key]`
- Update `src/app/layout.tsx` metadata

### Homepage Use Case Section (above color grid)

The homepage should include a **"How to Use" section** that shows:

1. **Use Case: Share on LINE / Social Media**
   - Copy a color URL like `https://your-domain.com/color/485C`
   - Paste into LINE chat → shows rich preview with color swatch
   - Visual: mockup of social card

2. **Use Case: API Direct Usage**
   - OG Image API: `GET /api/og?pantone=485C` → returns PNG
   - Embed in HTML: `<meta property="og:image" content=".../api/og?pantone=485C" />`
   - Use in `<img>` tags: `<img src="/api/og?pantone=485C" />`

3. **Use Case: Quick Color Reference**
   - Browse all colors below
   - Click any card → detail page with copy-friendly URL

### Layout of homepage:

```
┌─────────────────────────────────────────┐
│  Pantone Color Converter (header)       │
├─────────────────────────────────────────┤
│  How to Use                             │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ 1. Share  │ │ 2. API   │ │ 3. Ref  │ │
│  │ on LINE  │ │ Direct   │ │ Browse  │ │
│  └──────────┘ └──────────┘ └─────────┘ │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  Try it: /api/og?pantone=485C   │   │
│  │  [Live Preview Image]           │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  All Colors (279)                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐  │
│  │   │ │   │ │   │ │   │ │   │ │   │  │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘  │
│  ...                                    │
└─────────────────────────────────────────┘
```

### Implementation in `src/app/page.tsx`:

- Add a `UseCaseSection` above the color grid
- Three cards showing the use cases with icons/descriptions
- A live preview section showing an actual `<img>` tag that loads from `/api/og?pantone=485C`
- Code snippets users can copy (HTML meta tag, img tag, API URL)

---

## Step 6: Health Endpoint

```
src/app/api/health/route.ts
```

- GET → `{ status: 'ok', timestamp, version: '0.1.0' }`

---

## Step 7: Unit Tests

```
src/features/color/__tests__/pantone-map.test.ts    # dictionary + lookup
src/features/color/__tests__/color-utils.test.ts    # luminance, contrast
src/app/api/health/__tests__/route.test.ts          # health JSON
src/app/api/og/__tests__/route.test.ts              # color lookup logic
src/app/color/[pantone]/__tests__/page.test.tsx      # metadata generation
src/app/__tests__/page.test.tsx                      # homepage renders colors
```

---

## Step 8: Vercel Deployment Config

Next.js app is in `pantone-converter/` subdirectory (not repo root). Vercel needs explicit configuration.

### Option A: `vercel.json` at repo root (Recommended)

Create `vercel.json` at the **repo root** (`/`):

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "rootDirectory": "pantone-converter"
}
```

### Option B: Vercel Dashboard setting

In Vercel Project Settings → General → **Root Directory** → set to `pantone-converter`.

### Deployment checklist

- [ ] `vercel.json` at repo root with `rootDirectory`
- [ ] `.gitignore` includes `.next/`, `node_modules/`, `.vercel/`
- [ ] `pnpm build` passes locally before pushing
- [ ] Environment variables (if any) configured in Vercel dashboard
- [ ] Custom domain configured (optional)

### Edge Runtime

The `/api/og` route uses `export const runtime = 'edge'`. Vercel auto-detects this and deploys it to Edge Functions (global CDN nodes). No extra config needed.

---

## Step 9: Verify & Polish

- `pnpm build` — no errors
- `pnpm test:run` — all pass
- `pnpm lint` — clean
- Update `CLAUDE.md` with final structure

---

## Full Project File Tree

```
pantone-converter/                          # Git root = Next.js app
├── docs/
│   ├── index.md                            # Documentation index
│   ├── prd.md                              # Product requirements
│   ├── techstack.md                        # Tech architecture
│   └── plan.md                             # This implementation plan
├── src/
│   ├── features/
│   │   └── color/
│   │       ├── data/
│   │       │   └── pantone-map.ts          # 279 Pantone C → HEX
│   │       ├── lib/
│   │       │   └── color-utils.ts          # luminance + contrast utils
│   │       └── __tests__/
│   │           ├── pantone-map.test.ts
│   │           └── color-utils.test.ts
│   ├── app/
│   │   ├── page.tsx                        # Homepage gallery + use cases
│   │   ├── layout.tsx                      # Root layout
│   │   ├── globals.css
│   │   ├── __tests__/page.test.tsx
│   │   ├── color/[pantone]/
│   │   │   ├── page.tsx                    # Detail page + metadata + OG
│   │   │   └── __tests__/page.test.tsx
│   │   └── api/
│   │       ├── og/
│   │       │   ├── route.tsx               # OG image (Edge Runtime)
│   │       │   └── __tests__/route.test.ts
│   │       └── health/
│   │           ├── route.ts                # Health check
│   │           └── __tests__/route.test.ts
│   └── test/
│       └── setup.ts                        # Vitest setup
├── public/
├── CLAUDE.md
├── AGENTS.md                               # Next.js 16 agent rules
├── README.md
├── vercel.json
├── vitest.config.ts
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Verification

1. `pnpm dev` → localhost:3000 → color gallery (~200 cards)
2. Click color → `/color/485C` → detail page with swatch
3. `/api/og?pantone=485C` → 1200×630 red PNG
4. `/api/og?pantone=INVALID` → grey fallback PNG
5. `/api/health` → JSON `{ status: 'ok' }`
6. `pnpm test:run` → all green
7. `pnpm build` → success
8. `vercel deploy --prod` or push to `main` → live on Vercel

## Deploy Flow

```
git push origin main
       ↓
Vercel detects push → reads vercel.json
       ↓
pnpm install → pnpm build
       ↓
Static pages + Edge Functions deployed to global CDN
       ↓
/api/og → Edge Runtime (< 500ms worldwide)
/api/health → Serverless Function
/color/* → Server-rendered pages
/ → Server-rendered homepage
```

## Next Phase (future)

- Expand from ~200 to full Pantone C set (~2000+ colors)
- Add search/filter on homepage
- Dynamic database backend (Vercel Edge Config or Supabase)
- Custom domain + SSL
- Vercel Analytics integration
