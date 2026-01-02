/**
 * Trade Entity Model
 * Represents a single trade with all associated data
 */

class Trade {
  constructor(data = {}) {
    this.id = data.id || `trade_${Date.now()}`;
    this.date = data.date || new Date().toISOString();
    this.symbol = data.symbol || '';
    this.market = data.market || this.getMarketType(data.symbol);
    this.direction = data.direction || 'long'; // 'long' or 'short'

    // Price data
    this.entryPrice = parseFloat(data.entryPrice) || 0;
    this.exitPrice = parseFloat(data.exitPrice) || 0;
    this.stopLoss = parseFloat(data.stopLoss) || 0;
    this.takeProfit = parseFloat(data.takeProfit) || 0;

    // Size and risk
    this.positionSize = parseFloat(data.positionSize) || 1.0;
    this.pnl = parseFloat(data.pnl) || this.calculatePnL();
    this.pips = data.pips || this.calculatePips();
    this.outcome = data.outcome || this.determineOutcome();
    this.returnPercent = this.calculateReturnPercent();

    // Strategy and timing
    this.strategy = data.strategy || '';
    this.timeframe = data.timeframe || '';
    this.duration = data.duration || null; // time in trade in milliseconds

    // Psychology
    this.preEmotion = data.preEmotion || '';
    this.postEmotion = data.postEmotion || '';
    this.notes = data.notes || '';

    // Metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.tags = data.tags || [];
  }

  /**
   * Calculate P&L based on direction and prices
   */
  calculatePnL() {
    if (this.direction === 'long') {
      return (this.exitPrice - this.entryPrice) * this.positionSize;
    } else {
      return (this.entryPrice - this.exitPrice) * this.positionSize;
    }
  }

  /**
   * Calculate pips moved
   */
  calculatePips() {
    const pipValue = this.symbol.includes('JPY') ? 0.01 : 0.0001;
    return Math.abs(this.exitPrice - this.entryPrice) / pipValue;
  }

  /**
   * Determine trade outcome
   */
  determineOutcome() {
    if (this.pnl > 0) return 'win';
    if (this.pnl < 0) return 'loss';
    return 'break-even';
  }

  /**
   * Calculate return percentage
   */
  calculateReturnPercent() {
    if (this.entryPrice === 0) return 0;
    const returnAmount = this.pnl / (this.entryPrice * this.positionSize);
    return returnAmount * 100;
  }

  /**
   * Determine market type from symbol
   */
  getMarketType(symbol) {
    if (!symbol) return '';

    const upperSymbol = symbol.toUpperCase();
    if (
      upperSymbol.includes('USD') ||
      upperSymbol.includes('JPY') ||
      upperSymbol.includes('EUR') ||
      upperSymbol.includes('GBP')
    ) {
      return 'forex';
    }
    if (
      upperSymbol.includes('BTC') ||
      upperSymbol.includes('ETH') ||
      upperSymbol.includes('XRP') ||
      upperSymbol.includes('USDT')
    ) {
      return 'crypto';
    }
    if (upperSymbol.match(/^[A-Z]{1,5}$/) && !upperSymbol.includes('USD')) {
      return 'stocks';
    }
    if (
      upperSymbol.includes('SPX') ||
      upperSymbol.includes('DAX') ||
      upperSymbol.includes('FTSE')
    ) {
      return 'indices';
    }
    if (upperSymbol.includes('GC') || upperSymbol.includes('CL') || upperSymbol.includes('NG')) {
      return 'commodities';
    }

    return 'other';
  }

  /**
   * Calculate risk:reward ratio
   */
  getRiskRewardRatio() {
    if (this.stopLoss === 0) return 0;

    const risk = Math.abs(this.entryPrice - this.stopLoss);
    const reward = Math.abs(this.takeProfit - this.entryPrice);

    return risk > 0 ? reward / risk : 0;
  }

  /**
   * Validate trade data
   */
  validate() {
    const errors = [];

    if (!this.symbol) errors.push('Symbol is required');
    if (!this.direction) errors.push('Direction is required');
    if (this.entryPrice <= 0) errors.push('Entry price must be greater than 0');
    if (this.exitPrice <= 0) errors.push('Exit price must be greater than 0');
    if (this.positionSize <= 0) errors.push('Position size must be greater than 0');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export trade as object
   */
  toJSON() {
    return {
      id: this.id,
      date: this.date,
      symbol: this.symbol,
      market: this.market,
      direction: this.direction,
      entryPrice: this.entryPrice,
      exitPrice: this.exitPrice,
      stopLoss: this.stopLoss,
      takeProfit: this.takeProfit,
      positionSize: this.positionSize,
      pnl: this.pnl,
      pips: this.pips,
      outcome: this.outcome,
      returnPercent: this.returnPercent,
      strategy: this.strategy,
      timeframe: this.timeframe,
      duration: this.duration,
      preEmotion: this.preEmotion,
      postEmotion: this.postEmotion,
      notes: this.notes,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create trade from JSON
   */
  static fromJSON(data) {
    return new Trade(data);
  }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Trade;
}
