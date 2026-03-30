# 產品需求文件 (PRD)

**專案名稱**：動態色母 OG Image 生成系統 (Pantone Converter)
**文件版本**：v1.1
**建立日期**：2026-03-31
**最後更新**：2026-03-31

---

## 1. 專案背景與目標

傳統塑膠射出工廠擁有大量「色母 (Color Masterbatch)」資料庫（通常以 Pantone 色號為基準）。為了提升業務報價與客戶溝通的效率，本專案旨在建立一個動態預覽服務。當使用者在通訊軟體（如 LINE、Slack、Facebook）中分享特定色母的網址時，系統需自動生成並顯示帶有該色母實際顏色與色號的預覽圖片（OG Image）。

## 2. 目標受眾

- **內部**：工廠業務人員（用於快速傳遞顏色資訊給客戶）。
- **外部**：上下游供應商、採購人員、終端設計師客戶。

## 3. 核心功能需求 (Functional Requirements)

### FR-1：URL 路由與參數解析

- 系統提供 `/color/[pantone]` 頁面路由（例如 `/color/485C`）。
- 頁面的 `<meta og:image>` 指向 `/api/og?pantone=485C`。

### FR-2：色碼查表對應

- 系統需具備「Pantone 色號 → HEX 色碼」的對應字典（例如 `485C` → `#DA291C`）。
- 字典以 TypeScript Record 或 JSON 靜態檔方式內嵌於程式碼。

### FR-3：動態 OG Image 生成

- 即時（On-the-fly）生成 PNG 圖片。
- 圖片尺寸：1200 × 630 px（Open Graph 標準）。
- 背景色 = 查表得出的 HEX 色碼。
- 圖片中央清晰顯示 Pantone 色號文字。
- 文字顏色需根據背景亮度自動切換黑/白（確保可讀性）。
- 輸出格式：`image/png`。

### FR-4：優雅降級 (Fallback)

- 無效/未知/空白色號 → 回傳預設灰色背景佔位圖，標示「Unknown Color」。

### FR-5：色號瀏覽頁面（首頁）

- 首頁列出所有可用的 Pantone 色號，以色卡格式呈現。
- 每張色卡可點擊進入該色號的分享頁面。

## 4. 使用者流程 (User Flow)

1. 業務人員在首頁瀏覽或搜尋色號 `485C`。
2. 點擊色卡進入 `/color/485C` 分享頁面。
3. 複製網址貼到 LINE 聊天室。
4. LINE 爬蟲讀取 `<meta og:image>` → 呼叫 `/api/og?pantone=485C`。
5. API 即時生成紅色背景 + 「PANTONE 485 C」字樣的 PNG 並回傳。
6. LINE 聊天室呈現該顏色的預覽卡片。

## 5. 非功能需求 (Non-Functional Requirements)

| 項目 | 要求 |
|:---|:---|
| **回應時間** | OG Image API < 500ms（Edge Runtime） |
| **可用性** | 依 Vercel 平台 SLA |
| **SEO** | 每個色號頁面需有獨立的 title、description、og:image |
| **無障礙** | 色卡文字對比度符合 WCAG AA |

## 6. 未來擴展性

- **動態資料庫**：將靜態字典替換為 Vercel Edge Config 或 Supabase，讓工廠自行維護色碼表。
- **版面客製化**：在 OG Image 模板中加入工廠 Logo、材質名稱（PP、ABS）等資訊。
- **批次分享**：支援多色號組合的比較預覽圖。
- **色號搜尋 API**：提供模糊搜尋端點供外部系統整合。
