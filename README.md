# Pantone Converter

Dynamic Pantone color preview system with OG Image generation. Share any Pantone color on LINE, Slack, or Facebook and get a rich preview card.

## Features

- 1030+ Pantone Coated (C) colors in a visual gallery
- Dynamic OG Image generation (1200x630 PNG) for social media previews
- Color filtering by family (Reds, Blues, Greens...) or series (1xx, 2xx, 3xx...)
- Search by name, code, or HEX value
- Sort by name, luminance, or code number
- Copy buttons for URL, HEX code, and OG image link
- Per-color detail pages with SEO metadata
- Edge Runtime for fast global image generation (< 500ms)
- i18n: English, 繁體中文, 简体中文
- Health check endpoint for monitoring

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## i18n (Internationalization)

The app supports 3 languages:

| Code | Language | Label |
|:-----|:---------|:------|
| `en` | English | English |
| `zh-tw` | Traditional Chinese | 繁體中文 |
| `zh-cn` | Simplified Chinese | 简体中文 |

**How it works:**
- Language switcher dropdown in the page header
- Preference stored in a `locale` cookie (persists across sessions)
- Server-side dictionary lookup — no client-side translation flicker
- All UI text (buttons, labels, descriptions) is translated
- Pantone color names stay in English (universal standard)
- OG images are locale-independent (English for maximum compatibility)

**Translation files:**
```
src/i18n/
├── config.ts                   # Locale list, names, default
├── get-dictionary.ts           # Dynamic import loader
├── get-locale.ts               # Cookie-based locale detection
└── dictionaries/
    ├── en.json                 # English
    ├── zh-tw.json              # 繁體中文
    └── zh-cn.json              # 简体中文
```

**Adding a new language:**
1. Add the locale code to `src/i18n/config.ts` (`locales` array + `localeNames`)
2. Create `src/i18n/dictionaries/{locale}.json` (copy from `en.json` and translate)
3. Add the import to `src/i18n/get-dictionary.ts`

## API Reference

### GET `/api/og`

Generates a 1200x630 PNG image for a Pantone color. Used as the `og:image` source for social media previews.

**Parameters:**

| Param | Type | Required | Description |
|:------|:-----|:---------|:------------|
| `pantone` | string | Yes | Pantone color code (e.g., `485C`, `BLACKC`, `COOLGRAY1C`) |

**Examples:**

```
GET /api/og?pantone=485C        → Red background, white text "Pantone 485 C"
GET /api/og?pantone=YELLOWC     → Yellow background, black text "Pantone Yellow C"
GET /api/og?pantone=INVALID     → Grey background, white text "Unknown Color"
```

**Response:**
- Content-Type: `image/png`
- Size: 1200 x 630 pixels
- Runtime: Edge (global CDN)

**Behavior:**
- Color code lookup is case-insensitive (`485c` = `485C`)
- Spaces and hyphens are stripped (`485 C` = `485-C` = `485C`)
- Unknown codes return a grey fallback image (never errors)
- Text color auto-switches black/white based on background luminance (WCAG AA)

**Usage in HTML:**

```html
<meta property="og:image" content="https://pantone-converter.vercel.app/api/og?pantone=485C" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

---

### GET `/api/health`

Health check endpoint for uptime monitoring.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-31T12:00:00.000Z",
  "version": "0.1.0"
}
```

---

### GET `/color/[pantone]`

Color detail page with full OG metadata. Share this URL on social media to trigger the OG image preview.

**Examples:**

```
https://pantone-converter.vercel.app/color/485C
https://pantone-converter.vercel.app/color/REFLEXBLUEC
https://pantone-converter.vercel.app/color/COOLGRAY5C
```

## Available Colors

1030+ Pantone Coated (C) colors across all families and series:

**By Color Family**:
- **Reds**: 185C, 186C, 199C, 200C, 485C, Red C, ...
- **Oranges**: 021C, 144C, 151C, Orange C, Bright Orange C, ...
- **Yellows**: 012C, 109C, 116C, 123C, Yellow C, Medium Yellow C, ...
- **Greens**: 347C, 355C, 361C, Green C, Bright Green C, ...
- **Teals**: 3242C, 3278C, 7466C, ...
- **Blues**: 072C, 286C, 300C, Process Blue C, Reflex Blue C, Dark Blue C, ...
- **Purples**: 2685C, Violet C, Purple C, Medium Purple C, ...
- **Pinks**: Rhodamine Red C, Rubine Red C, 218C, ...
- **Browns**: 4625C, 469C, 478C, ...
- **Neutrals**: Black C, Cool Gray 1-11 C, Warm Gray 1-11 C, ...

**By Series**: 0xx, 1xx, 2xx, 3xx, 4xx, 5xx, 6xx, 7xxx (specialty), 1xxx (extended), 2xxx (extended), Named

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** for styling
- **next/og** (Satori) for OG image generation — built into Next.js 16
- **react-hot-toast** for copy notifications
- **Vitest** + **React Testing Library** for testing
- **Vercel** Edge Functions for deployment

## Development

```bash
pnpm dev          # Dev server at localhost:3000
pnpm build        # Production build
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
pnpm lint         # ESLint check
```

## Deploy to Vercel

Push to `main` and Vercel auto-deploys. Or manually:

```bash
vercel deploy --prod
```

## Project Structure

```
pantone-converter/
├── docs/                       # PRD, tech stack, plan
├── src/
│   ├── i18n/                   # i18n config, dictionaries (en, zh-tw, zh-cn)
│   ├── components/             # Icons, color tabs, copy button, locale switcher
│   ├── features/color/         # Pantone data + color utilities
│   └── app/                    # Pages + API routes
├── public/
│   └── favicon.svg             # Gradient palette logo
├── vercel.json
├── package.json
└── vitest.config.ts
```

See [docs/index.md](docs/index.md) for full documentation.
