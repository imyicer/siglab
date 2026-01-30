# UI/UX Style Guide - SigLab v1.0

---

## 1. 核心视觉理念
* **Professional Comfort (专业舒适)**: 专为长时间盯着屏幕的交易员设计，拒绝高频蓝光，拒绝刺眼的纯白。
* **Visual Logic (可视化逻辑)**: 所有逻辑块、信号线和金融数据必须具备极高的辨识度，符合 Web Content Accessibility Guidelines (WCAG) AAA 级对比度标准。
* **Young Professional (年轻专业)**: 在保持金融行业专业感的同时，通过圆角、微动效和现代排版传达年轻活力，避免传统金融软件的呆板感。

---

## 2. 官方配色方案 (Official Palettes)

### A. Dark Mode: Deep Ocean (深邃海洋 - 默认)
* **Background (背景)**: `#0F172A` (极深蓝黑，提供沉浸式实验感)
* **Surface/Card (容器)**: `rgba(255, 255, 255, 0.03)` (配合 10% 透明度边框)
* **Primary/Brand (主色)**: `#38BDF8` (天蓝色，用于激活状态、主按钮)
* **Success/Up (盈利)**: `#10B981` (翡翠绿，用于买入信号、价格上涨)
* **Danger/Down (亏损)**: `#F43F5E` (活力红，用于卖出信号、价格下跌)
* **Warning (警告)**: `#F59E0B` (琥珀黄，用于风险提示、待处理状态)
* **Text Main (主文字)**: `#F8FAFC`
* **Text Sub (辅助文字)**: `rgba(248, 250, 252, 0.4)`

### B. Light Mode: Soft Paper (纸质感 - 护眼)
* **Background (背景)**: `#F2F0E9` (仿 Kindle 纸张色，过滤高频蓝光)
* **Surface/Card (容器)**: `#FFFFFF` (纯白卡片，增强层级感)
* **Primary/Brand (主色)**: `#0369A1` (加深的品牌蓝，确保在浅色底上的辨识度)
* **Success/Up (盈利)**: `#059669`
* **Danger/Down (亏损)**: `#DC2626`
* **Warning (警告)**: `#D97706`
* **Text Main (主文字)**: `#2D3748` (深石板灰，避免纯黑带来的视觉锐度过高)
* **Text Sub (辅助文字)**: `rgba(45, 55, 72, 0.5)`

---

## 3. 字体选型 (Typography - Finalized)

### 官方指定字体家族: IBM Plex
* **授权**: SIL Open Font License (OFL) - 开源免费，商业安全。
* **应用规则**:
    * **UI 界面/标题/普通文本**:
        * 英文/西班牙语: `IBM Plex Sans`
        * 简体中文: `IBM Plex Sans SC`
        * 日语: `IBM Plex Sans JP`
    * **金融数据/指标/代码/对数日志**:
        * 全语种统一使用: `IBM Plex Mono` (确保数字等宽对齐，防止误读 `0/O` 或 `1/l`)

---

## 4. Design Token 系统

### 4.1 间距系统 (基于 4px 网格)
| Token | 值 | 用途 |
|---|---|---|
| `space-1` | 4px | 紧凑间距（图标与文字） |
| `space-2` | 8px | 小间距（按钮内边距） |
| `space-3` | 12px | 标准间距 |
| `space-4` | 16px | 模块内间距 |
| `space-6` | 24px | 卡片内边距 |
| `space-8` | 32px | 模块间距 |
| `space-12` | 48px | 大区块间距 |
| `space-16` | 64px | 页面级间距 |

### 4.2 字号层级
| Token | 大小 | 行高 | 用途 |
|---|---|---|---|
| `text-xs` | 10px | 14px | 标签、辅助信息、时间戳 |
| `text-sm` | 12px | 16px | 次要信息、表格内容 |
| `text-base` | 14px | 20px | 正文默认字号 |
| `text-lg` | 16px | 24px | 副标题、强调文本 |
| `text-xl` | 20px | 28px | 卡片标题 |
| `text-2xl` | 24px | 32px | 页面标题 |
| `text-display-sm` | 36px | 40px | 展示数字（指标值） |
| `text-display` | 48px | 52px | Hero 标题 |
| `text-display-lg` | 72px | 76px | 首页大标题 |

### 4.3 层级系统 (z-index)
| Token | 值 | 用途 |
|---|---|---|
| `z-base` | 0 | 默认层级 |
| `z-sticky` | 10 | 粘性导航栏 |
| `z-dropdown` | 100 | 下拉菜单 |
| `z-overlay` | 150 | 遮罩层 |
| `z-modal` | 200 | 弹窗 |
| `z-toast` | 300 | 通知提示 |
| `z-tooltip` | 400 | 工具提示 |

---

## 5. 国际化适配 (Localization)
* **原则**: 不同语系在同一页面上必须保持视觉平衡和厚度一致。
* **多语言预览**:
    * EN: "Decode the Market."
    * ZH: "解码市场。"
    * ES: "Decodifica el Mercado."
    * JA: "市場を解読する。"

---

## 6. 组件视觉规范 (Component Specs)

### 6.1 圆角 (Border Radius)
* **基础卡片**: `2.5rem` (超大圆角，体现年轻化与亲和力)
* **按钮/小组件**: `9999px` (全圆角胶囊形)
* **输入框**: `0.75rem` (中等圆角)
* **弹窗/面板**: `1.5rem`

### 6.2 边框 (Border)
* `1px solid var(--border)`
* Dark Mode 下使用透明度边框，Light Mode 下使用微灰边框

### 6.3 阴影 (Shadow)
* **Dark Mode**: 弱阴影或无阴影，依靠边框和色差区分层级
* **Light Mode**: 柔和多层阴影
    * 卡片: `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 10px 15px -3px rgba(0,0,0,0.05)`
    * 悬浮: `box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 25px -5px rgba(0,0,0,0.08)`

---

## 7. 图标与插图风格

### 7.1 图标库
* **推荐**: [Lucide Icons](https://lucide.dev/) (线性风格，轻量专业)
* **备选**: [Phosphor Icons](https://phosphoricons.com/) (支持多种粗细变体)
* **风格要求**: 统一使用线性 (outline) 风格，描边宽度 1.5px-2px
* **尺寸规范**: 16px (内联) / 20px (按钮内) / 24px (导航) / 32px (空状态)

### 7.2 插图风格
* **空状态/引导页**: 简约线条插画（类似 Linear / Stripe 的风格）
* **颜色**: 仅使用品牌色 + 灰色调，不使用多彩插画
* **禁止**: 3D 图标、拟物化图标、过度装饰性插画

---

## 8. 交互微动效规范 (Motion)

### 8.1 基础过渡
* **模式切换（暗/亮）**: `0.4s cubic-bezier(0.4, 0, 0.2, 1)`
* **按钮 hover/active**: `0.15s ease`
* **卡片展开/收起**: `0.3s ease-out`
* **页面切换**: `0.2s ease`

### 8.2 数据相关动效
* **价格跳动**: 涨 → 绿色呼吸闪烁 (0.6s)，跌 → 红色呼吸闪烁 (0.6s)
* **数据加载**: 骨架屏 (Skeleton) 动画，禁止使用传统 loading spinner
* **回测进度**: 顶部细线进度条 (brand 色) + 百分比数字
* **图表绘制**: 权益曲线从左到右"画出"动画 (1.2s ease-out)

### 8.3 策略画布动效
* **节点拖拽**: 轻微弹性放置效果 (spring)
* **连线**: 吸附时高亮反馈 + 连线流动动画（数据方向指示）
* **节点添加**: 缩放渐入动画 (scale 0.8 → 1.0, 0.2s)
* **删除**: 缩放渐出 + 透明度消失 (0.15s)

### 8.4 禁止事项
* 禁止使用超过 1s 的纯装饰动画
* 禁止页面内容加载前的全屏 loading 动画
* 禁止阻碍用户操作的过渡动画
* 需支持 `prefers-reduced-motion` 媒体查询（无障碍）

---

## 9. 响应式设计策略

### 9.1 断点定义
| 断点 | 宽度 | 目标设备 |
|---|---|---|
| `sm` | ≥ 640px | 手机横屏 |
| `md` | ≥ 768px | 平板竖屏 |
| `lg` | ≥ 1024px | 平板横屏 / 小笔记本 |
| `xl` | ≥ 1280px | 桌面显示器 |
| `2xl` | ≥ 1536px | 大屏显示器 |

### 9.2 设备适配策略
* **桌面 (≥ 1024px)**: 主力场景，完整功能体验（策略画布、回测报告、Forward Test）
* **平板横屏 (≥ 768px)**: 支持查看回测报告和策略监控，画布编辑简化版
* **手机 (< 768px)**: 仅展示回测报告摘要、策略状态监控、通知推送。**不做策略编辑**（拖拽画布在手机上体验差）
* **设计原则**: 桌面优先 (Desktop First)，渐进缩减功能
