export const MARKETS = {
  forex: {
    name: "Forex",
    symbols: ["EURUSD","GBPUSD","USDJPY","AUDUSD","USDCAD","USDCHF","NZDUSD","EURJPY","GBPJPY","CHFJPY","AUDJPY","CADJPY","CHFJPY","NZDJPY","AUDCAD","AUDNZD","CADCHF","EURAUD","EURCAD"]
  },
  crypto: {
    name: "Crypto", 
    symbols: ["BTCUSD","ETHUSD","SOLUSD","BNBUSD","XRPUSD","ADAUSD","DOGEUSD","MATICUSD","AVAXUSD","LTCUSD","ATOMUSD","SHIBUSDT"]
  },
  stocks: {
    name: "Stocks",
    symbols: ["AAPL","NVDA","TSLA","AMZN","MSFT","GOOGL","META","NFLX","AMD","JPM","BAC","JNJ","WMT","HD","V","PG"]
  },
  indices: {
    name: "Indices",
    symbols: ["SPX","NDX","DJI","RUT","VIX","FTSE","DAX","NKY","HSI"]
  },
  commodities: {
    name: "Commodities", 
    symbols: ["XAUUSD","XAGUSD","CL","NG","ZC","ZW","ZS"]
  }
} as const;

export type MarketKey = keyof typeof MARKETS;