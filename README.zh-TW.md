# Pantone 色號轉換器

[English](./README.md) | **繁體中文** | [简体中文](./README.zh-CN.md)

動態 Pantone 色號預覽系統，支援 OG Image 自動生成。將任何 Pantone 色號分享到 LINE、Slack 或 Facebook，即可產生色彩豐富的預覽卡片。

**線上版本**：https://pantone-converter.vercel.app

## 功能特色

- 1789 個 Pantone Coated (C) 色號，視覺化色卡呈現
- 動態 OG Image 產生（1200x630 PNG），社群預覽自動顯示
- 依色系（紅、藍、綠...）或編號系列（1xx、2xx、3xx...）篩選
- 依名稱、色號或 HEX 值搜尋
- 依名稱、亮度或編號排序
- 一鍵複製網址、HEX 色碼、OG 圖片連結
- 每個色號有獨立頁面，含完整 SEO 與 OG 中繼資料
- Edge Runtime 全球快速產圖（< 500ms）
- 多語系：English、繁體中文、简体中文
- 健康檢查端點（API 監控用）

## 快速開始

### 前置需求

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+

### 安裝與啟動

```bash
# 1. 複製專案
git clone https://github.com/cloud-f1/pantone-converter.git
cd pantone-converter

# 2. 安裝套件
pnpm install

# 3. 啟動開發伺服器
pnpm dev
```

開啟 http://localhost:3000 即可使用。

### 常用指令

| 指令 | 說明 |
|:-----|:-----|
| `pnpm dev` | 啟動開發伺服器 |
| `pnpm build` | 正式版建置 |
| `pnpm start` | 啟動正式版伺服器 |
| `pnpm lint` | ESLint 檢查 |
| `pnpm test` | 執行測試（監聽模式） |
| `pnpm test:run` | 執行測試（一次） |
| `pnpm validate` | 驗證所有 Pantone 色號資料 |
| `pnpm validate:check 485C 2377C` | 檢查特定色號是否存在 |

## 使用方式

### 1. 社群分享（LINE / Slack / Facebook）

複製色號頁面網址，貼到 LINE 聊天室。平台會自動讀取 OG Image，產生帶有該顏色的預覽卡片。

```
https://pantone-converter.vercel.app/color/485C
```

### 2. API 直接使用

呼叫 OG 圖片 API，取得 1200x630 的 PNG 圖片：

```
GET /api/og?pantone=485C        → 紅色背景，白色文字 "Pantone 485 C"
GET /api/og?pantone=YELLOWC     → 黃色背景，黑色文字 "Pantone Yellow C"
GET /api/og?pantone=INVALID     → 灰色背景，白色文字 "Unknown Color"
```

嵌入 HTML：

```html
<meta property="og:image" content="https://pantone-converter.vercel.app/api/og?pantone=485C" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

或直接當圖片使用：

```html
<img src="https://pantone-converter.vercel.app/api/og?pantone=485C" alt="Pantone 485 C" />
```

### 3. 色號查詢

- 開啟首頁瀏覽所有色號
- 使用搜尋列輸入色號、名稱或 HEX 值
- 依色系或編號系列篩選
- 點擊色卡進入詳細頁面，取得分享網址

### 4. 健康檢查

```
GET /api/health → { "status": "ok", "timestamp": "...", "version": "0.1.0" }
```

## API 特性

- 色號查詢不分大小寫（`485c` = `485C`）
- 自動忽略空格與連字號（`485 C` = `485-C` = `485C`）
- 未知色號回傳灰色佔位圖（不會出錯）
- 文字顏色依背景亮度自動切換黑/白（符合 WCAG AA）

## 多語系

點擊頁面右上角的語系切換按鈕，即可切換語言：

| 代碼 | 語言 | 標籤 |
|:-----|:-----|:-----|
| `en` | 英文 | English |
| `zh-tw` | 繁體中文 | 繁體中文 |
| `zh-cn` | 簡體中文 | 简体中文 |

語言偏好儲存在 Cookie 中，下次造訪會自動記住。

## 色號涵蓋範圍

共 1789 個 Pantone Coated (C) 色號：

| 系列 | 數量 | 說明 |
|:-----|:-----|:-----|
| 100-699 | 600 | 標準色（完整） |
| 0xx | 3 | 012C, 021C, 072C |
| 7xx-8xx | 17 | 含螢光色 |
| 1xxx | 131 | 延伸色系 |
| 2xxx | 364 | 延伸色系 |
| 3xxx | 95 | 延伸色系 |
| 4xxx-5xxx | 10 | 延伸色系 |
| 7xxx | 518 | 特殊色系（7100-7771） |
| 命名色 | 51 | Black C、Reflex Blue C 等 |

## 技術架構

- **Next.js 16**（App Router）+ **React 19** + **TypeScript 5**
- **Tailwind CSS 4** 樣式
- **next/og**（Satori）OG 圖片產生 — Next.js 16 內建
- **@headlessui/react** 無障礙下拉選單
- **react-hot-toast** 複製通知
- **Vitest** + **React Testing Library** 測試
- **Vercel** Edge Functions 部署

## 專案結構

```
pantone-converter/
├── docs/                       # 產品需求、技術架構、開發計畫
├── scripts/
│   └── validate-pantone.ts     # Pantone 色號驗證工具
├── src/
│   ├── i18n/                   # 多語系設定與翻譯檔
│   ├── components/             # UI 元件（色卡、搜尋、排序、複製）
│   ├── features/color/         # Pantone 資料與色彩工具
│   └── app/                    # 頁面與 API 路由
├── public/
│   └── favicon.svg             # 漸層調色盤圖示
├── vercel.json
└── package.json
```

## 部署

推送到 `main` 分支，Vercel 自動部署。或手動：

```bash
vercel deploy --prod
```

## 授權

MIT

---

詳細文件請見 [docs/index.md](docs/index.md)
