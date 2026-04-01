# Pantone Converter

**English** | [繁體中文](./README.zh-TW.md) | [简体中文](./README.zh-CN.md)

Dynamic Pantone color preview system with OG Image generation. Share any Pantone color on LINE, Slack, or Facebook and get a rich preview card.

**Live**: https://pantone-converter.vercel.app

## Features

- 1789 Pantone Coated (C) colors in a visual gallery
- Dynamic OG Image generation (1200x630 PNG) for social media previews
- Filter by color family (Reds, Blues, Greens...) or series (1xx, 2xx, 3xx...)
- Search by name, code, or HEX value
- Sort by name, luminance, or code number
- Copy buttons for URL, HEX code, and OG image link
- Per-color detail pages with SEO metadata
- Edge Runtime for fast global image generation (< 500ms)
- i18n: English, 繁體中文, 简体中文
- Health check endpoint for monitoring
- Pantone data validation CLI

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+

### Install & Run

```bash
# 1. Clone
git clone https://github.com/cloud-f1/pantone-converter.git
cd pantone-converter

# 2. Install
pnpm install

# 3. Dev server
pnpm dev
```

Open http://localhost:3000

### Commands

| Command | Description |
|:--------|:------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |
| `pnpm test` | Run tests (watch mode) |
| `pnpm test:run` | Run tests once |
| `pnpm validate` | Validate all Pantone color data |
| `pnpm validate:check 485C 2377C` | Check if specific colors exist |

## How to Use

### 1. Share on Social Media (LINE / Slack / Facebook)

Copy a color page URL and paste into LINE chat. The platform auto-generates a rich preview card with the exact color.

```
https://pantone-converter.vercel.app/color/485C
```

### 2. Use the API Directly

Call the OG image API to get a 1200x630 PNG:

```
GET /api/og?pantone=485C        → Red background, white text "Pantone 485 C"
GET /api/og?pantone=YELLOWC     → Yellow background, black text "Pantone Yellow C"
GET /api/og?pantone=INVALID     → Grey background, white text "Unknown Color"
```

Embed in HTML:

```html
<meta property="og:image" content="https://pantone-converter.vercel.app/api/og?pantone=485C" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

Or use as an image:

```html
<img src="https://pantone-converter.vercel.app/api/og?pantone=485C" alt="Pantone 485 C" />
```

### 3. Color Lookup

- Browse all colors on the homepage
- Search by name, code, or HEX value
- Filter by color family or numeric series
- Click any card for the detail page with copyable URLs

### 4. Health Check

```
GET /api/health → { "status": "ok", "timestamp": "...", "version": "0.1.0" }
```

### 5. Validate Colors

```bash
# Full validation (duplicates, hex, names, families, range completeness)
pnpm validate

# Check specific colors
pnpm validate:check 485C 2377C 4109C COOLGRAY9C
```

## API Behavior

- Color code lookup is case-insensitive (`485c` = `485C`)
- Spaces and hyphens are stripped (`485 C` = `485-C` = `485C`)
- Unknown codes return a grey fallback image (never errors)
- Text color auto-switches black/white based on background luminance (WCAG AA)

## i18n

Language switcher in the top-right corner of the page:

| Code | Language |
|:-----|:---------|
| `en` | English |
| `zh-tw` | 繁體中文 |
| `zh-cn` | 简体中文 |

Preference is stored in a cookie and persists across sessions.

**Adding a new language:**
1. Add locale to `src/i18n/config.ts`
2. Create `src/i18n/dictionaries/{locale}.json`
3. Add import to `src/i18n/get-dictionary.ts`

## Color Coverage

1789 Pantone Coated (C) colors:

| Series | Count | Notes |
|:-------|:------|:------|
| 100-699 | 600 | Standard range (COMPLETE) |
| 0xx | 3 | 012C, 021C, 072C |
| 7xx-8xx | 17 | Including neons |
| 1xxx | 131 | Extended gamut |
| 2xxx | 364 | Extended gamut |
| 3xxx | 95 | Extended gamut |
| 4xxx-5xxx | 10 | Extended gamut |
| 7xxx | 518 | Specialty (7100-7771) |
| Named | 51 | Black C, Reflex Blue C, etc. |

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** for styling
- **next/og** (Satori) for OG image generation — built into Next.js 16
- **@headlessui/react** for accessible dropdowns
- **react-hot-toast** for copy notifications
- **Vitest** + **React Testing Library** for testing
- **Vercel** Edge Functions for deployment

## Project Structure

```
pantone-converter/
├── docs/                       # PRD, tech stack, plan
├── scripts/
│   └── validate-pantone.ts     # Pantone data validation CLI
├── src/
│   ├── i18n/                   # i18n config, dictionaries (en, zh-tw, zh-cn)
│   ├── components/             # Icons, color tabs, copy button, locale switcher
│   ├── features/color/         # Pantone data (1789 colors) + color utilities
│   └── app/                    # Pages + API routes
├── public/
│   └── favicon.svg             # Gradient palette logo
├── vercel.json
└── package.json
```

## Deploy

Push to `main` and Vercel auto-deploys. Or manually:

```bash
vercel deploy --prod
```

## License

MIT

---

See [docs/index.md](docs/index.md) for full documentation.
