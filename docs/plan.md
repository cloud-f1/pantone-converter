# Pantone Converter — Implementation Plan

## Context

Next.js 16 Pantone color preview system with OG Image generation. 279 Pantone Coated colors. Feature-based architecture at repo root.

**Key tech**: `next/og` (built-in), Edge Runtime, Tailwind CSS 4, Vitest.

---

## All Steps

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
| 9.1 | Clickable "How to Use" cards | Done |
| 10 | i18n (en, zh-TW, zh-CN) with locale switcher | Done |
| 11 | Favicon SVG from gradient logo | Done |
| 12 | Copy buttons + react-hot-toast | Done |
| 13 | Color category tabs (By Color + By Series) | Done |
| 14 | Hero header with CTA buttons | Done |
| 15 | Expanded to 1000+ Pantone C colors | Done |
| 16 | Search bar + sort dropdown | Done |

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

### Step 14: Dedicated Tool Page with Header

**Feature**: Create a standalone `/tools` page (or refactor `/` ) with a proper page header banner for the color tool.

**Implementation**:
- Hero section at the top with:
  - Gradient palette logo (large)
  - Tool name: "Pantone Color Converter"
  - Tagline: "Instantly preview and share Pantone colors with dynamic OG images"
  - CTA buttons: "Browse Colors" (→ #colors) + "Try API" (→ /api/og?pantone=485C)
- Breadcrumb or nav bar: Home → Tools → Pantone Converter
- The existing "How to Use" + color grid sections live below the hero

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  ┌──────┐                                           │
│  │ LOGO │  Pantone Color Converter                  │
│  └──────┘  Instantly preview and share...           │
│                                                     │
│  [ Browse Colors ]  [ Try API ]                     │
├─────────────────────────────────────────────────────┤
│  How to Use ...                                     │
│  Live Preview ...                                   │
│  Color Tabs + Grid ...                              │
└─────────────────────────────────────────────────────┘
```

---

### Step 15: Expand Pantone C Color Set

**Feature**: Comprehensive Pantone Coated color library.

**Implementation** (Done):
- Expanded from 279 → 1000+ Pantone C entries
- Covers all major series: 0xx, 1xx, 2xx, 3xx, 4xx, 5xx, 6xx, 7xxx, named colors
- All entries include `hex`, `name`, and `family` fields
- Series covered: 100s-600s (yellows/oranges/reds/pinks/purples/blues/greens), 1000s-2000s (extended gamut), 7400s-7726s (specialty), named (Warm Red, Bright Green, etc.)
- Color tabs and search handle the larger dataset without performance issues

---

### Step 16: Search, Sort & Filter (Advanced UX)

**Feature**: Add a search bar, sort options, and combined filters for the color grid.

**Implementation**:

1. **Search bar** (above tabs):
   - Fuzzy search by Pantone name, code, or HEX value
   - Debounced input (300ms)
   - Shows "No results" state with suggestions
   - Clear button (X icon)

2. **Sort options** (dropdown next to mode toggle):
   | Sort | Description |
   |:-----|:-----------|
   | Default | Original dictionary order |
   | Name A-Z | Alphabetical by Pantone name |
   | Name Z-A | Reverse alphabetical |
   | HEX Light→Dark | By luminance (light first) |
   | HEX Dark→Light | By luminance (dark first) |
   | Code Numeric | By numeric code ascending |

3. **Combined filters**: Search + tab filter work together
   - e.g., search "48" within "Reds" tab → shows matching reds

4. **URL state**: Persist filter/sort/search in query params for shareable filtered views
   - `/?tab=blue&sort=light&q=29` → Blues, sorted light-to-dark, matching "29"

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [🔍 Search colors...]          [Sort: Default ▾]   │
│                                                     │
│ [By Color] [By Series]    Showing 42 of 279 colors  │
│ [All] [Reds] [Blues] [Greens] ...                   │
│                                                     │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐               │
│ │   │ │   │ │   │ │   │ │   │ │   │               │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘               │
└─────────────────────────────────────────────────────┘
```

**Files**:
- `src/components/color-search.tsx` (Client Component) — search input
- `src/components/color-sort.tsx` (Client Component) — sort dropdown
- Update `src/components/color-tabs.tsx` — integrate search + sort + filter
- `src/features/color/lib/color-utils.ts` — add `getRelativeLuminance` to sort helpers (already exists)

---

### Step 17: Color Comparison with Delta E (CIEDE2000) ✅ Done

- `/compare` page with 2-3 color side-by-side comparison
- CIEDE2000 Delta E calculation
- Shareable URLs: `/compare?colors=485C,286C`
- OG image for compare: `/api/og/compare?colors=485C,286C`
- Example comparisons on empty state
- CTA on homepage + "Compare with..." on detail page

---

## User Feedback Features (Eva)

### Step 18: 色彩搭配建議 (Color Harmonies)

**來源**: Eva 回饋 —「如果是我，我可能會看一下色彩搭配」

**功能**: 在色號詳細頁 (`/color/[pantone]`) 下方新增「色彩搭配建議」區塊，根據色彩學原理自動推薦搭配色。

**色彩搭配類型**:

| 類型 | 英文 | 說明 | 計算方式 |
|:-----|:-----|:-----|:---------|
| 相近色 | Analogous | 色相環上相鄰 ±30° 的顏色 | HSL hue ±30° |
| 互補色 | Complementary | 色相環上對面 180° 的顏色 | HSL hue +180° |
| 三角色 | Triadic | 色相環上等距 120° 的三色 | HSL hue +120°, +240° |
| 分裂互補 | Split-Complementary | 互補色兩側各 30° | HSL hue +150°, +210° |
| 同色系漸層 | Monochromatic | 同色相，不同明度/飽和度 | HSL lightness ±15%, ±30% |

**實作方式**:

1. **色彩工具函式** (`src/features/color/lib/color-utils.ts`):
   - `hexToHsl(hex)` → `{ h, s, l }` 轉換
   - `hslToHex(h, s, l)` → `#XXXXXX` 轉換
   - `getAnalogousColors(hex)` → 相近色 hex 陣列
   - `getComplementaryColor(hex)` → 互補色 hex
   - `getTriadicColors(hex)` → 三角色 hex 陣列
   - `getSplitComplementaryColors(hex)` → 分裂互補色 hex 陣列
   - `getMonochromaticColors(hex)` → 同色系漸層 hex 陣列
   - `findClosestPantone(hex)` → 在 PANTONE_MAP 中找到 Delta E 最接近的 Pantone 色號

2. **色彩搭配元件** (`src/components/color-harmonies.tsx`, `"use client"`):
   - 接收 `hex` prop
   - 顯示 5 種搭配類型，每種用水平色票列呈現
   - 每個計算出的 hex 顯示最接近的 Pantone 色號（用 `findClosestPantone`）
   - 點擊任何色票可導航到該 Pantone 色號頁面

3. **整合到色號詳細頁** (`src/app/color/[pantone]/page.tsx`):
   - 在 info card 下方新增 `<ColorHarmonies hex={hex} />` 區塊

**UI 設計**:
```
┌─────────────────────────────────────────────────────┐
│  色彩搭配建議 (Color Harmonies)                      │
│                                                     │
│  相近色 (Analogous)                                  │
│  ┌────┐ ┌────┐ [主色] ┌────┐ ┌────┐                │
│  │-60°│ │-30°│ │ 0° │ │+30°│ │+60°│                │
│  └────┘ └────┘ └────┘ └────┘ └────┘                │
│                                                     │
│  互補色 (Complementary)                              │
│  ┌────────────┐       ┌────────────┐                │
│  │   主色      │       │  互補色     │                │
│  └────────────┘       └────────────┘                │
│                                                     │
│  三角色 (Triadic)                                    │
│  ┌────┐ ┌────┐ ┌────┐                              │
│  │ 0° │ │120°│ │240°│                              │
│  └────┘ └────┘ └────┘                              │
│                                                     │
│  同色系漸層 (Monochromatic)                           │
│  ┌──┐┌──┐┌──┐┌──┐[主]┌──┐┌──┐┌──┐┌──┐             │
│  │暗││  ││  ││  ││色││  ││  ││  ││亮│             │
│  └──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘└──┘             │
└─────────────────────────────────────────────────────┘
```

**i18n 翻譯新增**:
```json
"harmonies": {
  "title": "Color Harmonies",
  "analogous": "Analogous",
  "complementary": "Complementary",
  "triadic": "Triadic",
  "splitComplementary": "Split Complementary",
  "monochromatic": "Monochromatic",
  "closestPantone": "Closest Pantone"
}
```

---

### Step 19: 顏色屬性詳情 (Color Properties)

**來源**: Eva 回饋 —「單一點色票的時候會有顏色屬性」

**功能**: 在色號詳細頁 (`/color/[pantone]`) 擴充顏色屬性資訊，顯示完整的色彩編碼。

**新增屬性**:

| 屬性 | 格式 | 用途 | 計算方式 |
|:-----|:-----|:-----|:---------|
| HEX | #DA291C | 網頁 | 已有 |
| RGB | 218, 41, 28 | 螢幕 | `hexToRgb()` 已有 |
| CMYK | 0, 81, 87, 15 | 印刷 | 從 RGB 轉換 |
| HSL | 4°, 77%, 48% | 色彩學 | 從 RGB 轉換 |
| HSB/HSV | 4°, 87%, 85% | 設計軟體 | 從 RGB 轉換 |
| Lab | 45.4, 59.3, 47.1 | 色彩科學 | `hexToLab()` 已有 |
| Luminance | 0.078 | WCAG 無障礙 | `getRelativeLuminance()` 已有 |

**實作方式**:

1. **色彩工具函式** (`src/features/color/lib/color-utils.ts`):
   - `rgbToCmyk(r, g, b)` → `{ c, m, y, k }` 百分比
   - `rgbToHsl(r, g, b)` → `{ h, s, l }` (色相角度, 飽和度%, 亮度%)
   - `rgbToHsv(r, g, b)` → `{ h, s, v }` (色相, 飽和度%, 明度%)

2. **色號詳細頁增強** (`src/app/color/[pantone]/page.tsx`):
   - 現有 info card 擴充：除了 HEX、Share URL、OG Image 外
   - 新增「Color Properties」區塊，以表格呈現所有色彩編碼
   - 每個值旁邊都有 CopyButton 可一鍵複製

3. **UI 設計** — 放在現有 info card 的 HEX Code 行下方：
```
┌─────────────────────────────────────────┐
│  顏色屬性 (Color Properties)             │
│                                         │
│  HEX     #DA291C               [複製]   │
│  RGB     218, 41, 28           [複製]   │
│  CMYK    0%, 81%, 87%, 15%     [複製]   │
│  HSL     4°, 77%, 48%          [複製]   │
│  HSV     4°, 87%, 85%          [複製]   │
│  Lab     45.4, 59.3, 47.1      [複製]   │
│  亮度    0.078                          │
└─────────────────────────────────────────┘
```

4. **工廠材質屬性** (進階 — 可選):
   - 在 `PantoneEntry` 類型新增可選欄位:
     ```typescript
     export type PantoneEntry = {
       hex: string
       name: string
       family: ColorFamily
       materials?: string[]     // ['PP', 'PS', 'ABS', 'PC', 'PE']
       appearance?: 'solid' | 'transparent' | 'metallic' | 'fluorescent'
       notes?: string           // 工廠備註
     }
     ```
   - 初期先不填所有 1789 筆，只在工廠常用色（如 485C, 286C）手動標注
   - 顯示在 Color Properties 區塊下方：
     ```
     適用材質    PP, PS, ABS
     外觀       實色 (Solid)
     備註       常用於紅色警示標籤
     ```
   - 未標注的色號不顯示此區塊

**i18n 翻譯新增**:
```json
"properties": {
  "title": "Color Properties",
  "hex": "HEX",
  "rgb": "RGB",
  "cmyk": "CMYK",
  "hsl": "HSL",
  "hsv": "HSV",
  "lab": "Lab",
  "luminance": "Luminance",
  "screenUse": "Screen",
  "printUse": "Print",
  "webUse": "Web",
  "designUse": "Design",
  "scienceUse": "Science",
  "materials": "Materials",
  "appearance": "Appearance",
  "solid": "Solid",
  "transparent": "Transparent",
  "metallic": "Metallic",
  "fluorescent": "Fluorescent",
  "notes": "Notes"
}
```

---

## Color Adapter — 進階配色工具（使用者回饋）

### Step 20: 改善色彩搭配精準度

**問題**: 使用者回饋「下面那個顏色有點落差」— 計算出的和諧色與實際 Pantone 色號差距太大。

**改善方案**:
1. **改用 findClosestPantoneN(hex, 3)** — 顯示最接近的前 3 個 Pantone 色號供選擇
2. **加入主色作為錨點** — 每組和諧色都包含原始主色方便對照
3. **新增矩形搭配 (Tetradic/Rectangle)** — 色相環上 4 色等距 90°
4. **新增雙互補 (Double Complementary)** — 兩組互補色

**新增色彩搭配類型**:
| 類型 | 英文 | 計算方式 |
|:-----|:-----|:---------|
| 矩形搭配 | Tetradic | HSL hue +90°, +180°, +270° |
| 雙互補 | Double Complementary | 主色+互補 + 相鄰色+相鄰互補 |

---

### Step 21: 漸層色票產生器 (Gradient Palette Generator)

**參考**: mycolor.space — 輸入一個顏色，自動產生多種漸層色票。

**路由**: `/palette` 或 `/palette?color=485C`

**功能**:
- 輸入 Pantone 色號或 HEX 值
- 自動產生 6 種漸層色票：
  1. **Generic Gradient** — 從主色到互補色的平滑漸層
  2. **Warm Gradient** — 暖色系漸層（偏紅橘黃）
  3. **Cool Gradient** — 冷色系漸層（偏藍綠紫）
  4. **Pastel Gradient** — 粉彩柔和漸層
  5. **Earth Tones** — 大地色系漸層
  6. **Monochrome** — 單色深淺漸層
- 每個色票 5-7 色，各自對應最接近的 Pantone 色號
- 可複製整組色票（HEX 或 Pantone 代碼）

**UI 設計** (類似 mycolor.space):
```
┌─────────────────────────────────────────────────────┐
│  色票產生器 (Palette Generator)                       │
│                                                     │
│  [搜尋 Pantone...] 或 [輸入 HEX]    [產生 Generate]   │
│                                                     │
│  Generic Gradient                          [複製全部] │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐              │
│  │    ││    ││    ││    ││    ││    │              │
│  │#845│#D65│#FF6│#FF9│#FFC│#F9F│              │
│  └────┘└────┘└────┘└────┘└────┘└────┘              │
│                                                     │
│  Warm Gradient                             [複製全部] │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐              │
│  ...                                                │
└─────────────────────────────────────────────────────┘
```

**實作方式**:
- `src/app/palette/page.tsx` — Server Component shell
- `src/components/palette-generator.tsx` — Client Component
- `src/features/color/lib/gradient-utils.ts` — 漸層計算函式
  - `generateGenericGradient(hex, steps)` — HSL 插值
  - `generateWarmGradient(hex, steps)` — 偏暖色 hue shift
  - `generateCoolGradient(hex, steps)` — 偏冷色 hue shift
  - `generatePastelGradient(hex, steps)` — 高亮度低飽和度
  - `generateEarthTones(hex, steps)` — 低飽和度暖色
  - `generateMonochrome(hex, steps)` — 固定 hue，明度漸變

---

### Step 22: 精選色票瀏覽 (Curated Palettes — Color Hunt Style)

**參考**: colorhunt.co — 精選 4 色配色方案，按主題分類。

**路由**: `/palettes`

**功能**:
- 精選 50+ 組 4-5 色 Pantone 配色方案
- 按主題分類：Pastel, Vintage, Retro, Neon, Earth, Warm, Cold, Summer, Winter, Professional
- 每組色票顯示 4-5 個色塊（像 Color Hunt 的卡片）
- 點擊色票 → 查看該 Pantone 色號詳細頁
- 點擊整組 → 進入比較模式 `/compare?colors=...`
- 可複製整組色碼

**資料結構**:
```typescript
type CuratedPalette = {
  id: string
  name: string
  theme: 'pastel' | 'vintage' | 'retro' | 'neon' | 'earth' | 'warm' | 'cold' | 'summer' | 'winter' | 'professional'
  colors: string[] // Pantone codes: ['485C', '286C', '347C', 'YELLOWC']
}
```

**UI 設計** (Color Hunt 風格):
```
┌─────────────────────────────────────────────────────┐
│  精選配色方案 (Curated Palettes)                      │
│                                                     │
│  [All] [Pastel] [Vintage] [Warm] [Cold] [Earth] ... │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ ████████ │  │ ████████ │  │ ████████ │          │
│  │ ████████ │  │ ████████ │  │ ████████ │          │
│  │ ████████ │  │ ████████ │  │ ████████ │          │
│  │ ████████ │  │ ████████ │  │ ████████ │          │
│  │ [♡] [📋] │  │ [♡] [📋] │  │ [♡] [📋] │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

### Step 23: 色相環互動工具 (Color Wheel — Adobe Color Style)

**參考**: color.adobe.com — 互動式色相環，可拖曳調色點。

**路由**: `/wheel` 或嵌入 `/color/[pantone]` 頁面

**功能**:
- SVG 色相環（360° hue ring）
- 可拖曳的調色點（5 個點 = 1 主色 + 4 搭配色）
- 選擇搭配模式：Analogous / Complementary / Triadic / Split / Tetradic / Custom
- 切換模式時，調色點自動移動到正確角度
- 每個點顯示最接近的 Pantone 色號
- 底部色票列同步顯示選取的顏色

**注意**: 這是最複雜的功能，可能需要 canvas 或 SVG 互動。建議作為 v2 功能。

---

## Backlog (future)

- Dynamic database backend (Vercel Edge Config or Supabase)
- Custom domain + SSL
- Vercel Analytics integration
- Export to PDF / color spec sheet
- Color picker (input HEX → find closest Pantone)
- Dark mode toggle button
- Color blindness simulator
- Pantone TCX (textile) support
- 從圖片擷取色票 (Extract palette from image)
