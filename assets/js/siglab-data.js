/* ============================================================
   SigLab Data Layer — siglab-data.js
   Mock datasets, sample trades, i18n translations
   ============================================================ */

window.SigLabData = {};

/* ===== 1. Candlestick OHLCV Data (~120 bars, BTC/USD daily) ===== */
(function generateCandlestickData() {
    const data = [];
    const vol = [];
    let o = 42150;
    const startDate = new Date('2024-01-02');

    for (let i = 0; i < 120; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        // Skip weekends for realism
        if (d.getDay() === 0 || d.getDay() === 6) { o += (Math.random() - 0.48) * 200; continue; }

        const change = (Math.random() - 0.48) * 1500;
        const c = o + change;
        const h = Math.max(o, c) + Math.random() * 800;
        const l = Math.min(o, c) - Math.random() * 800;
        const time = d.toISOString().split('T')[0];
        const isUp = c >= o;

        data.push({ time, open: +o.toFixed(2), high: +h.toFixed(2), low: +l.toFixed(2), close: +c.toFixed(2) });
        vol.push({ time, value: Math.floor(Math.random() * 30000000 + 10000000), color: isUp ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)' });
        o = c;
    }
    SigLabData.candlestickData = data;
    SigLabData.volumeData = vol;
})();

/* ===== 2. Equity Curve Data (5 years, ~250 points) ===== */
(function generateEquityCurve() {
    const equity = [];
    const bench = [];
    let eVal = 100000;
    let bVal = 100000;
    const start = new Date('2020-01-02');

    for (let i = 0; i < 250; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i * 5); // ~weekly samples over 5 years
        const time = d.toISOString().split('T')[0];

        eVal *= (1 + (Math.random() - 0.44) * 0.03);
        eVal = Math.max(eVal, 60000);
        bVal *= (1 + (Math.random() - 0.47) * 0.015);

        equity.push({ time, value: +eVal.toFixed(2) });
        bench.push({ time, value: +bVal.toFixed(2) });
    }
    SigLabData.equityCurve = equity;
    SigLabData.benchmarkCurve = bench;
})();

/* ===== 3. Drawdown Data ===== */
(function generateDrawdownData() {
    const dd = [];
    let peak = SigLabData.equityCurve[0].value;
    SigLabData.equityCurve.forEach(pt => {
        if (pt.value > peak) peak = pt.value;
        const drawdown = (pt.value - peak) / peak;
        dd.push({ time: pt.time, value: +(drawdown * 100).toFixed(2) });
    });
    SigLabData.drawdownData = dd;
})();

/* ===== 4. Monthly Returns Heatmap ===== */
SigLabData.monthlyReturns = {
    years: [2020, 2021, 2022, 2023, 2024],
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    data: [
        [ 2.1, -0.8, -5.2,  4.3,  1.7,  3.2, -1.1,  2.8,  0.5,  3.9,  1.2,  4.1],
        [ 3.5,  2.1, -0.3,  1.8, -2.4,  0.9,  3.7,  1.1, -1.5,  4.2,  2.8,  1.6],
        [-1.2,  0.4, -3.8, -2.1,  1.3, -0.7,  2.2, -1.9,  0.8,  1.5, -0.4,  3.2],
        [ 4.1,  1.8,  2.4, -0.6,  3.1,  0.2, -1.3,  2.9,  1.7, -0.8,  3.5,  2.1],
        [ 1.9,  3.2, -1.1,  2.7,  0.4,  1.8, -0.5,  2.3, null, null, null, null],
    ]
};

/* ===== 5. Trade List (10 sample trades) ===== */
SigLabData.tradeList = [
    { date: '2024-03-15 09:30', dir: 'LONG',  sym: 'BTC/USD', entry: 41250.00, exit: 43180.50, pnl: 1930.50,  pct: 4.68,  dur: '2d 4h' },
    { date: '2024-03-22 14:15', dir: 'SHORT', sym: 'BTC/USD', entry: 43500.00, exit: 42100.00, pnl: 1400.00,  pct: 3.22,  dur: '1d 8h' },
    { date: '2024-04-01 10:00', dir: 'LONG',  sym: 'ETH/USD', entry: 2280.00,  exit: 2150.00,  pnl: -130.00, pct: -5.70, dur: '3d 2h' },
    { date: '2024-04-10 08:45', dir: 'LONG',  sym: 'XAU/USD', entry: 2015.30,  exit: 2068.40,  pnl: 531.00,  pct: 2.63,  dur: '5d 1h' },
    { date: '2024-04-22 11:30', dir: 'SHORT', sym: 'EUR/USD', entry: 1.0890,   exit: 1.0820,   pnl: 700.00,  pct: 0.64,  dur: '2d 6h' },
    { date: '2024-05-03 09:00', dir: 'LONG',  sym: 'BTC/USD', entry: 44800.00, exit: 43200.00, pnl: -1600.00,pct: -3.57, dur: '1d 12h' },
    { date: '2024-05-15 13:20', dir: 'LONG',  sym: 'NAS100',  entry: 17280.00, exit: 17620.00, pnl: 340.00,  pct: 1.97,  dur: '3d 0h' },
    { date: '2024-05-28 10:10', dir: 'SHORT', sym: 'BTC/USD', entry: 46200.00, exit: 44100.00, pnl: 2100.00, pct: 4.55,  dur: '4d 3h' },
    { date: '2024-06-05 09:45', dir: 'LONG',  sym: 'ETH/USD', entry: 2380.00,  exit: 2290.00,  pnl: -90.00,  pct: -3.78, dur: '2d 5h' },
    { date: '2024-06-18 14:00', dir: 'LONG',  sym: 'XAU/USD', entry: 2040.00,  exit: 2112.50,  pnl: 725.00,  pct: 3.55,  dur: '6d 2h' },
];

/* ===== 6. Market Watch Data ===== */
(function generateSparklines() {
    function spark(base, volatility, points) {
        const data = [];
        let v = base;
        const start = new Date('2024-06-01');
        for (let i = 0; i < points; i++) {
            const d = new Date(start); d.setDate(d.getDate() + i);
            v += (Math.random() - 0.48) * volatility;
            data.push({ time: d.toISOString().split('T')[0], value: +v.toFixed(4) });
        }
        return data;
    }

    SigLabData.marketWatch = [
        { symbol: 'BTC/USD',  price: 42342.10,  change: 3.24,  decimals: 2, sparkline: spark(42000, 500, 30) },
        { symbol: 'ETH/USD',  price: 2284.12,   change: 1.87,  decimals: 2, sparkline: spark(2280, 40, 30) },
        { symbol: 'XAU/USD',  price: 2024.45,   change: -0.32, decimals: 2, sparkline: spark(2020, 8, 30) },
        { symbol: 'EUR/USD',  price: 1.0842,     change: 0.15,  decimals: 4, sparkline: spark(1.084, 0.003, 30) },
        { symbol: 'GBP/USD',  price: 1.2654,     change: -0.28, decimals: 4, sparkline: spark(1.265, 0.004, 30) },
        { symbol: 'NAS100',   price: 17442.80,   change: -0.91, decimals: 2, sparkline: spark(17400, 100, 30) },
    ];
})();

/* ===== 7. Backtest Metrics ===== */
SigLabData.metrics = [
    { key: 'bt.totalReturn', value: '+248.4%', color: 'brand' },
    { key: 'bt.cagr',        value: '+28.3%',  color: 'brand' },
    { key: 'bt.sharpe',      value: '2.14',    color: null },
    { key: 'bt.sortino',     value: '3.02',    color: null },
    { key: 'bt.maxDD',       value: '-12.4%',  color: 'down' },
    { key: 'bt.winRate',     value: '58.2%',   color: null },
    { key: 'bt.profitFactor',value: '1.84',    color: null },
    { key: 'bt.totalTrades', value: '347',     color: null },
];

/* ===== 8. Strategy Templates ===== */
SigLabData.templates = [
    { id: 'ema-cross',  icon: 'trending-up', nameKey: 'tpl.ema',  descKey: 'tpl.emaDesc',  category: 'Trend Following',  sharpe: '1.82', winRate: '54%', ret: '+124%' },
    { id: 'rsi-ob',     icon: 'activity',    nameKey: 'tpl.rsi',  descKey: 'tpl.rsiDesc',  category: 'Mean Reversion',   sharpe: '1.45', winRate: '61%', ret: '+87%' },
    { id: 'boll-break', icon: 'bar-chart-2', nameKey: 'tpl.boll', descKey: 'tpl.bollDesc', category: 'Volatility',       sharpe: '1.67', winRate: '48%', ret: '+156%' },
];

/* ===== 9. Badges ===== */
SigLabData.badges = [
    { icon: 'play-circle', nameKey: 'badge.firstBt' },
    { icon: 'award',       nameKey: 'badge.golden' },
    { icon: 'zap',         nameKey: 'badge.streak5' },
    { icon: 'database',    nameKey: 'badge.explorer' },
    { icon: 'shield',      nameKey: 'badge.riskMaster' },
    { icon: 'bot',         nameKey: 'badge.aiWhisper' },
];

/* ===== 10. Radar Chart Data ===== */
SigLabData.radarData = {
    labels: ['Trend', 'Mean Reversion', 'Frequency', 'Risk Appetite', 'Market Dep.'],
    values: [0.85, 0.3, 0.6, 0.7, 0.45],
};

/* ===== 11. i18n Translations ===== */
SigLabData.translations = {
    en: {
        'nav.theme': 'Theme', 'nav.start': 'Get Started',
        'hero.title': 'Decode the Market.<br><span class="text-brand">Snap your Signals.</span>',
        'hero.sub': 'The visual laboratory for serious strategy construction.',
        // Section headings
        'section.market': 'Market Data', 'section.marketDesc': 'Real-time instruments and interactive charts',
        'section.backtest': 'Backtest Report', 'section.backtestDesc': 'Comprehensive strategy performance analysis',
        'section.builder': 'Strategy Builder', 'section.builderDesc': 'Visual flow editor and backtest configuration',
        'section.ai': 'AI Assistant', 'section.aiDesc': 'Natural language strategy generation',
        'section.community': 'Community & Gamification', 'section.communityDesc': 'Templates, badges, and strategy DNA',
        'section.primitives': 'UI Components', 'section.primitivesDesc': 'Design system primitives showcase',
        // Backtest
        'bt.totalReturn': 'Total Return', 'bt.cagr': 'CAGR', 'bt.sharpe': 'Sharpe Ratio', 'bt.sortino': 'Sortino Ratio',
        'bt.maxDD': 'Max Drawdown', 'bt.winRate': 'Win Rate', 'bt.profitFactor': 'Profit Factor', 'bt.totalTrades': 'Total Trades',
        'bt.equity': 'Equity Curve', 'bt.drawdown': 'Drawdown Analysis', 'bt.heatmap': 'Monthly Returns', 'bt.trades': 'Trade List',
        'bt.date': 'Date', 'bt.direction': 'Direction', 'bt.symbol': 'Symbol', 'bt.entry': 'Entry', 'bt.exit': 'Exit', 'bt.pnl': 'P&L', 'bt.duration': 'Duration',
        // Builder
        'sb.dataSource': 'Data Source', 'sb.indicator': 'Indicator', 'sb.condition': 'Condition', 'sb.action': 'Action',
        'sb.runBacktest': 'Run Backtest', 'sb.timeRange': 'Time Range', 'sb.capital': 'Initial Capital',
        'sb.leverage': 'Leverage', 'sb.feeModel': 'Fee Model', 'sb.configTitle': 'Backtest Configuration',
        // AI
        'ai.userMsg': 'Build a dual EMA crossover strategy for BTC with 20 and 50 periods, 5% stop loss',
        'ai.response': 'I\'ll create a dual EMA crossover strategy for BTC/USD:\n\n✅ Data Source: BTC/USD, H1 timeframe\n✅ Fast EMA: Period 20\n✅ Slow EMA: Period 50\n✅ Entry: Buy when fast EMA crosses above slow EMA\n✅ Exit: Sell when fast EMA crosses below slow EMA\n✅ Risk: 5% stop loss per trade\n\nThis strategy has been loaded to your canvas. Ready to backtest?',
        'ai.placeholder': 'Ask AI to build a strategy...',
        // Templates
        'tpl.ema': 'EMA Crossover', 'tpl.emaDesc': 'Classic dual EMA trend following strategy. Enters on golden cross, exits on death cross.',
        'tpl.rsi': 'RSI Reversal', 'tpl.rsiDesc': 'Mean reversion strategy. Buys when RSI drops below 30, sells above 70.',
        'tpl.boll': 'Bollinger Breakout', 'tpl.bollDesc': 'Volatility breakout strategy. Enters when price breaks above upper band.',
        'tpl.load': 'Load to Canvas',
        // Badges
        'badge.firstBt': 'First Backtest', 'badge.golden': 'Golden Logic', 'badge.streak5': '5-Streak Winner',
        'badge.explorer': 'Data Explorer', 'badge.riskMaster': 'Risk Master', 'badge.aiWhisper': 'AI Whisperer',
        'section.badges': 'Achievement Badges', 'section.dna': 'Strategy DNA',
        // Primitives
        'ui.buttons': 'Buttons', 'ui.forms': 'Form Controls', 'ui.toasts': 'Toast Notifications',
        'ui.skeletons': 'Skeleton Loading', 'ui.progress': 'Progress Bar',
    },
    zh: {
        'nav.theme': '主题', 'nav.start': '立即开始',
        'hero.title': '解码市场，<br><span class="text-brand">即刻构建信号。</span>',
        'hero.sub': '专为严肃交易者打造的可视化策略实验场。',
        'section.market': '市场数据', 'section.marketDesc': '实时行情与交互式图表',
        'section.backtest': '回测报告', 'section.backtestDesc': '全面的策略表现分析',
        'section.builder': '策略构建器', 'section.builderDesc': '可视化流程编辑器与回测配置',
        'section.ai': 'AI 助手', 'section.aiDesc': '自然语言策略生成',
        'section.community': '社区与成就', 'section.communityDesc': '策略模板、勋章与策略 DNA',
        'section.primitives': 'UI 组件', 'section.primitivesDesc': '设计系统基础组件展示',
        'bt.totalReturn': '总收益率', 'bt.cagr': '年化收益', 'bt.sharpe': '夏普比率', 'bt.sortino': '索提诺比率',
        'bt.maxDD': '最大回撤', 'bt.winRate': '胜率', 'bt.profitFactor': '利润因子', 'bt.totalTrades': '总交易次数',
        'bt.equity': '权益曲线', 'bt.drawdown': '回撤分析', 'bt.heatmap': '月度收益', 'bt.trades': '交易列表',
        'bt.date': '日期', 'bt.direction': '方向', 'bt.symbol': '品种', 'bt.entry': '入场', 'bt.exit': '出场', 'bt.pnl': '盈亏', 'bt.duration': '持仓时间',
        'sb.dataSource': '数据源', 'sb.indicator': '指标', 'sb.condition': '条件', 'sb.action': '动作',
        'sb.runBacktest': '运行回测', 'sb.timeRange': '时间范围', 'sb.capital': '初始资金',
        'sb.leverage': '杠杆', 'sb.feeModel': '手续费模型', 'sb.configTitle': '回测配置',
        'ai.userMsg': '为 BTC 构建一个双 EMA 交叉策略，周期 20 和 50，止损 5%',
        'ai.response': '我将为 BTC/USD 创建双 EMA 交叉策略：\n\n✅ 数据源：BTC/USD，H1 周期\n✅ 快速 EMA：周期 20\n✅ 慢速 EMA：周期 50\n✅ 入场：快速 EMA 上穿慢速 EMA 时买入\n✅ 出场：快速 EMA 下穿慢速 EMA 时卖出\n✅ 风控：每笔交易 5% 止损\n\n策略已加载到画布。准备好回测了吗？',
        'ai.placeholder': '让 AI 为你构建策略...',
        'tpl.ema': 'EMA 交叉', 'tpl.emaDesc': '经典双 EMA 趋势跟踪策略。金叉买入，死叉卖出。',
        'tpl.rsi': 'RSI 反转', 'tpl.rsiDesc': '均值回归策略。RSI 低于 30 买入，高于 70 卖出。',
        'tpl.boll': '布林带突破', 'tpl.bollDesc': '波动率突破策略。价格突破上轨时入场。',
        'tpl.load': '加载到画布',
        'badge.firstBt': '首次回测', 'badge.golden': '黄金逻辑', 'badge.streak5': '五连胜',
        'badge.explorer': '数据探索者', 'badge.riskMaster': '风控大师', 'badge.aiWhisper': 'AI 低语者',
        'section.badges': '成就勋章', 'section.dna': '策略 DNA',
        'ui.buttons': '按钮', 'ui.forms': '表单控件', 'ui.toasts': '通知提示',
        'ui.skeletons': '骨架屏加载', 'ui.progress': '进度条',
    },
    es: {
        'nav.theme': 'Tema', 'nav.start': 'Empezar',
        'hero.title': 'Decodifica el Mercado.<br><span class="text-brand">Tus Señales.</span>',
        'hero.sub': 'El laboratorio visual para la construcción de estrategias profesionales.',
        'section.market': 'Datos del Mercado', 'section.marketDesc': 'Instrumentos en tiempo real y gráficos interactivos',
        'section.backtest': 'Informe de Backtest', 'section.backtestDesc': 'Análisis completo del rendimiento',
        'section.builder': 'Constructor de Estrategias', 'section.builderDesc': 'Editor visual y configuración de backtest',
        'section.ai': 'Asistente AI', 'section.aiDesc': 'Generación de estrategias con lenguaje natural',
        'section.community': 'Comunidad', 'section.communityDesc': 'Plantillas, insignias y ADN de estrategia',
        'section.primitives': 'Componentes UI', 'section.primitivesDesc': 'Demostración de componentes del sistema de diseño',
        'bt.totalReturn': 'Retorno Total', 'bt.cagr': 'CAGR', 'bt.sharpe': 'Ratio Sharpe', 'bt.sortino': 'Ratio Sortino',
        'bt.maxDD': 'Retroceso Máx', 'bt.winRate': 'Tasa de Ganancia', 'bt.profitFactor': 'Factor de Beneficio', 'bt.totalTrades': 'Total Operaciones',
        'bt.equity': 'Curva de Capital', 'bt.drawdown': 'Análisis de Retroceso', 'bt.heatmap': 'Retornos Mensuales', 'bt.trades': 'Lista de Operaciones',
        'bt.date': 'Fecha', 'bt.direction': 'Dirección', 'bt.symbol': 'Símbolo', 'bt.entry': 'Entrada', 'bt.exit': 'Salida', 'bt.pnl': 'P&L', 'bt.duration': 'Duración',
        'sb.dataSource': 'Fuente de Datos', 'sb.indicator': 'Indicador', 'sb.condition': 'Condición', 'sb.action': 'Acción',
        'sb.runBacktest': 'Ejecutar Backtest', 'sb.timeRange': 'Rango de Tiempo', 'sb.capital': 'Capital Inicial',
        'sb.leverage': 'Apalancamiento', 'sb.feeModel': 'Modelo de Comisión', 'sb.configTitle': 'Configuración de Backtest',
        'ai.userMsg': 'Construye una estrategia de cruce EMA dual para BTC con períodos 20 y 50, stop loss 5%',
        'ai.response': 'Crearé una estrategia de cruce EMA dual para BTC/USD:\n\n✅ Fuente: BTC/USD, temporalidad H1\n✅ EMA Rápida: Período 20\n✅ EMA Lenta: Período 50\n✅ Entrada: Compra cuando EMA rápida cruza por encima\n✅ Salida: Venta cuando EMA rápida cruza por debajo\n✅ Riesgo: 5% stop loss por operación\n\nEstrategia cargada en el canvas. ¿Listo para el backtest?',
        'ai.placeholder': 'Pide a la AI que construya una estrategia...',
        'tpl.ema': 'Cruce EMA', 'tpl.emaDesc': 'Estrategia clásica de seguimiento de tendencia con doble EMA.',
        'tpl.rsi': 'Reversión RSI', 'tpl.rsiDesc': 'Estrategia de reversión a la media basada en niveles RSI.',
        'tpl.boll': 'Ruptura Bollinger', 'tpl.bollDesc': 'Estrategia de ruptura de volatilidad con Bandas de Bollinger.',
        'tpl.load': 'Cargar al Canvas',
        'badge.firstBt': 'Primer Backtest', 'badge.golden': 'Lógica Dorada', 'badge.streak5': '5 Victorias',
        'badge.explorer': 'Explorador', 'badge.riskMaster': 'Maestro de Riesgo', 'badge.aiWhisper': 'Susurrador AI',
        'section.badges': 'Insignias de Logro', 'section.dna': 'ADN de Estrategia',
        'ui.buttons': 'Botones', 'ui.forms': 'Controles de Formulario', 'ui.toasts': 'Notificaciones',
        'ui.skeletons': 'Carga Esqueleto', 'ui.progress': 'Barra de Progreso',
    },
    ja: {
        'nav.theme': 'テーマ', 'nav.start': '今すぐ開始',
        'hero.title': '市場を解読し、<br><span class="text-brand">シグナルを構築。</span>',
        'hero.sub': 'プロフェッショナルな戦略構築のための、可視化された実験場。',
        'section.market': 'マーケットデータ', 'section.marketDesc': 'リアルタイム相場とチャート',
        'section.backtest': 'バックテストレポート', 'section.backtestDesc': '包括的な戦略パフォーマンス分析',
        'section.builder': '戦略ビルダー', 'section.builderDesc': 'ビジュアルエディタとバックテスト設定',
        'section.ai': 'AIアシスタント', 'section.aiDesc': '自然言語による戦略生成',
        'section.community': 'コミュニティ', 'section.communityDesc': 'テンプレート、バッジ、戦略DNA',
        'section.primitives': 'UIコンポーネント', 'section.primitivesDesc': 'デザインシステムの基本要素',
        'bt.totalReturn': '合計リターン', 'bt.cagr': 'CAGR', 'bt.sharpe': 'シャープレシオ', 'bt.sortino': 'ソルティノレシオ',
        'bt.maxDD': '最大ドローダウン', 'bt.winRate': '勝率', 'bt.profitFactor': 'プロフィットファクター', 'bt.totalTrades': '取引回数',
        'bt.equity': 'エクイティカーブ', 'bt.drawdown': 'ドローダウン分析', 'bt.heatmap': '月次リターン', 'bt.trades': '取引一覧',
        'bt.date': '日付', 'bt.direction': '方向', 'bt.symbol': '銘柄', 'bt.entry': 'エントリー', 'bt.exit': 'エグジット', 'bt.pnl': '損益', 'bt.duration': '保有期間',
        'sb.dataSource': 'データソース', 'sb.indicator': 'インジケーター', 'sb.condition': '条件', 'sb.action': 'アクション',
        'sb.runBacktest': 'バックテスト実行', 'sb.timeRange': '期間', 'sb.capital': '初期資金',
        'sb.leverage': 'レバレッジ', 'sb.feeModel': '手数料モデル', 'sb.configTitle': 'バックテスト設定',
        'ai.userMsg': 'BTCの二重EMAクロス戦略を構築して。期間20と50、ストップロス5%',
        'ai.response': 'BTC/USDの二重EMAクロス戦略を作成します：\n\n✅ データソース：BTC/USD、H1タイムフレーム\n✅ 高速EMA：期間20\n✅ 低速EMA：期間50\n✅ エントリー：高速EMAが低速EMAを上抜けで買い\n✅ エグジット：高速EMAが低速EMAを下抜けで売り\n✅ リスク：1取引あたり5%ストップロス\n\n戦略がキャンバスに読み込まれました。バックテストの準備はできましたか？',
        'ai.placeholder': 'AIに戦略構築を依頼...',
        'tpl.ema': 'EMAクロス', 'tpl.emaDesc': 'クラシックなデュアルEMAトレンドフォロー戦略。',
        'tpl.rsi': 'RSI反転', 'tpl.rsiDesc': 'RSIレベルに基づく平均回帰戦略。',
        'tpl.boll': 'ボリンジャーブレイク', 'tpl.bollDesc': 'ボリンジャーバンドを使用したボラティリティブレイクアウト戦略。',
        'tpl.load': 'キャンバスに読込',
        'badge.firstBt': '初バックテスト', 'badge.golden': 'ゴールデンロジック', 'badge.streak5': '5連勝',
        'badge.explorer': 'データ探検家', 'badge.riskMaster': 'リスクマスター', 'badge.aiWhisper': 'AIウィスパラー',
        'section.badges': 'アチーブメントバッジ', 'section.dna': '戦略DNA',
        'ui.buttons': 'ボタン', 'ui.forms': 'フォームコントロール', 'ui.toasts': 'トースト通知',
        'ui.skeletons': 'スケルトンローディング', 'ui.progress': 'プログレスバー',
    },
};
