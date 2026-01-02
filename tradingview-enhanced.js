/**
 * Eternum Trading Journal - TradingView Enhanced Integration
 * Advanced charting capabilities with real-time market data
 */

class TradingViewEnhanced {
  constructor() {
    this.widget = null;
    this.currentSymbol = 'FX_IDC:EURUSD';
    this.currentInterval = '1D';
    this.isInitialized = false;
    this.chartReady = false;

    // Chart settings
    this.settings = {
      theme: 'dark',
      style: '1',
      timezone: 'Etc/UTC',
      locale: 'en',
      toolbar_bg: '#1a1f2e',
      enable_publishing: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: true,
      studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies'],
    };

    // Available symbols
    this.symbols = {
      forex: [
        { symbol: 'FX_IDC:EURUSD', name: 'EUR/USD' },
        { symbol: 'FX_IDC:GBPUSD', name: 'GBP/USD' },
        { symbol: 'FX_IDC:USDJPY', name: 'USD/JPY' },
        { symbol: 'FX_IDC:AUDUSD', name: 'AUD/USD' },
        { symbol: 'FX_IDC:USDCHF', name: 'USD/CHF' },
        { symbol: 'FX_IDC:USDCAD', name: 'USD/CAD' },
        { symbol: 'FX_IDC:EURGBP', name: 'EUR/GBP' },
        { symbol: 'FX_IDC:EURJPY', name: 'EUR/JPY' },
      ],
      crypto: [
        { symbol: 'COINBASE:BTCUSD', name: 'Bitcoin' },
        { symbol: 'COINBASE:ETHUSD', name: 'Ethereum' },
        { symbol: 'COINBASE:XRPUSD', name: 'Ripple' },
        { symbol: 'COINBASE:LTCUSD', name: 'Litecoin' },
        { symbol: 'COINBASE:ADAUSD', name: 'Cardano' },
        { symbol: 'COINBASE:DOTUSD', name: 'Polkadot' },
        { symbol: 'COINBASE:LINKUSD', name: 'Chainlink' },
      ],
      stocks: [
        { symbol: 'NASDAQ:AAPL', name: 'Apple' },
        { symbol: 'NASDAQ:TSLA', name: 'Tesla' },
        { symbol: 'NASDAQ:MSFT', name: 'Microsoft' },
        { symbol: 'NASDAQ:GOOGL', name: 'Alphabet' },
        { symbol: 'NASDAQ:AMZN', name: 'Amazon' },
        { symbol: 'NASDAQ:NFLX', name: 'Netflix' },
        { symbol: 'NASDAQ:NVDA', name: 'NVIDIA' },
      ],
      indices: [
        { symbol: 'INDEX:SPX', name: 'S&P 500' },
        { symbol: 'INDEX:DJI', name: 'Dow Jones' },
        { symbol: 'INDEX:NDX', name: 'NASDAQ 100' },
        { symbol: 'INDEX:UKX', name: 'FTSE 100' },
        { symbol: 'INDEX:DAX', name: 'DAX 30' },
        { symbol: 'INDEX:NKY', name: 'Nikkei 225' },
      ],
      commodities: [
        { symbol: 'TVC:GOLD', name: 'Gold' },
        { symbol: 'TVC:SILVER', name: 'Silver' },
        { symbol: 'NYMEX:CL1!', name: 'Crude Oil' },
        { symbol: 'NYMEX:NG1!', name: 'Natural Gas' },
      ],
    };

    // Timeframes
    this.timeframes = [
      { value: '1', name: '1m' },
      { value: '5', name: '5m' },
      { value: '15', name: '15m' },
      { value: '60', name: '1h' },
      { value: '240', name: '4h' },
      { value: '1D', name: '1D' },
      { value: '1W', name: '1W' },
      { value: '1M', name: '1M' },
    ];

    // Technical indicators
    this.indicators = [
      { id: 'MASimple', name: 'Moving Average', type: 'overlay' },
      { id: 'RSI', name: 'Relative Strength Index', type: 'oscillator' },
      { id: 'MACD', name: 'MACD', type: 'oscillator' },
      { id: 'BB', name: 'Bollinger Bands', type: 'overlay' },
      { id: 'Stochastic', name: 'Stochastic', type: 'oscillator' },
      { id: 'ATR', name: 'Average True Range', type: 'oscillator' },
      { id: 'Volume', name: 'Volume', type: 'volume' },
    ];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeChart();
    this.startPriceUpdates();
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Market selector
    const marketSelector = document.getElementById('chart-market');
    if (marketSelector) {
      marketSelector.addEventListener('change', (e) => {
        this.changeSymbol(e.target.value);
      });
    }

    // Timeframe selector
    const timeframeSelector = document.getElementById('chart-timeframe');
    if (timeframeSelector) {
      timeframeSelector.addEventListener('change', (e) => {
        this.changeInterval(e.target.value);
      });
    }

    // Chart controls
    const drawBtn = document.getElementById('chart-draw-btn');
    const indicatorBtn = document.getElementById('chart-indicator-btn');
    const fullscreenBtn = document.getElementById('chart-fullscreen-btn');

    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        this.toggleDrawingTools();
      });
    }

    if (indicatorBtn) {
      indicatorBtn.addEventListener('click', () => {
        this.showIndicatorMenu();
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    // Chart period buttons
    document.querySelectorAll('.chart-period-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.changePeriod(e.target.dataset.period);
      });
    });
  }

  initializeChart() {
    const container = document.getElementById('tradingview-chart');
    if (!container) {
      console.warn('TradingView container not found');
      return;
    }

    // Check if TradingView is available
    if (typeof TradingView === 'undefined') {
      console.warn('TradingView library not loaded');
      this.showFallbackChart();
      return;
    }

    try {
      this.widget = new TradingView.widget({
        container_id: 'tradingview-chart',
        width: '100%',
        height: 600,
        symbol: this.currentSymbol,
        interval: this.currentInterval,
        timezone: this.settings.timezone,
        theme: this.settings.theme,
        style: this.settings.style,
        locale: this.settings.locale,
        toolbar_bg: this.settings.toolbar_bg,
        enable_publishing: this.settings.enable_publishing,
        allow_symbol_change: this.settings.allow_symbol_change,
        studies: this.settings.studies,
        details: this.settings.details,
        hotlist: this.settings.hotlist,
        calendar: this.settings.calendar,
        hide_side_toolbar: false,
        hide_legend: false,
        save_image: true,
        disabled_features: [
          'header_symbol_search',
          'header_compare',
          'header_screenshot',
          'header_undo_redo',
        ],
        enabled_features: [
          'side_toolbar_in_fullscreen_mode',
          'keep_left_toolbar_visible_on_small_screens',
        ],
        overrides: {
          'paneProperties.background': '#1a1f2e',
          'paneProperties.vertGridProperties.color': '#2a2f3e',
          'paneProperties.horzGridProperties.color': '#2a2f3e',
          'symbolWatermarkProperties.transparency': 90,
          'scalesProperties.textColor': '#9ca3af',
          'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
          'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
        },
      });

      // Wait for chart to be ready
      this.widget.onChartReady(() => {
        this.chartReady = true;
        this.setupChartFeatures();
        this.updateMarketInfo();
        console.log('TradingView chart initialized successfully');
      });
    } catch (error) {
      console.error('Error initializing TradingView:', error);
      this.showFallbackChart();
    }
  }

  showFallbackChart() {
    const container = document.getElementById('tradingview-chart');
    if (!container) return;

    // Create a simple canvas-based chart as fallback
    container.innerHTML = `
            <div class="flex items-center justify-center h-full bg-eternum-gray rounded-lg">
                <div class="text-center">
                    <div class="text-4xl mb-4">📊</div>
                    <h3 class="text-lg font-semibold text-white mb-2">TradingView Chart</h3>
                    <p class="text-gray-400 mb-4">Real-time charting with advanced features</p>
                    <div class="space-y-2">
                        <div class="text-sm text-gray-300">Symbol: ${this.currentSymbol}</div>
                        <div class="text-sm text-gray-300">Interval: ${this.currentInterval}</div>
                        <div class="text-xs text-gray-400 mt-4">
                            Chart features available when TradingView is loaded
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  setupChartFeatures() {
    if (!this.widget || !this.chartReady) return;

    // Add custom drawing tools
    this.widget.chart().createStudy('Trend Line', false, false);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.changeInterval('1D');
            break;
          case '2':
            e.preventDefault();
            this.changeInterval('60');
            break;
          case '3':
            e.preventDefault();
            this.changeInterval('15');
            break;
        }
      }
    });
  }

  changeSymbol(symbol) {
    if (!symbol) return;

    this.currentSymbol = symbol;

    if (this.widget && this.chartReady) {
      this.widget.chart().setSymbol(symbol, () => {
        this.updateMarketInfo();
        console.log(`Symbol changed to: ${symbol}`);
      });
    }

    // Update position calculator if available
    this.updatePositionCalculator();
  }

  changeInterval(interval) {
    if (!interval) return;

    this.currentInterval = interval;

    if (this.widget && this.chartReady) {
      this.widget.chart().setResolution(interval, () => {
        console.log(`Interval changed to: ${interval}`);
      });
    }

    // Update active period button
    document.querySelectorAll('.chart-period-btn').forEach((btn) => {
      btn.classList.remove('active', 'bg-eternum-blue', 'text-white');
      btn.classList.add('text-gray-400');
    });

    const activeBtn = document.querySelector(`[data-period="${interval}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active', 'bg-eternum-blue', 'text-white');
      activeBtn.classList.remove('text-gray-400');
    }
  }

  changePeriod(period) {
    // Convert period to TradingView interval
    const periodMap = {
      '7d': '1D',
      '30d': '1D',
      '90d': '1D',
      '1y': '1W',
    };

    if (periodMap[period]) {
      this.changeInterval(periodMap[period]);
    }
  }

  toggleDrawingTools() {
    if (this.widget && this.chartReady) {
      this.widget.chart().executeActionById('drawingToolbarAction');
      this.showNotification('Drawing tools toggled', 'info');
    }
  }

  showIndicatorMenu() {
    const menu = document.createElement('div');
    menu.className = 'fixed z-50 glass-effect rounded-lg p-4 shadow-lg';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.maxHeight = '400px';
    menu.style.overflowY = 'auto';

    menu.innerHTML = `
            <h3 class="text-lg font-semibold mb-4">Add Indicator</h3>
            <div class="space-y-2">
                ${this.indicators
                  .map(
                    (indicator) => `
                    <button class="w-full text-left p-2 rounded-lg hover:bg-eternum-light-gray transition-colors" 
                            onclick="window.tradingView.addIndicator('${indicator.id}')">
                        <div class="font-medium">${indicator.name}</div>
                        <div class="text-xs text-gray-400">${indicator.type}</div>
                    </button>
                `
                  )
                  .join('')}
            </div>
            <button class="w-full mt-4 glass-effect px-4 py-2 rounded-lg hover:bg-eternum-light-gray transition-colors" 
                    onclick="this.parentElement.remove()">
                Cancel
            </button>
        `;

    document.body.appendChild(menu);

    // Close on backdrop click
    menu.addEventListener('click', (e) => {
      if (e.target === menu) {
        menu.remove();
      }
    });
  }

  addIndicator(indicatorId) {
    if (this.widget && this.chartReady) {
      this.widget.chart().createStudy(indicatorId, false, false);
      this.showNotification(`${indicatorId} indicator added`, 'success');
    }

    // Remove the menu
    const menu = document.querySelector('.fixed.z-50.glass-effect');
    if (menu) menu.remove();
  }

  toggleFullscreen() {
    const container = document.getElementById('tradingview-chart');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        container.style.height = '100vh';
        if (this.widget) {
          this.widget.options.height = window.innerHeight;
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        container.style.height = '600px';
        if (this.widget) {
          this.widget.options.height = 600;
        }
      });
    }
  }

  updateMarketInfo() {
    // Update market information display
    const symbolInfo = this.getSymbolInfo(this.currentSymbol);
    if (!symbolInfo) return;

    // Simulate price updates (in real implementation, use real-time data)
    const price = this.simulatePrice(symbolInfo);
    const change = (Math.random() - 0.5) * 0.02; // ±1% change
    const changePercent = (change * 100).toFixed(2);
    const volume = Math.random() * 1000000;

    // Update DOM elements
    this.updateElement('current-price', price.toFixed(4));
    this.updateElement('price-change', `${change >= 0 ? '+' : ''}${changePercent}%`);
    this.updateElement('volume', this.formatVolume(volume));

    // Update price color
    const priceElement = document.getElementById('price-change');
    if (priceElement) {
      priceElement.className = `font-mono ${
        change >= 0 ? 'text-eternum-green' : 'text-eternum-red'
      }`;
    }
  }

  updatePositionCalculator() {
    // Update position calculator with current symbol info
    const symbolInfo = this.getSymbolInfo(this.currentSymbol);
    if (!symbolInfo || !window.marketDataManager) return;

    const price = window.marketDataManager.simulatePrice(symbolInfo.symbol);

    // Update any position calculator fields if needed
    console.log(`Current ${symbolInfo.name} price: ${price}`);
  }

  startPriceUpdates() {
    // Update market info every 5 seconds
    setInterval(() => {
      if (this.isInitialized) {
        this.updateMarketInfo();
      }
    }, 5000);
  }

  // Utility methods
  getSymbolInfo(symbol) {
    for (const category of Object.values(this.symbols)) {
      const found = category.find((s) => s.symbol === symbol);
      if (found) return found;
    }
    return null;
  }

  simulatePrice(symbolInfo) {
    // Simulate realistic price movements
    const basePrices = {
      'FX_IDC:EURUSD': 1.085,
      'FX_IDC:GBPUSD': 1.265,
      'FX_IDC:USDJPY': 150.5,
      'COINBASE:BTCUSD': 45000,
      'COINBASE:ETHUSD': 3000,
      'NASDAQ:AAPL': 175.5,
      'NASDAQ:TSLA': 250.0,
    };

    const basePrice = basePrices[symbolInfo.symbol] || 100;
    const volatility = 0.001; // 0.1% volatility
    const change = (Math.random() - 0.5) * 2 * volatility;

    return basePrice * (1 + change);
  }

  formatVolume(volume) {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toFixed(0);
  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  showNotification(message, type = 'info') {
    // Use app's notification system if available
    if (window.app && window.app.showNotification) {
      window.app.showNotification(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API methods
  getCurrentSymbol() {
    return this.currentSymbol;
  }

  getCurrentInterval() {
    return this.currentInterval;
  }

  isChartReady() {
    return this.chartReady;
  }

  addSymbolToWatchlist(symbol) {
    // Add symbol to watchlist functionality
    this.showNotification(`${symbol} added to watchlist`, 'success');
  }

  takeScreenshot() {
    if (this.widget && this.chartReady) {
      this.widget.takeScreenshot().then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `chart-${this.currentSymbol}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        this.showNotification('Chart screenshot saved', 'success');
      });
    }
  }

  shareChart() {
    if (this.widget && this.chartReady) {
      this.widget.chart().executeActionById('shareChart');
    }
  }

  // Chart templates and layouts
  loadTemplate(templateName) {
    const templates = {
      'trend-following': {
        studies: ['MASimple@tv-basicstudies', 'ADX@tv-basicstudies'],
        interval: '1D',
      },
      'swing-trading': {
        studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
        interval: '4h',
      },
      scalping: {
        studies: ['Stochastic@tv-basicstudies', 'BB@tv-basicstudies'],
        interval: '5',
      },
    };

    const template = templates[templateName];
    if (template && this.widget && this.chartReady) {
      this.changeInterval(template.interval);

      // Remove existing studies
      this.widget
        .chart()
        .getStudies()
        .forEach((study) => {
          this.widget.chart().removeStudy(study.id);
        });

      // Add template studies
      template.studies.forEach((studyId) => {
        this.widget.chart().createStudy(studyId, false, false);
      });

      this.showNotification(`${templateName} template loaded`, 'success');
    }
  }
}

// Initialize TradingView Enhanced when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tradingview-chart')) {
    window.tradingView = new TradingViewEnhanced();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TradingViewEnhanced };
}
