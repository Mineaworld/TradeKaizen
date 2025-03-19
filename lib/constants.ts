// Common trading pairs organized by market type
export const TRADING_PAIRS = {
  // Cryptocurrency pairs
  // crypto: [
  //   "BTC/USD",
  //   "ETH/USD",
  //   "BNB/USD",
  //   "XRP/USD",
  //   "SOL/USD",
  //   "DOGE/USD",
  //   "ADA/USD",
  //   "AVAX/USD",
  //   "MATIC/USD",
  //   "DOT/USD",
  // ],

  // Forex pairs
  forex: [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "AUD/USD",
    "USD/CAD",
    "USD/CHF",
    "NZD/USD",
    "EUR/GBP",
    "GBP/JPY",
    "EUR/JPY",
  ],
  // End of Selection

  // Futures contracts
  futures: [
    "ES", // E-mini S&P 500
    "NQ", // E-mini Nasdaq-100
    "YM", // E-mini Dow
    "RTY", // E-mini Russell 2000
    "CL", // Crude Oil
    "GC", // Gold
    "SI", // Silver
    "ZB", // 30-Year U.S. Treasury Bond
    "ZN", // 10-Year U.S. Treasury Note
    "ZC", // Corn
  ],

  // Indices
  indices: [
    "SPX", // S&P 500
    "NDX", // Nasdaq-100
    "DJI", // Dow Jones Industrial Average
    "RUT", // Russell 2000
    "VIX", // Volatility Index
  ],
};

// Flatten all pairs for use in components that need a single list
export const ALL_TRADING_PAIRS = [
  ...TRADING_PAIRS.forex,
  ...TRADING_PAIRS.futures,
  ...TRADING_PAIRS.indices,
];
