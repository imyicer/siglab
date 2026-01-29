# Tech Stack: 技术选型建议

## 1. 后端与计算引擎
* **Backtest Engine**: [QuantConnect LEAN](https://github.com/QuantConnect/Lean) (C#/.NET)
* **Logic Framework**: Python (作为 LEAN 的脚本接口，方便 AI 生成代码)
* **Core API**: Go 或 Node.js (处理用户逻辑、任务调度、行情分发)

## 2. 前端交互
* **Framework**: React.js + Tailwind CSS
* **Editor**: 
    * **Drag & Drop**: [Google Blockly](https://developers.google.com/blockly) 或 [React Flow](https://reactflow.dev/) (推荐 React Flow，更符合交易员的逻辑流感)。
    * **AI Chat**: 基于 Vercel AI SDK 的对话交互。
* **Charts**: Lightweight Charts (TradingView) - 交易员最熟悉的 UI。

## 3. 数据与存储
* **Time Series DB**: TimescaleDB 或 InfluxDB (存储 5 年的历史报价数据)。
* **App DB**: PostgreSQL (存储用户信息、策略逻辑 JSON)。
* **Cache**: Redis (实时行情分发缓存)。

## 4. 数据源
* **Crypto**: Binance/Coinbase API (历史与实时)。
* **CFD**: Oanda 或 Interactive Brokers API。