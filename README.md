# Pantone Converter

Dynamic Pantone color preview system with OG Image generation. Share any Pantone color on LINE, Slack, or Facebook and get a rich preview card.

## Features

- Browse 279 Pantone Coated (C) colors in a visual gallery
- Dynamic OG Image generation (1200x630 PNG) for social media previews
- Per-color detail pages with SEO metadata
- Edge Runtime for fast global image generation (< 500ms)
- Health check endpoint for monitoring

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

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
<meta property="og:image" content="https://your-domain.com/api/og?pantone=485C" />
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
https://your-domain.com/color/485C
https://your-domain.com/color/REFLEXBLUEC
https://your-domain.com/color/COOLGRAY5C
```

## Available Colors

279 Pantone Coated (C) colors including:

- **Reds**: 185C, 186C, 199C, 200C, 485C, Red C, ...
- **Oranges**: 021C, 144C, 151C, Orange C, ...
- **Yellows**: 012C, 109C, 116C, 123C, Yellow C, ...
- **Greens**: 347C, 355C, 361C, Green C, ...
- **Blues**: 072C, 286C, 300C, Process Blue C, Reflex Blue C, ...
- **Purples**: 2685C, Violet C, Purple C, ...
- **Pinks**: Rhodamine Red C, Rubine Red C, 218C, ...
- **Browns**: 4625C, 469C, 478C, ...
- **Neutrals**: Black C, Cool Gray 1-11 C, Warm Gray 1-11 C, ...

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** for styling
- **next/og** (Satori) for OG image generation — built into Next.js 16
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
│   ├── features/color/         # Pantone data + color utilities
│   └── app/                    # Pages + API routes
├── public/
├── vercel.json
├── package.json
└── vitest.config.ts
```

See [docs/index.md](docs/index.md) for full documentation.
