# 技術架構文件 (Tech Stack)

**專案名稱**：動態色母 OG Image 生成系統 (Pantone Converter)
**文件版本**：v1.1
**建立日期**：2026-03-31
**最後更新**：2026-03-31

---

## 1. 技術選型

| 模組 | 技術 | 版本 | 說明 |
|:---|:---|:---|:---|
| **框架** | Next.js (App Router) | 16.2.1 | 全端框架，支援 Edge Runtime |
| **UI** | React | 19.2.4 | |
| **樣式** | Tailwind CSS | 4.x | PostCSS 整合 |
| **OG 圖片引擎** | `next/og` (Satori) | 內建於 Next.js 16 | JSX → PNG，Edge Runtime 原生支援，無需額外安裝 |
| **部署** | Vercel (Edge Functions) | — | Push to Deploy，邊緣節點 |
| **色碼資料** | TypeScript Record | — | 靜態字典，與程式碼一起打包 |
| **套件管理** | pnpm (workspace) | — | monorepo 結構 |
| **語言** | TypeScript | 5.x | 嚴格模式 |

## 2. 系統架構

```
[社群平台爬蟲] → GET /color/485C
                  ↓
          [Next.js Page] → <meta og:image="/api/og?pantone=485C">
                  ↓
[社群平台爬蟲] → GET /api/og?pantone=485C
                  ↓
          [Edge Function] → 查 pantone-map.ts → next/og 渲染 → PNG
```

## 3. 專案目錄結構

```
pantone-converter/                          # Git root = Next.js app
├── docs/                                   # 專案文件
├── src/
│   ├── features/color/
│   │   ├── data/pantone-map.ts             # 279 Pantone C → HEX 對應字典
│   │   └── lib/color-utils.ts              # 亮度計算 + 對比色工具
│   └── app/
│       ├── page.tsx                        # 首頁：色號瀏覽 + 使用說明
│       ├── layout.tsx                      # Root layout
│       ├── globals.css                     # Tailwind global styles
│       ├── color/[pantone]/page.tsx        # 色號分享頁面（含 og:image meta）
│       └── api/
│           ├── og/route.tsx                # OG Image 生成 API (Edge Runtime)
│           └── health/route.ts             # 健康檢查端點
├── public/
├── vercel.json
├── vitest.config.ts
├── package.json
└── tsconfig.json
```

## 4. 開發指令

```bash
pnpm dev          # 啟動開發伺服器
pnpm build        # 正式版建置
pnpm start        # 啟動正式版伺服器
pnpm lint         # ESLint 檢查
```

## 5. 部署流程

1. 推送至 GitHub `main` 分支。
2. Vercel 自動偵測並觸發建置（Push to Deploy）。
3. Edge Functions 部署至全球邊緣節點。
