/* ============================================================
   SigLab App — siglab-app.js
   Theme switching, i18n, rendering, interactions, simulations
   ============================================================ */

window.SigLabApp = (function () {
    'use strict';

    var currentLang = 'en';
    var aiTypingTimer = null;
    var marketSimTimer = null;

    /* ===== Theme Toggle ===== */
    function toggleTheme() {
        var html = document.documentElement;
        var body = document.body;
        var wasDark = html.classList.contains('dark');

        // Swap classes on both <html> and <body>
        html.classList.toggle('dark', !wasDark);
        html.classList.toggle('light', wasDark);
        body.classList.toggle('dark', !wasDark);
        body.classList.toggle('light', wasDark);

        // Sync TradingView charts + canvas radar
        var nowDark = !wasDark;
        SigLabCharts.applyTheme(nowDark);

        // Re-render sparklines with updated colors
        rebuildMarketCards();
    }

    /* ===== i18n ===== */
    function setLang(lang) {
        currentLang = lang;
        var translations = SigLabData.translations[lang];
        if (!translations) return;

        // Update <html lang>
        var langMap = { en: 'en', zh: 'zh-CN', es: 'es', ja: 'ja' };
        document.documentElement.setAttribute('lang', langMap[lang] || 'en');

        // Text content via data-i18n
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (translations[key] !== undefined) {
                el.innerHTML = translations[key];
            }
        });

        // Placeholder via data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (translations[key] !== undefined) {
                el.placeholder = translations[key];
            }
        });

        // Re-render data-driven sections
        renderMetrics();
        renderHeatmap();
        renderTemplates();
        renderBadges();
        startAITyping();
    }

    /* ===== Ticker Bar ===== */
    function renderTicker() {
        var container = document.getElementById('ticker-content');
        if (!container) return;

        var items = SigLabData.marketWatch.map(function (m) {
            var isUp = m.change >= 0;
            var color = isUp ? 'var(--up)' : 'var(--down)';
            var sign = isUp ? '+' : '';
            return '<span class="flex items-center gap-2 text-xs">' +
                '<span class="font-bold">' + m.symbol + '</span>' +
                '<span class="num" style="color:' + color + ';">' + m.price.toFixed(m.decimals) + '</span>' +
                '<span class="num" style="color:' + color + ';">' + sign + m.change.toFixed(2) + '%</span>' +
                '</span>';
        }).join('');

        // Double content for seamless marquee loop
        container.innerHTML = items + items;
    }

    /* ===== Market Watch Cards ===== */
    function renderMarketCards() {
        var container = document.getElementById('market-cards');
        if (!container) return;

        container.innerHTML = '';

        SigLabData.marketWatch.forEach(function (m) {
            var isUp = m.change >= 0;
            var color = isUp ? 'var(--up)' : 'var(--down)';
            var sign = isUp ? '+' : '';
            var arrow = isUp ? '↑' : '↓';

            var card = document.createElement('div');
            card.className = 'glass card p-4 market-card';
            card.innerHTML =
                '<div class="text-[10px] font-bold opacity-40 mb-1">' + m.symbol + '</div>' +
                '<div class="num font-bold text-lg mb-1 price-display" data-symbol="' + m.symbol + '">' + m.price.toFixed(m.decimals) + '</div>' +
                '<div class="num text-xs font-bold" style="color:' + color + ';">' + sign + m.change.toFixed(2) + '% ' + arrow + '</div>' +
                '<div class="mt-2 sparkline-container" data-symbol="' + m.symbol + '" style="height:40px;"></div>';
            container.appendChild(card);
        });

        // Attach sparkline charts
        container.querySelectorAll('.sparkline-container').forEach(function (el) {
            var symbol = el.getAttribute('data-symbol');
            var mData = SigLabData.marketWatch.find(function (m) { return m.symbol === symbol; });
            if (mData) {
                SigLabCharts.createSparkline(el, mData.sparkline, mData.change >= 0);
            }
        });
    }

    // Rebuild market cards (used on theme change to re-create sparklines)
    function rebuildMarketCards() {
        renderMarketCards();
    }

    /* ===== Backtest Metrics Grid ===== */
    function renderMetrics() {
        var container = document.getElementById('metrics-grid');
        if (!container) return;

        var t = SigLabData.translations[currentLang] || SigLabData.translations.en;

        container.innerHTML = SigLabData.metrics.map(function (m) {
            var label = t[m.key] || m.key;
            var valueColor = 'var(--text)';
            if (m.color === 'brand') valueColor = 'var(--brand)';
            if (m.color === 'down') valueColor = 'var(--down)';
            return '<div class="glass card p-4 text-center">' +
                '<div class="text-[10px] font-bold uppercase opacity-40 mb-2">' + label + '</div>' +
                '<div class="num font-bold text-lg" style="color:' + valueColor + ';">' + m.value + '</div>' +
                '</div>';
        }).join('');
    }

    /* ===== Monthly Returns Heatmap ===== */
    function renderHeatmap() {
        var container = document.getElementById('heatmap-grid');
        if (!container) return;

        var years = SigLabData.monthlyReturns.years;
        var months = SigLabData.monthlyReturns.months;
        var data = SigLabData.monthlyReturns.data;

        var html = '<div class="grid gap-1" style="grid-template-columns: 60px repeat(12, 1fr);">';

        // Header row (month abbreviations)
        html += '<div></div>';
        months.forEach(function (m) {
            html += '<div class="text-center text-[10px] font-bold opacity-30 py-1">' + m + '</div>';
        });

        // Data rows
        years.forEach(function (year, yi) {
            html += '<div class="num text-xs font-bold opacity-40 flex items-center">' + year + '</div>';
            data[yi].forEach(function (val) {
                if (val === null) {
                    html += '<div class="heatmap-cell" style="background:var(--border);opacity:0.3;">—</div>';
                } else {
                    var intensity = Math.min(Math.abs(val) / 5, 1);
                    var bg;
                    if (val > 0) {
                        bg = 'rgba(16,185,129,' + (0.15 + intensity * 0.5).toFixed(2) + ')';
                    } else {
                        bg = 'rgba(244,63,94,' + (0.15 + intensity * 0.5).toFixed(2) + ')';
                    }
                    var textColor = intensity > 0.4 ? '#FFFFFF' : 'inherit';
                    var sign = val > 0 ? '+' : '';
                    html += '<div class="heatmap-cell" style="background:' + bg + ';color:' + textColor + ';">' + sign + val.toFixed(1) + '</div>';
                }
            });
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /* ===== Trade List ===== */
    function renderTradeList() {
        var tbody = document.getElementById('trade-list-body');
        if (!tbody) return;

        tbody.innerHTML = SigLabData.tradeList.map(function (t) {
            var isProfit = t.pnl >= 0;
            var color = isProfit ? 'var(--up)' : 'var(--down)';
            var sign = isProfit ? '+' : '';
            var dirColor = t.dir === 'LONG' ? 'var(--up)' : 'var(--down)';
            var entryDec = t.entry < 10 ? 4 : 2;
            var exitDec = t.exit < 10 ? 4 : 2;
            return '<tr>' +
                '<td class="num text-xs opacity-70">' + t.date + '</td>' +
                '<td><span class="text-xs font-bold" style="color:' + dirColor + ';">' + t.dir + '</span></td>' +
                '<td class="text-xs font-bold">' + t.sym + '</td>' +
                '<td class="num text-xs">' + t.entry.toFixed(entryDec) + '</td>' +
                '<td class="num text-xs">' + t.exit.toFixed(exitDec) + '</td>' +
                '<td class="num text-xs font-bold" style="color:' + color + ';">' + sign + '$' + t.pnl.toFixed(2) + ' (' + sign + t.pct.toFixed(2) + '%)</td>' +
                '<td class="num text-xs opacity-70">' + t.dur + '</td>' +
                '</tr>';
        }).join('');
    }

    /* ===== Strategy Template Cards ===== */
    function renderTemplates() {
        var container = document.getElementById('template-cards');
        if (!container) return;

        var t = SigLabData.translations[currentLang] || SigLabData.translations.en;

        container.innerHTML = SigLabData.templates.map(function (tpl) {
            var name = t[tpl.nameKey] || tpl.nameKey;
            var desc = t[tpl.descKey] || tpl.descKey;
            var loadText = t['tpl.load'] || 'Load to Canvas';
            return '<div class="glass card p-6">' +
                '<div class="flex items-center gap-3 mb-3">' +
                    '<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:var(--brand-dim);">' +
                        '<i data-lucide="' + tpl.icon + '" class="w-5 h-5 text-brand"></i>' +
                    '</div>' +
                    '<div>' +
                        '<h4 class="font-bold text-sm">' + name + '</h4>' +
                        '<span class="text-[10px] opacity-40">' + tpl.category + '</span>' +
                    '</div>' +
                '</div>' +
                '<p class="text-xs opacity-60 mb-4 leading-relaxed">' + desc + '</p>' +
                '<div class="flex gap-4 text-[10px] num font-bold opacity-50 mb-4">' +
                    '<span>Sharpe ' + tpl.sharpe + '</span>' +
                    '<span>Win ' + tpl.winRate + '</span>' +
                    '<span>' + tpl.ret + '</span>' +
                '</div>' +
                '<button class="btn btn-secondary btn-sm w-full">' +
                    '<i data-lucide="play" class="w-3 h-3"></i> ' + loadText +
                '</button>' +
            '</div>';
        }).join('');

        // Re-create dynamically injected Lucide icons
        if (window.lucide) lucide.createIcons();
    }

    /* ===== Achievement Badges ===== */
    function renderBadges() {
        var container = document.getElementById('badge-container');
        if (!container) return;

        var t = SigLabData.translations[currentLang] || SigLabData.translations.en;

        container.innerHTML = SigLabData.badges.map(function (b) {
            var name = t[b.nameKey] || b.nameKey;
            return '<div class="badge-item">' +
                '<div class="badge-icon">' +
                    '<i data-lucide="' + b.icon + '" class="w-6 h-6 text-brand"></i>' +
                '</div>' +
                '<div class="text-[10px] font-bold opacity-60">' + name + '</div>' +
            '</div>';
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    /* ===== AI Typing Animation ===== */
    function startAITyping() {
        var el = document.getElementById('ai-response-text');
        var cursor = document.getElementById('ai-cursor');
        if (!el) return;

        // Reset
        if (aiTypingTimer) { clearInterval(aiTypingTimer); aiTypingTimer = null; }
        el.textContent = '';
        if (cursor) cursor.style.display = 'inline-block';

        var t = SigLabData.translations[currentLang] || SigLabData.translations.en;
        var fullText = t['ai.response'] || '';
        var idx = 0;

        aiTypingTimer = setInterval(function () {
            if (idx < fullText.length) {
                el.textContent += fullText.charAt(idx);
                idx++;
            } else {
                clearInterval(aiTypingTimer);
                aiTypingTimer = null;
                if (cursor) cursor.style.display = 'none';
            }
        }, 18);
    }

    /* ===== Toast Notifications ===== */
    function showToast(type, message) {
        var container = document.getElementById('toast-container');
        if (!container) return;

        var icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info',
        };

        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML =
            '<i data-lucide="' + (icons[type] || 'info') + '" class="w-4 h-4 flex-shrink-0"></i>' +
            '<span>' + message + '</span>';
        container.appendChild(toast);

        if (window.lucide) lucide.createIcons();

        // Auto dismiss after 3.5s
        setTimeout(function () {
            toast.classList.add('exit');
            setTimeout(function () { toast.remove(); }, 300);
        }, 3500);
    }

    /* ===== Backtest Progress Demo ===== */
    function runBacktestDemo() {
        var bar = document.getElementById('backtest-progress');
        var text = document.getElementById('backtest-progress-text');
        var btn = document.getElementById('btn-run-backtest');
        if (!bar || !text) return;

        if (btn) btn.disabled = true;
        var progress = 0;
        bar.style.width = '0%';
        text.textContent = '0%';

        var timer = setInterval(function () {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
                if (btn) btn.disabled = false;
                showToast('success', 'Backtest completed! 347 trades analyzed.');
            }
            bar.style.width = Math.round(progress) + '%';
            text.textContent = Math.round(progress) + '%';
        }, 150);
    }

    /* ===== Generic Progress Demo ===== */
    function runProgressDemo() {
        var bar = document.getElementById('demo-progress');
        var text = document.getElementById('demo-progress-text');
        if (!bar || !text) return;

        var progress = 0;
        bar.style.width = '0%';
        text.textContent = '0%';

        var timer = setInterval(function () {
            progress += Math.random() * 6 + 1;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
            }
            bar.style.width = Math.round(progress) + '%';
            text.textContent = Math.round(progress) + '%';
        }, 100);
    }

    /* ===== Market Price Simulation ===== */
    function startMarketSimulation() {
        marketSimTimer = setInterval(function () {
            SigLabData.marketWatch.forEach(function (m) {
                var oldPrice = m.price;
                var volatility = m.price * 0.001;
                m.price += (Math.random() - 0.48) * volatility;
                m.change += (Math.random() - 0.5) * 0.1;

                // Update displayed price
                var el = document.querySelector('.price-display[data-symbol="' + m.symbol + '"]');
                if (el) {
                    el.textContent = m.price.toFixed(m.decimals);
                    var flashClass = m.price >= oldPrice ? 'flash-up' : 'flash-down';
                    el.classList.remove('flash-up', 'flash-down');
                    void el.offsetWidth; // Force reflow to restart animation
                    el.classList.add(flashClass);
                }
            });
        }, 2000);
    }

    /* ===== Initialization ===== */
    function init() {
        // Render all data-driven sections
        renderTicker();
        renderMarketCards();
        renderMetrics();
        renderHeatmap();
        renderTradeList();
        renderTemplates();
        renderBadges();

        // Initialize TradingView + Canvas charts
        SigLabCharts.init();

        // Start live simulations
        startAITyping();
        startMarketSimulation();

        // Initialize Lucide icon library
        if (window.lucide) lucide.createIcons();

        // Responsive resize handler
        var resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                SigLabCharts.resizeAll();
            }, 150);
        });
    }

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        toggleTheme: toggleTheme,
        setLang: setLang,
        showToast: showToast,
        runBacktestDemo: runBacktestDemo,
        runProgressDemo: runProgressDemo,
    };
})();
