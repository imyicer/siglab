# Tech Stack: 技术选型

---

## 1. 整体架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  React Flow (画布) + TradingView Charts + AI Chat UI    │
└──────────────┬──────────────────────┬───────────────────┘
               │ REST API             │ WebSocket
┌──────────────▼──────────────────────▼───────────────────┐
│                  Backend API (NestJS)                   │
│  用户管理 │ 策略管理 │ 行情API │ 回测调度 │ AI代理         │
└─────┬────────────┬──────────────┬───────────────────────┘
      │            │              │
      ▼            ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────────────────┐
│  MySQL   │ │  Redis   │ │   Kafka 任务队列     │
│ (用户/   │ │ (缓存/   │ │                      │
│  策略)   │ │  行情)   │ └──────────┬───────────┘
└──────────┘ └──────────┘            │
                                     ▼
                          ┌──────────────────────┐
                          │  LEAN Engine Worker  │
                          │  (Docker Container)  │
                          │  C#/.NET + Python    │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │   MangoDB            │
                          │ (5年历史行情数据)     │
                          └──────────────────────┘
```

---

## 2. 后端与计算引擎

### 2.1 回测引擎: QuantConnect LEAN
* **仓库**: [github.com/QuantConnect/Lean](https://github.com/QuantConnect/Lean)
* **语言**: C# / .NET
* **角色**: 核心回测与 Forward Test 执行引擎（不自研，直接集成）
* **集成方式**: Docker 容器化部署，作为独立微服务运行
* **通信模式**:
    ```
    用户提交策略 → API → BullMQ 消息队列 → LEAN Worker 容器（执行回测）
    → 回测结果写入 DB → WebSocket 推送前端
    ```
* **优势**: 开源、Tick 级回测精度、支持多资产类别、活跃社区

### 2.2 策略脚本接口: Python
* **角色**: 作为 LEAN 的脚本接口，前端策略 JSON 最终编译为 Python 代码交给 LEAN 执行
* **优势**: AI 生成 Python 代码成熟度高，便于 LLM 输出可执行策略

### 2.3 核心 API 服务: NestJS (Node.js)
* **框架**: [NestJS](https://nestjs.com/) (TypeScript)
* **选型理由**:
    * 前后端统一 TypeScript 生态，共享类型定义，减少联调成本
    * 模块化架构（Module/Controller/Service）适合中大型项目
    * 内置依赖注入、守卫、拦截器、管道等企业级功能
    * 招聘市场 TypeScript 全栈工程师供给充足
    * API 层并非系统性能瓶颈（瓶颈在 LEAN 引擎），Node.js 的 I/O 性能完全满足需求
* **核心模块划分**:
    * `AuthModule` — 用户认证与授权
    * `UserModule` — 用户管理
    * `StrategyModule` — 策略 CRUD 与版本管理
    * `BacktestModule` — 回测任务提交与调度
    * `MarketDataModule` — 行情数据 API
    * `AIModule` — LLM 对接与策略生成
    * `NotificationModule` — 通知推送

---

## 3. 前端交互

### 3.1 框架: React + TypeScript
* **构建工具**: Vite（或 Next.js，如需 SSR/SEO 则选 Next.js）
* **样式方案**: Tailwind CSS
* **状态管理**: Zustand（轻量、TypeScript 友好）或 TanStack Query（服务端状态）

### 3.2 策略编辑器: React Flow
* **库**: [reactflow.dev](https://reactflow.dev/)
* **选型理由**: 比 Blockly 更现代，更贴合"流程图"式策略逻辑表达，Blockly 偏"积木编程"风格在交易领域显得过于幼稚
* **用途**: 策略可视化画布，节点拖拽、连线、参数配置

### 3.3 AI 对话交互: Vercel AI SDK
* **库**: [sdk.vercel.ai](https://sdk.vercel.ai/)
* **用途**: 自然语言策略生成的对话式 UI，流式输出

### 3.4 图表: TradingView Lightweight Charts
* **库**: [tradingview/lightweight-charts](https://github.com/niclas-niclas/lightweight-charts)
* **选型理由**: 交易员最熟悉的 K线图 UI，轻量、高性能、开源
* **用途**: K线图表、权益曲线、回撤分析图

### 3.5 UI 组件库
* **推荐**: shadcn/ui（基于 Radix UI + Tailwind，高度可定制）
* **补充**: Recharts 或 Nivo（统计图表，如月度收益热力图、盈亏分布饼图）

---

## 4. 数据与存储

### 4.1 时序数据库: TimescaleDB
* **角色**: 存储 5 年历史行情数据（M1/Tick OHLCV）
* **选型理由**: 基于 PostgreSQL 扩展，团队只需维护一种数据库技术栈；时间分区与压缩性能优于原生 PostgreSQL
* **替代方案**: InfluxDB（如果数据规模极大）

### 4.2 应用数据库: PostgreSQL
* **角色**: 存储用户信息、策略逻辑 JSON、回测记录、勋章、学习进度等
* **ORM**: Prisma（TypeScript 生态首选，类型安全、迁移方便）

### 4.3 缓存: Redis
* **角色**:
    * 实时行情最新报价缓存
    * 用户会话缓存
    * BullMQ 任务队列后端
    * 频率限制 (Rate Limiting)

### 4.4 对象存储: S3 兼容
* **方案**: AWS S3（生产）/ MinIO（自建/开发环境）
* **角色**: 存储回测报告导出文件、用户上传的自定义数据文件

---

## 5. 数据源

### 5.1 Crypto 数据源
* **历史数据**: Binance API / CoinGecko API
* **实时数据**: Binance WebSocket Streams
* **备用**: Coinbase Advanced Trade API

### 5.2 CFD 数据源
* **首选**: Oanda v20 REST API + Streaming API
    * 提供外汇、黄金、原油等 CFD 品种
    * 有免费 Practice 账户可用于开发
* **备用**: Interactive Brokers TWS API（品种更全，但接入复杂度更高）

### 5.3 支持品种（初期）

| 类别 | 品种 |
|---|---|
| Crypto | BTC/USD, ETH/USD, SOL/USD |
| 外汇 | EUR/USD, GBP/USD, USD/JPY |
| 贵金属 | XAU/USD (黄金), XAG/USD (白银) |
| 能源 | WTI 原油 (USO) |
| 指数 | NAS100 (纳斯达克), SPX500 (标普) |

---

## 6. 基础设施与 DevOps

### 6.1 容器化: Docker
* 所有服务 Docker 化（API、LEAN Worker、Redis、PostgreSQL、TimescaleDB）
* 本地开发使用 Docker Compose 一键启动全套环境
* 生产环境考虑 Kubernetes（规模扩大后）或 Railway/Fly.io（早期轻量部署）

### 6.2 Monorepo 管理: Turborepo
* 统一管理前端、后端、共享包
* 增量构建、缓存优化

### 6.3 CI/CD: GitHub Actions
* PR 自动 lint + test + build
* 合并到 main 自动部署到预发布环境

### 6.4 监控与日志
* **应用监控**: Sentry（错误追踪）
* **日志**: Pino（NestJS 日志库）+ 集中日志服务（如 Grafana Loki）
* **性能监控**: 回测任务执行时间、API 响应时间

---

## 7. 任务队列与异步处理

### 7.1 BullMQ (基于 Redis)
* **角色**: 回测任务的异步调度
* **选型理由**: Node.js 生态最成熟的 Redis 队列库，支持延迟任务、重试、优先级、并发控制
* **关键任务类型**:
    * `backtest:run` — 执行回测
    * `data:sync` — 增量行情数据同步
    * `report:generate` — 回测报告生成
    * `ai:analyze` — AI 策略诊断

---

## 8. 实时通信

### 8.1 Socket.IO
* **角色**: 前后端实时双向通信
* **场景**:
    * 实时行情推送（Ticker）
    * 回测进度推送
    * Forward Test 信号推送
    * 系统通知推送
* **替代方案**: 原生 `ws` 库（更轻量，但 Socket.IO 自带重连/房间/命名空间等能力）

---

## 9. 身份认证

### 9.1 方案选型
* **首选**: Clerk（开箱即用的认证服务，支持邮箱/OAuth/MFA，有 React + NestJS SDK）
* **备选**: NextAuth.js（如使用 Next.js）或自建 JWT + Passport.js
* **需要支持的登录方式**:
    * 邮箱 + 密码
    * Google OAuth
    * GitHub OAuth（面向开发者用户）

---

## 10. AI / LLM 集成

### 10.1 模型选型
* **主力**: OpenAI GPT-4o / Claude API（策略生成准确度更高的优先）
* **辅助**: 较小模型用于简单任务（参数提取、意图分类）

### 10.2 集成方式
* **后端**: AI Module 统一封装 LLM 调用，前端不直接调 LLM API
* **Prompt 工程**: 针对 LEAN Python 策略语法的专用 System Prompt + Few-shot 示例
* **流式输出**: 通过 Vercel AI SDK 实现打字机效果的策略生成体验
