# Project Steps: 从 0 到 1 的路径图

## Milestone 1: 核心引擎与数据管线 (基础构建期)
* **Task 1.1: LEAN 引擎环境集成**
    * 部署 QuantConnect LEAN 核心容器。
    * 构建 C# 逻辑到 Python/JSON 的映射解析器，以便前端逻辑能被引擎识别。
* **Task 1.2: 历史行情数据库 (Data Lake)**
    * 对接核心品种（BTC, ETH, XAUUSD, EURUSD）过去 5 年的 M1/Tick 数据。
    * 编写清洗脚本，处理数据缺失与跳空问题。
* **Task 1.3: 模拟撮合环境搭建**
    * 在 LEAN 基础上定制“滑点模拟”和“手续费模板”功能。

## Milestone 2: 交互层开发 (产品成型期)
* **Task 2.1: 逻辑拖拽画布 (Blockly-based)**
    * 开发自定义组件块（如：指标块、价格块、逻辑判断块、风控块）。
* **Task 2.2: AI 策略助手 (Natural Language to Strategy)**
    * 接入 LLM API，构建针对 LEAN 语法的 Prompt 工程，将自然语言转为逻辑 JSON。
* **Task 2.3: 可视化回测报告**
    * 开发包含权益曲线、夏普比率、最大回撤、盈亏分布的交互式仪表盘。

## Milestone 3: 学习与社区系统 (生态搭建期)
* **Task 3.1: 策略学院模块**
    * 预设 10+ 种经典策略模板（双均线、布林带突破、海龟法则等）。
* **Task 3.2: Forward Test (模拟实盘) 系统**
    * 支持用户将回测满意的策略一键挂载到实时行情流中，监控表现。