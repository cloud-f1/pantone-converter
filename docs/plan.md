# Pantone Converter — Implementation Plan

## Context

Next.js 16 Pantone color preview system with OG Image generation. 279 Pantone Coated colors. Feature-based architecture at repo root.

**Key tech**: `next/og` (built-in), Edge Runtime, Tailwind CSS 4, Vitest.

---

## Completed Steps (v1.0)

| Step | Description | Status |
|:-----|:-----------|:-------|
| 1 | Install deps (Vitest, Testing Library) + config | Done |
| 2 | Pantone data (279 colors) + color utilities | Done |
| 3 | OG Image API route (`/api/og`, Edge Runtime) | Done |
| 4 | Color detail page (`/color/[pantone]`) | Done |
| 5 | Homepage gallery + use case section | Done |
| 6 | Health endpoint (`/api/health`) | Done |
| 7 | Unit tests (6 files, 33 tests) | Done |
| 8 | Vercel deployment config (`vercel.json`) | Done |
| 9 | UI redesign: icons, gradient header, split detail layout | Done |

---

## Current File Tree

```
pantone-converter/                          # Git root = Next.js app
├── docs/
│   ├── index.md
│   ├── prd.md
│   ├── techstack.md
│   └── plan.md                             # This file
├── src/
│   ├── components/
│   │   └── icons.tsx                       # 8 SVG icon components
│   ├── features/
│   │   └── color/
│   │       ├── data/pantone-map.ts         # 279 Pantone C → HEX
│   │       ├── lib/color-utils.ts          # Luminance + contrast utils
│   │       └── __tests__/
│   ├── app/
│   │   ├── page.tsx                        # Homepage gallery + use cases
│   │   ├── layout.tsx                      # Root layout (title template, metadataBase)
│   │   ├── globals.css
│   │   ├── favicon.ico
│   │   ├── __tests__/page.test.tsx
│   │   ├── color/[pantone]/
│   │   │   ├── page.tsx                    # Split detail page + OG metadata
│   │   │   └── __tests__/page.test.tsx
│   │   └── api/
│   │       ├── og/route.tsx                # OG image (Edge Runtime)
│   │       └── health/route.ts             # Health check
│   └── test/setup.ts
├── public/                                 # (empty — stale SVGs removed)
├── CLAUDE.md
├── AGENTS.md
├── README.md
├── vercel.json                             # No rootDirectory (app is at root)
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

---

## Verification (current)

```
pnpm test:run   → 33/33 passed
pnpm lint       → 0 errors, 0 warnings
pnpm build      → success
```

---

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
/api/og     → Edge Runtime (< 500ms worldwide)
/api/health → Serverless Function
/color/*    → Server-rendered pages
/           → Static homepage
```

---

## Next Phase: Feature Enhancements

### Step 9.1: Make "How to Use" Cards Clickable Links

**Feature**: Each of the 3 "How to Use" cards on the homepage should be a clickable link that redirects to a relevant destination.

| Card | Link | Behavior |
|:-----|:-----|:---------|
| Share on Social | `/color/485C` | Opens an example color detail page |
| API Integration | `/api/og?pantone=485C` | Opens the live OG image in a new tab |
| Color Reference | `#colors` | Scrolls down to the color grid section |

**Implementation**:
- Wrap each card `<div>` with a `<Link>` or `<a>` tag
- "API Integration" card uses `target="_blank"` (opens PNG in new tab)
- "Color Reference" card uses an anchor link `#colors` to scroll to the grid
- Add `id="colors"` to the color grid `<section>` element
- Add `cursor-pointer` and subtle hover lift to cards

### Step 10: i18n — Internationalization Support

**Languages**: English (en), 繁體中文 (zh-TW), 簡體中文 (zh-CN)

**Approach**: Next.js 16 App Router i18n via URL prefix routing (`/en/`, `/zh-tw/`, `/zh-cn/`)

**Implementation**:

1. **Routing structure**:
   ```
   src/app/[locale]/
   ├── page.tsx                    # Homepage (localized)
   ├── layout.tsx                  # Locale layout (sets lang, loads translations)
   └── color/[pantone]/page.tsx    # Color detail (localized)
   ```
   API routes (`/api/og`, `/api/health`) stay locale-independent.

2. **Translation files**:
   ```
   src/i18n/
   ├── config.ts                   # Locale list, default locale
   ├── dictionaries.ts             # Dynamic import loader
   └── dictionaries/
       ├── en.json
       ├── zh-tw.json
       └── zh-cn.json
   ```

3. **Translation scope**:
   | Key | en | zh-TW | zh-CN |
   |:----|:---|:------|:------|
   | `site.title` | Pantone Color Converter | Pantone 色號轉換器 | Pantone 色号转换器 |
   | `home.howToUse` | How to Use | 如何使用 | 如何使用 |
   | `home.shareOnSocial` | Share on Social | 分享到社群 | 分享到社交平台 |
   | `home.apiIntegration` | API Integration | API 整合 | API 集成 |
   | `home.colorReference` | Color Reference | 色號參考 | 色号参考 |
   | `home.allColors` | All Colors | 所有色號 | 所有色号 |
   | `color.backToAll` | ← All Colors | ← 所有色號 | ← 所有色号 |
   | `color.shareUrl` | Share URL | 分享網址 | 分享网址 |
   | `color.ogImage` | OG Image | OG 圖片 | OG 图片 |
   | `color.hexCode` | HEX Code | HEX 色碼 | HEX 色码 |
   | `color.unknown` | Unknown Color | 未知色號 | 未知色号 |
   | `copy.link` | Copy Link | 複製連結 | 复制链接 |
   | `copy.hex` | Copy HEX | 複製色碼 | 复制色码 |
   | `copy.success` | Copied! | 已複製！ | 已复制！ |

4. **Locale switcher**: Dropdown in header, persists via cookie or URL
5. **Default locale**: `en` (no prefix), redirects `/` → `/en/`
6. **SEO**: `<link rel="alternate" hreflang="...">` tags per locale
7. **OG images**: Locale-independent (color name stays in English for universal readability)

**Files to create/modify**:
- `src/i18n/config.ts` — locale list + default
- `src/i18n/dictionaries.ts` — dynamic dictionary loader
- `src/i18n/dictionaries/{en,zh-tw,zh-cn}.json` — translation strings
- `src/app/[locale]/layout.tsx` — locale-aware root layout
- `src/app/[locale]/page.tsx` — localized homepage
- `src/app/[locale]/color/[pantone]/page.tsx` — localized detail page
- `src/components/locale-switcher.tsx` — language dropdown (Client Component)
- `middleware.ts` — detect locale from Accept-Language header, redirect

---

### Step 11: Favicon & App Icon from Logo

**Feature**: Use the gradient palette logo as favicon and app icon.

**Logo**: Rounded square with `bg-gradient-to-br from-rose-500 via-violet-500 to-cyan-500`, white palette SVG icon centered inside (matches the homepage header logo).

**Implementation**:
- `public/favicon.svg` — SVG favicon with gradient + palette path
- `public/favicon.ico` — 32x32 ICO fallback
- `public/apple-touch-icon.png` — 180x180
- `public/icon-192.png` — 192x192 (PWA)
- `public/icon-512.png` — 512x512 (PWA)
- Remove old `src/app/favicon.ico`
- Update `src/app/layout.tsx` metadata with icon references

**SVG favicon** (`public/favicon.svg`):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="url(#g)"/>
  <path d="M24 10c-5.5 0-10 4.5-10 10s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C33.965 14.012 29.461 10 24 10z"
        fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="20.5" cy="15.5" r="1" fill="white"/>
  <circle cx="25.5" cy="14.5" r="1" fill="white"/>
  <circle cx="29.5" cy="18.5" r="1" fill="white"/>
  <circle cx="18.5" cy="20.5" r="1" fill="white"/>
</svg>
```

---

### Step 12: Copy Link Button with react-hot-toast

**Feature**: Add "Copy Link" and "Copy HEX" buttons on `/color/[pantone]` with toast notifications.

**Dependencies**:
```bash
pnpm add react-hot-toast
```

**Implementation**:

1. **Toast provider**: `src/components/toast-provider.tsx` (`"use client"`)
   - Renders `<Toaster position="bottom-center" />` with dark styling
   - Added to `src/app/layout.tsx` body

2. **Copy button**: `src/components/copy-button.tsx` (`"use client"`)
   - Props: `{ text: string; label: string; icon: ReactNode }`
   - On click: `navigator.clipboard.writeText(text)` → `toast.success('Copied!')`

3. **Usage on color detail page** (`/color/[pantone]`):
   - "Copy Link" button (LinkIcon) — copies page URL
   - "Copy HEX" button (CopyIcon) — copies HEX code
   - "Copy OG URL" button (CodeIcon) — copies OG API URL
   - Buttons placed inline next to each info row

4. **Also on homepage**: Copy buttons for code snippets in Live Preview section

**Toast config**:
```tsx
<Toaster
  position="bottom-center"
  toastOptions={{
    duration: 2000,
    style: {
      background: '#18181b',
      color: '#fafafa',
      borderRadius: '12px',
      fontSize: '14px',
    },
  }}
/>
```

---

### Step 13: Color Category Tabs on Homepage

**Feature**: Add tabs above the color grid to filter by color family.

**Categories**:
| Tab | Filter | Count |
|:----|:-------|:------|
| All | No filter | 279 |
| Reds | Red, Rose, Rubine, Warm Red | ~30 |
| Oranges | Orange, 021C, 144C, etc. | ~20 |
| Yellows | Yellow, 012C, etc. | ~17 |
| Greens | Green, 347C, etc. | ~32 |
| Blues | Blue, Process Blue, Reflex Blue | ~51 |
| Purples | Purple, Violet, 2685C, etc. | ~22 |
| Neutrals | Black, Gray, Cool Gray, Warm Gray | ~40+ |

**Implementation**:
- Add `family` field to `PantoneEntry`: `'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'neutral' | 'brown' | 'pink'`
- Update all 279 entries in `pantone-map.ts` with `family`
- Create `src/components/color-tabs.tsx` (Client Component — `"use client"`)
- Horizontal scrollable tab bar with pill-style active state
- URL state via query param `?tab=blue` (optional)
- Animate grid changes with CSS transitions

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [All] [Reds] [Oranges] [Yellows] [Greens] [Blues] ▸ │  ← scrollable tabs
├─────────────────────────────────────────────────────┤
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐               │
│ │   │ │   │ │   │ │   │ │   │ │   │  ← filtered    │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘    color grid  │
└─────────────────────────────────────────────────────┘
```

---

## Backlog (future)

- Expand from 279 to full Pantone C set (~2000+ colors)
- Search/filter with fuzzy matching
- Dynamic database backend (Vercel Edge Config or Supabase)
- Custom domain + SSL
- Vercel Analytics integration
- Color comparison tool (side-by-side swatches)
- Export to PDF / color spec sheet
