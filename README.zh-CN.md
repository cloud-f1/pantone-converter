# Pantone 色号转换器

[English](./README.md) | [繁體中文](./README.zh-TW.md) | **简体中文**

动态 Pantone 色号预览系统，支持 OG Image 自动生成。将任何 Pantone 色号分享到 LINE、Slack 或 Facebook，即可生成色彩丰富的预览卡片。

**在线版本**：https://pantone-converter.vercel.app

## 功能特色

- 1789 个 Pantone Coated (C) 色号，可视化色卡展示
- 动态 OG Image 生成（1200x630 PNG），社交预览自动显示
- 按色系（红、蓝、绿...）或编号系列（1xx、2xx、3xx...）筛选
- 按名称、色号或 HEX 值搜索
- 按名称、亮度或编号排序
- 一键复制网址、HEX 色码、OG 图片链接
- 每个色号有独立页面，含完整 SEO 与 OG 元数据
- Edge Runtime 全球快速生图（< 500ms）
- 多语言：English、繁體中文、简体中文
- 健康检查端点（API 监控用）

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 8+

### 安装与启动

```bash
# 1. 克隆项目
git clone https://github.com/cloud-f1/pantone-converter.git
cd pantone-converter

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

打开 http://localhost:3000 即可使用。

### 常用命令

| 命令 | 说明 |
|:-----|:-----|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | ESLint 检查 |
| `pnpm test` | 运行测试（监听模式） |
| `pnpm test:run` | 运行测试（一次） |
| `pnpm validate` | 验证所有 Pantone 色号数据 |
| `pnpm validate:check 485C 2377C` | 检查特定色号是否存在 |

## 使用方式

### 1. 社交分享（LINE / Slack / Facebook）

复制色号页面网址，粘贴到 LINE 聊天中。平台会自动读取 OG Image，生成带有该颜色的预览卡片。

```
https://pantone-converter.vercel.app/color/485C
```

### 2. API 直接使用

调用 OG 图片 API，获取 1200x630 的 PNG 图片：

```
GET /api/og?pantone=485C        → 红色背景，白色文字 "Pantone 485 C"
GET /api/og?pantone=YELLOWC     → 黄色背景，黑色文字 "Pantone Yellow C"
GET /api/og?pantone=INVALID     → 灰色背景，白色文字 "Unknown Color"
```

嵌入 HTML：

```html
<meta property="og:image" content="https://pantone-converter.vercel.app/api/og?pantone=485C" />
```

### 3. 色号查询

- 打开首页浏览所有色号
- 使用搜索栏输入色号、名称或 HEX 值
- 按色系或编号系列筛选
- 点击色卡进入详细页面，获取分享网址

## 多语言

点击页面右上角的语言切换按钮：

| 代码 | 语言 |
|:-----|:-----|
| `en` | English |
| `zh-tw` | 繁體中文 |
| `zh-cn` | 简体中文 |

## 技术栈

- **Next.js 16** + **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **@headlessui/react**
- **next/og**（Satori）OG 图片生成
- **Vitest** + **React Testing Library**
- **Vercel** Edge Functions

## 部署

推送到 `main` 分支，Vercel 自动部署。或手动：

```bash
vercel deploy --prod
```

## 许可

MIT

---

详细文档请见 [docs/index.md](docs/index.md)
