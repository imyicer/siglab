/* ============================================================
   SigLab Charts — siglab-charts.js
   TradingView Lightweight Charts + Canvas radar chart
   ============================================================ */

window.SigLabCharts = (function () {
    'use strict';

    // Chart instances
    let candlestickChart = null;
    let candlestickSeries = null;
    let volumeSeries = null;
    let equityChart = null;
    let equitySeries = null;
    let benchSeries = null;
    let drawdownChart = null;
    let drawdownSeries = null;
    const sparklineInstances = [];

    /* ===== Theme configurations for TradingView ===== */
    const themes = {
        dark: {
            layout: { background: { color: 'transparent' }, textColor: 'rgba(248,250,252,0.5)' },
            grid: {
                vertLines: { color: 'rgba(255,255,255,0.04)' },
                horzLines: { color: 'rgba(255,255,255,0.04)' },
            },
            crosshair: {
                mode: 0,
                vertLine: { color: 'rgba(56,189,248,0.3)', labelBackgroundColor: '#38BDF8' },
                horzLine: { color: 'rgba(56,189,248,0.3)', labelBackgroundColor: '#38BDF8' },
            },
            timeScale: { borderColor: 'rgba(255,255,255,0.1)' },
            rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
        },
        light: {
            layout: { background: { color: 'transparent' }, textColor: 'rgba(45,55,72,0.5)' },
            grid: {
                vertLines: { color: 'rgba(0,0,0,0.04)' },
                horzLines: { color: 'rgba(0,0,0,0.04)' },
            },
            crosshair: {
                mode: 0,
                vertLine: { color: 'rgba(3,105,161,0.3)', labelBackgroundColor: '#0369A1' },
                horzLine: { color: 'rgba(3,105,161,0.3)', labelBackgroundColor: '#0369A1' },
            },
            timeScale: { borderColor: 'rgba(0,0,0,0.08)' },
            rightPriceScale: { borderColor: 'rgba(0,0,0,0.08)' },
        },
    };

    function isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }

    function currentTheme() {
        return isDarkMode() ? themes.dark : themes.light;
    }

    /* ===== Candlestick + Volume Chart ===== */
    function createCandlestick() {
        const container = document.getElementById('candlestick-chart');
        if (!container || typeof LightweightCharts === 'undefined') return;

        const theme = currentTheme();
        candlestickChart = LightweightCharts.createChart(container, {
            ...theme,
            width: container.clientWidth,
            height: 400,
            timeScale: { ...theme.timeScale, timeVisible: false },
            rightPriceScale: { ...theme.rightPriceScale, scaleMargins: { top: 0.1, bottom: 0.25 } },
        });

        candlestickSeries = candlestickChart.addSeries(LightweightCharts.CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#F43F5E',
            borderUpColor: '#10B981',
            borderDownColor: '#F43F5E',
            wickUpColor: '#10B981',
            wickDownColor: '#F43F5E',
        });
        candlestickSeries.setData(SigLabData.candlestickData);

        volumeSeries = candlestickChart.addSeries(LightweightCharts.HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });
        candlestickChart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });
        volumeSeries.setData(SigLabData.volumeData);

        candlestickChart.timeScale().fitContent();
    }

    /* ===== Equity Curve Chart ===== */
    function createEquityCurve() {
        const container = document.getElementById('equity-chart');
        if (!container || typeof LightweightCharts === 'undefined') return;

        const dark = isDarkMode();
        const theme = currentTheme();
        equityChart = LightweightCharts.createChart(container, {
            ...theme,
            width: container.clientWidth,
            height: 300,
            timeScale: { ...theme.timeScale },
            rightPriceScale: { ...theme.rightPriceScale },
        });

        equitySeries = equityChart.addSeries(LightweightCharts.LineSeries, {
            color: dark ? '#38BDF8' : '#0369A1',
            lineWidth: 2,
            priceFormat: { type: 'price', precision: 0, minMove: 1 },
        });
        equitySeries.setData(SigLabData.equityCurve);

        benchSeries = equityChart.addSeries(LightweightCharts.LineSeries, {
            color: dark ? 'rgba(248,250,252,0.2)' : 'rgba(45,55,72,0.2)',
            lineWidth: 1,
            lineStyle: 2,
            priceFormat: { type: 'price', precision: 0, minMove: 1 },
        });
        benchSeries.setData(SigLabData.benchmarkCurve);

        equityChart.timeScale().fitContent();
    }

    /* ===== Drawdown Chart ===== */
    function createDrawdownChart() {
        const container = document.getElementById('drawdown-chart');
        if (!container || typeof LightweightCharts === 'undefined') return;

        const theme = currentTheme();
        drawdownChart = LightweightCharts.createChart(container, {
            ...theme,
            width: container.clientWidth,
            height: 180,
            timeScale: { ...theme.timeScale },
            rightPriceScale: { ...theme.rightPriceScale },
        });

        drawdownSeries = drawdownChart.addSeries(LightweightCharts.AreaSeries, {
            topColor: 'rgba(244,63,94,0.01)',
            bottomColor: 'rgba(244,63,94,0.25)',
            lineColor: '#F43F5E',
            lineWidth: 1,
            priceFormat: {
                type: 'custom',
                formatter: function (v) { return v.toFixed(1) + '%'; },
            },
        });
        drawdownSeries.setData(SigLabData.drawdownData);

        drawdownChart.timeScale().fitContent();
    }

    /* ===== Sparkline (Market Watch Cards) ===== */
    function createSparkline(container, data, isUp) {
        if (!container || typeof LightweightCharts === 'undefined') return null;

        const chart = LightweightCharts.createChart(container, {
            width: container.clientWidth,
            height: 40,
            layout: { background: { color: 'transparent' }, textColor: 'transparent' },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            timeScale: { visible: false, borderVisible: false },
            rightPriceScale: { visible: false, borderVisible: false },
            leftPriceScale: { visible: false, borderVisible: false },
            crosshair: {
                mode: 0,
                vertLine: { visible: false, labelVisible: false },
                horzLine: { visible: false, labelVisible: false },
            },
            handleScroll: false,
            handleScale: false,
        });

        var color = isUp ? '#10B981' : '#F43F5E';
        var series = chart.addSeries(LightweightCharts.AreaSeries, {
            topColor: color + '30',
            bottomColor: color + '05',
            lineColor: color,
            lineWidth: 1.5,
            crosshairMarkerVisible: false,
            priceLineVisible: false,
            lastValueVisible: false,
        });
        series.setData(data);
        chart.timeScale().fitContent();

        sparklineInstances.push(chart);
        return chart;
    }

    /* ===== Canvas Radar Chart (Strategy DNA) ===== */
    function drawRadarChart() {
        var canvas = document.getElementById('radar-chart');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        var r = Math.min(cx, cy) * 0.65;
        var dark = isDarkMode();
        var data = SigLabData.radarData;
        var n = data.labels.length;

        ctx.clearRect(0, 0, w, h);

        // Concentric polygon grid
        var levels = 5;
        for (var level = 1; level <= levels; level++) {
            var lr = (r / levels) * level;
            ctx.beginPath();
            for (var i = 0; i <= n; i++) {
                var angle = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
                var x = cx + lr * Math.cos(angle);
                var y = cy + lr * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Axis lines
        for (var i = 0; i < n; i++) {
            var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            ctx.strokeStyle = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Data polygon fill + stroke
        var brandColor = dark ? '#38BDF8' : '#0369A1';
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
            var idx = i % n;
            var angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
            var val = data.values[idx];
            var x = cx + r * val * Math.cos(angle);
            var y = cy + r * val * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = brandColor + '20';
        ctx.fill();
        ctx.strokeStyle = brandColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Data point dots
        for (var i = 0; i < n; i++) {
            var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            var val = data.values[i];
            var x = cx + r * val * Math.cos(angle);
            var y = cy + r * val * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = brandColor;
            ctx.fill();
            ctx.strokeStyle = dark ? '#0F172A' : '#F2F0E9';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Labels
        ctx.font = '11px "IBM Plex Sans", sans-serif';
        ctx.fillStyle = dark ? 'rgba(248,250,252,0.6)' : 'rgba(45,55,72,0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var i = 0; i < n; i++) {
            var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
            var labelR = r + 28;
            var x = cx + labelR * Math.cos(angle);
            var y = cy + labelR * Math.sin(angle);
            ctx.fillText(data.labels[i], x, y);
        }
    }

    /* ===== Theme Switching ===== */
    function applyTheme(dark) {
        var theme = dark ? themes.dark : themes.light;

        if (candlestickChart) {
            candlestickChart.applyOptions(theme);
        }

        if (equityChart) {
            equityChart.applyOptions(theme);
            if (equitySeries) {
                equitySeries.applyOptions({
                    color: dark ? '#38BDF8' : '#0369A1',
                });
            }
            if (benchSeries) {
                benchSeries.applyOptions({
                    color: dark ? 'rgba(248,250,252,0.2)' : 'rgba(45,55,72,0.2)',
                });
            }
        }

        if (drawdownChart) {
            drawdownChart.applyOptions(theme);
        }

        // Redraw canvas radar
        drawRadarChart();
    }

    /* ===== Responsive Resize ===== */
    function resizeAll() {
        var pairs = [
            [candlestickChart, 'candlestick-chart', 400],
            [equityChart, 'equity-chart', 300],
            [drawdownChart, 'drawdown-chart', 180],
        ];
        pairs.forEach(function (p) {
            var chart = p[0], id = p[1], h = p[2];
            var el = document.getElementById(id);
            if (chart && el) {
                chart.resize(el.clientWidth, h);
            }
        });

        drawRadarChart();
    }

    /* ===== Initialization ===== */
    function init() {
        createCandlestick();
        createEquityCurve();
        createDrawdownChart();
        drawRadarChart();
    }

    return {
        init: init,
        applyTheme: applyTheme,
        resizeAll: resizeAll,
        createSparkline: createSparkline,
        drawRadarChart: drawRadarChart,
    };
})();
