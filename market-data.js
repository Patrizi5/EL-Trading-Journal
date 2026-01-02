/**
 * Eternum Trading Journal - Market Data and Utilities
 * Comprehensive market definitions, trading utilities, and data management
 */

class MarketDataManager {
  constructor() {
    this.markets = this.initializeMarkets();
    this.strategies = this.initializeStrategies();
    this.emotions = this.initializeEmotions();
    this.timeframes = this.initializeTimeframes();
    this.currencies = this.initializeCurrencies();
  }

  initializeMarkets() {
    return {
      forex: {
        name: 'Forex',
        icon: '💱',
        pairs: {
          EURUSD: { name: 'EUR/USD', spread: 0.0001, pipValue: 0.0001 },
          GBPUSD: { name: 'GBP/USD', spread: 0.0002, pipValue: 0.0001 },
          USDJPY: { name: 'USD/JPY', spread: 0.01, pipValue: 0.01 },
          AUDUSD: { name: 'AUD/USD', spread: 0.0002, pipValue: 0.0001 },
          USDCHF: { name: 'USD/CHF', spread: 0.0002, pipValue: 0.0001 },
          USDCAD: { name: 'USD/CAD', spread: 0.0003, pipValue: 0.0001 },
          EURGBP: { name: 'EUR/GBP', spread: 0.0002, pipValue: 0.0001 },
          EURJPY: { name: 'EUR/JPY', spread: 0.01, pipValue: 0.01 },
        },
      },
      crypto: {
        name: 'Cryptocurrency',
        icon: '₿',
        pairs: {
          BTCUSD: { name: 'Bitcoin/USD', spread: 0.01, pipValue: 0.01 },
          ETHUSD: { name: 'Ethereum/USD', spread: 0.01, pipValue: 0.01 },
          XRPUSD: { name: 'Ripple/USD', spread: 0.0001, pipValue: 0.0001 },
          LTCUSD: { name: 'Litecoin/USD', spread: 0.01, pipValue: 0.01 },
          ADAUSD: { name: 'Cardano/USD', spread: 0.0001, pipValue: 0.0001 },
          DOTUSD: { name: 'Polkadot/USD', spread: 0.01, pipValue: 0.01 },
          LINKUSD: { name: 'Chainlink/USD', spread: 0.01, pipValue: 0.01 },
        },
      },
      stocks: {
        name: 'Stocks',
        icon: '📈',
        pairs: {
          AAPL: { name: 'Apple Inc.', spread: 0.01, pipValue: 0.01 },
          TSLA: { name: 'Tesla Inc.', spread: 0.01, pipValue: 0.01 },
          MSFT: { name: 'Microsoft Corp.', spread: 0.01, pipValue: 0.01 },
          GOOGL: { name: 'Alphabet Inc.', spread: 0.01, pipValue: 0.01 },
          AMZN: { name: 'Amazon.com Inc.', spread: 0.01, pipValue: 0.01 },
          NFLX: { name: 'Netflix Inc.', spread: 0.01, pipValue: 0.01 },
          NVDA: { name: 'NVIDIA Corp.', spread: 0.01, pipValue: 0.01 },
        },
      },
      indices: {
        name: 'Indices',
        icon: '📊',
        pairs: {
          SPX: { name: 'S&P 500', spread: 0.1, pipValue: 0.1 },
          DJI: { name: 'Dow Jones', spread: 1.0, pipValue: 1.0 },
          NDX: { name: 'NASDAQ 100', spread: 1.0, pipValue: 1.0 },
          FTSE: { name: 'FTSE 100', spread: 1.0, pipValue: 1.0 },
          DAX: { name: 'DAX 30', spread: 1.0, pipValue: 1.0 },
          NIKKEI: { name: 'Nikkei 225', spread: 1.0, pipValue: 1.0 },
        },
      },
      commodities: {
        name: 'Commodities',
        icon: '🛢️',
        pairs: {
          XAUUSD: { name: 'Gold/USD', spread: 0.1, pipValue: 0.1 },
          XAGUSD: { name: 'Silver/USD', spread: 0.01, pipValue: 0.01 },
          CLUSD: { name: 'Crude Oil/USD', spread: 0.01, pipValue: 0.01 },
          NGUSD: { name: 'Natural Gas/USD', spread: 0.001, pipValue: 0.001 },
        },
      },
    };
  }

  initializeStrategies() {
    return [
      {
        id: 'swing',
        name: 'Swing Trading',
        description: 'Hold positions for several days to weeks',
      },
      {
        id: 'day',
        name: 'Day Trading',
        description: 'Enter and exit positions within the same day',
      },
      { id: 'scalp', name: 'Scalping', description: 'Very short-term trades, seconds to minutes' },
      {
        id: 'position',
        name: 'Position Trading',
        description: 'Long-term trades, weeks to months',
      },
      { id: 'breakout', name: 'Breakout Trading', description: 'Trade breakouts from key levels' },
      { id: 'trend', name: 'Trend Following', description: 'Follow the prevailing market trend' },
      {
        id: 'contrarian',
        name: 'Contrarian',
        description: 'Trade against the prevailing sentiment',
      },
      {
        id: 'range',
        name: 'Range Trading',
        description: 'Trade within defined support/resistance',
      },
    ];
  }

  initializeEmotions() {
    return {
      preTrade: [
        { id: 'confident', name: 'Confident', color: '#10b981' },
        { id: 'neutral', name: 'Neutral', color: '#6b7280' },
        { id: 'anxious', name: 'Anxious', color: '#f59e0b' },
        { id: 'excited', name: 'Excited', color: '#8b5cf6' },
        { id: 'fearful', name: 'Fearful', color: '#ef4444' },
        { id: 'hesitant', name: 'Hesitant', color: '#f59e0b' },
        { id: 'determined', name: 'Determined', color: '#3b82f6' },
      ],
      postTrade: [
        { id: 'satisfied', name: 'Satisfied', color: '#10b981' },
        { id: 'relieved', name: 'Relieved', color: '#06b6d4' },
        { id: 'disappointed', name: 'Disappointed', color: '#f59e0b' },
        { id: 'frustrated', name: 'Frustrated', color: '#ef4444' },
        { id: 'proud', name: 'Proud', color: '#8b5cf6' },
        { id: 'regretful', name: 'Regretful', color: '#ef4444' },
        { id: 'neutral', name: 'Neutral', color: '#6b7280' },
      ],
    };
  }

  initializeTimeframes() {
    return [
      { id: '1m', name: '1 Minute', minutes: 1 },
      { id: '5m', name: '5 Minutes', minutes: 5 },
      { id: '15m', name: '15 Minutes', minutes: 15 },
      { id: '30m', name: '30 Minutes', minutes: 30 },
      { id: '1h', name: '1 Hour', minutes: 60 },
      { id: '4h', name: '4 Hours', minutes: 240 },
      { id: '1d', name: 'Daily', minutes: 1440 },
      { id: '1w', name: 'Weekly', minutes: 10080 },
    ];
  }

  initializeCurrencies() {
    return {
      USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
      EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
      GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
      JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
      AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
      CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
      CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
      CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
      BTC: { name: 'Bitcoin', symbol: '₿', flag: '₿' },
      ETH: { name: 'Ethereum', symbol: 'Ξ', flag: 'Ξ' },
    };
  }

  // Utility methods
  getMarketCategory(symbol) {
    for (const [category, data] of Object.entries(this.markets)) {
      if (data.pairs[symbol]) {
        return { category, ...data.pairs[symbol] };
      }
    }
    return null;
  }

  getAllSymbols() {
    const symbols = [];
    Object.values(this.markets).forEach((market) => {
      symbols.push(...Object.keys(market.pairs));
    });
    return symbols;
  }

  calculatePipValue(symbol, positionSize = 1) {
    const market = this.getMarketCategory(symbol);
    if (!market) return 0;

    return positionSize * market.pipValue;
  }

  calculatePips(symbol, entryPrice, exitPrice) {
    const market = this.getMarketCategory(symbol);
    if (!market) return 0;

    const difference = Math.abs(exitPrice - entryPrice);
    return difference / market.pipValue;
  }

  formatPrice(symbol, price) {
    const market = this.getMarketCategory(symbol);
    if (!market) return price.toFixed(4);

    // Determine decimal places based on symbol
    if (symbol.includes('JPY') || symbol.includes('XAU')) {
      return price.toFixed(2);
    } else if (symbol.includes('XAG')) {
      return price.toFixed(3);
    } else {
      return price.toFixed(5);
    }
  }

  // Trading calculations
  calculatePositionSize(accountSize, riskPercent, stopLossPips, pipValue) {
    const riskAmount = accountSize * (riskPercent / 100);
    const riskPerPip = riskAmount / stopLossPips;
    const positionSize = riskPerPip / pipValue;

    return {
      positionSize: Math.round(positionSize * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      riskPerPip: Math.round(riskPerPip * 100) / 100,
    };
  }

  calculateRiskReward(entry, stopLoss, takeProfit, isLong = true) {
    if (isLong) {
      const risk = entry - stopLoss;
      const reward = takeProfit - entry;
      return risk > 0 ? reward / risk : 0;
    } else {
      const risk = stopLoss - entry;
      const reward = entry - takeProfit;
      return risk > 0 ? reward / risk : 0;
    }
  }

  // Market data simulation (for demo purposes)
  simulatePrice(symbol, basePrice = null) {
    const market = this.getMarketCategory(symbol);
    if (!market) return basePrice || 1.0;

    if (!basePrice) {
      // Use typical prices for different markets
      switch (market.category) {
        case 'forex':
          basePrice = symbol.includes('JPY') ? 110.0 : 1.2;
          break;
        case 'crypto':
          basePrice = symbol === 'BTCUSD' ? 45000 : 3000;
          break;
        case 'stocks':
          basePrice = 150.0;
          break;
        case 'indices':
          basePrice = 4000.0;
          break;
        case 'commodities':
          basePrice = symbol.includes('XAU') ? 1800 : 25;
          break;
        default:
          basePrice = 1.0;
      }
    }

    // Simulate small price movement
    const volatility = 0.001; // 0.1% volatility
    const change = (Math.random() - 0.5) * 2 * volatility;

    return basePrice * (1 + change);
  }

  // Chart data generation for analytics
  generatePerformanceData(days = 30, startBalance = 10000) {
    const data = [];
    let currentBalance = startBalance;
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simulate daily P&L with some trend
      const trend = 0.0005; // Slight positive trend
      const volatility = 0.02;
      const dailyReturn = trend + (Math.random() - 0.5) * volatility;

      currentBalance *= 1 + dailyReturn;

      data.push({
        date: date.toISOString().split('T')[0],
        balance: Math.round(currentBalance * 100) / 100,
        dailyPnL:
          Math.round(
            (currentBalance - (i === days ? startBalance : data[data.length - 1].balance)) * 100
          ) / 100,
      });
    }

    return data;
  }

  // Generate sample trades for demo
  generateSampleTrades(count = 20) {
    const trades = [];
    const symbols = this.getAllSymbols();
    const strategies = this.strategies.map((s) => s.id);
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 60));

      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const direction = Math.random() > 0.5 ? 'long' : 'short';
      const isWin = Math.random() > 0.4; // 60% win rate

      const market = this.getMarketCategory(symbol);
      const basePrice = this.simulatePrice(symbol);

      let entryPrice, exitPrice, stopLoss, takeProfit;

      if (direction === 'long') {
        entryPrice = basePrice * (0.995 + Math.random() * 0.01);
        stopLoss = entryPrice * 0.98;
        takeProfit = entryPrice * 1.04;

        if (isWin) {
          exitPrice = entryPrice + (takeProfit - entryPrice) * (0.3 + Math.random() * 0.7);
        } else {
          exitPrice = stopLoss + (entryPrice - stopLoss) * Math.random() * 0.5;
        }
      } else {
        entryPrice = basePrice * (1.005 + Math.random() * 0.01);
        stopLoss = entryPrice * 1.02;
        takeProfit = entryPrice * 0.96;

        if (isWin) {
          exitPrice = entryPrice - (entryPrice - takeProfit) * (0.3 + Math.random() * 0.7);
        } else {
          exitPrice = stopLoss - (stopLoss - entryPrice) * Math.random() * 0.5;
        }
      }

      const pips = this.calculatePips(symbol, entryPrice, exitPrice);
      const pnl = (isWin ? 1 : -1) * (Math.random() * 200 + 50);

      trades.push({
        id: `trade_${i + 1}`,
        date: date.toISOString(),
        symbol,
        direction,
        entryPrice: this.formatPrice(symbol, entryPrice),
        exitPrice: this.formatPrice(symbol, exitPrice),
        stopLoss: this.formatPrice(symbol, stopLoss),
        takeProfit: this.formatPrice(symbol, takeProfit),
        positionSize: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
        pips: Math.round(pips),
        pnl: Math.round(pnl * 100) / 100,
        strategy,
        outcome: isWin ? 'win' : 'loss',
        preEmotion:
          this.emotions.preTrade[Math.floor(Math.random() * this.emotions.preTrade.length)].id,
        postEmotion:
          this.emotions.postTrade[Math.floor(Math.random() * this.emotions.postTrade.length)].id,
        notes: `Sample trade ${i + 1} for demonstration purposes`,
      });
    }

    return trades.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

// Initialize market data manager
const marketDataManager = new MarketDataManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MarketDataManager, marketDataManager };
}
