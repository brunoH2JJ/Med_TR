
import { Trade, Strategy, DashboardStats, StrategyPerformance, TimeframePerformance, MarketPerformance } from './types';

export const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    direction: 'long',
    entryPrice: 170.25,
    exitPrice: 175.50,
    stopLoss: 168.00,
    takeProfit: 178.00,
    quantity: 10,
    entryDate: '2023-10-15T09:30:00Z',
    exitDate: '2023-10-15T14:30:00Z',
    status: 'win',
    pnl: 52.5,
    pnlPercentage: 3.08,
    notes: 'Bought after positive earnings. Clean breakout above resistance.',
    tags: ['breakout', 'earnings'],
    strategy: 'Breakout Strategy',
    setupImage: 'https://i.imgur.com/GcbCr1r.png',
    chartTimeframe: '1h'
  },
  {
    id: '2',
    symbol: 'MSFT',
    direction: 'long',
    entryPrice: 330.75,
    exitPrice: 325.10,
    stopLoss: 325.00,
    takeProfit: 340.00,
    quantity: 5,
    entryDate: '2023-10-18T10:15:00Z',
    exitDate: '2023-10-18T15:45:00Z',
    status: 'loss',
    pnl: -28.25,
    pnlPercentage: -1.71,
    notes: 'Failed breakout attempt. Market sentiment shifted during the day.',
    tags: ['breakout', 'failed'],
    strategy: 'Breakout Strategy',
    setupImage: 'https://i.imgur.com/RJgzpzD.png',
    chartTimeframe: '1d'
  },
  {
    id: '3',
    symbol: 'TSLA',
    direction: 'short',
    entryPrice: 242.50,
    stopLoss: 248.00,
    takeProfit: 230.00,
    quantity: 8,
    entryDate: '2023-10-20T11:00:00Z',
    status: 'open',
    notes: 'Short at resistance after double top formation.',
    tags: ['resistance', 'pattern'],
    strategy: 'Technical Pattern',
    setupImage: 'https://i.imgur.com/m6dk0Uz.png',
    chartTimeframe: '4h'
  },
  {
    id: '4',
    symbol: 'AMZN',
    direction: 'long',
    entryPrice: 132.75,
    exitPrice: 138.20,
    stopLoss: 130.00,
    takeProfit: 140.00,
    quantity: 15,
    entryDate: '2023-10-12T09:45:00Z',
    exitDate: '2023-10-14T16:00:00Z',
    status: 'win',
    pnl: 81.75,
    pnlPercentage: 4.11,
    notes: 'Strong support bounce with high volume.',
    tags: ['support', 'volume'],
    strategy: 'Support Bounce',
    setupImage: 'https://i.imgur.com/NXp4Y1c.png',
    chartTimeframe: '1d'
  },
  {
    id: '5',
    symbol: 'META',
    direction: 'short',
    entryPrice: 318.25,
    exitPrice: 312.50,
    stopLoss: 322.00,
    takeProfit: 310.00,
    quantity: 10,
    entryDate: '2023-10-17T13:30:00Z',
    exitDate: '2023-10-17T15:45:00Z',
    status: 'win',
    pnl: 57.5,
    pnlPercentage: 1.81,
    notes: 'Short after bearish engulfing pattern at resistance.',
    tags: ['pattern', 'resistance'],
    strategy: 'Technical Pattern',
    setupImage: 'https://i.imgur.com/YrGDXuO.png',
    chartTimeframe: '2h'
  }
];

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Breakout Strategy',
    description: 'Trading breakouts of key support and resistance levels with confirmation.',
    rules: [
      'Wait for price to approach key level',
      'Look for consolidation before breakout',
      'Enter on breakout with volume confirmation',
      'Place stop loss below/above the breakout level',
      'Take profit at 2:1 risk-reward ratio minimum'
    ],
    entryConditions: [
      'Price breaks above resistance or below support',
      'Volume increases on breakout',
      'Breakout occurs during favorable market hours',
      'No major news events expected soon'
    ],
    exitConditions: [
      'Price reaches take profit target',
      'Price breaks back below/above breakout level',
      'Momentum indicators show divergence',
      'Time-based exit after 2 days if no clear direction'
    ],
    timeframes: ['1h', '4h', '1d'],
    markets: ['Stocks', 'Forex', 'Crypto'],
    riskRewardRatio: 2.5,
    winRate: 62,
    avgPnL: 1.85
  },
  {
    id: '2',
    name: 'Support Bounce',
    description: 'Trading bounces off strong support levels in uptrends.',
    rules: [
      'Only trade in established uptrends',
      'Wait for price to reach major support level',
      'Look for bullish candlestick patterns',
      'Confirm with increased volume',
      'Risk no more than 1% per trade'
    ],
    entryConditions: [
      'Price touches or slightly penetrates support',
      'Bullish candlestick pattern forms',
      'RSI shows oversold conditions',
      'Volume increases on reversal day'
    ],
    exitConditions: [
      'Price reaches previous swing high',
      'RSI becomes overbought',
      'Bearish candlestick pattern forms',
      'Moving averages cross bearishly'
    ],
    timeframes: ['1h', '4h', '1d'],
    markets: ['Stocks', 'ETFs'],
    riskRewardRatio: 3.0,
    winRate: 58,
    avgPnL: 2.1
  },
  {
    id: '3',
    name: 'Technical Pattern',
    description: 'Trading based on established chart patterns with high probability setups.',
    rules: [
      'Identify chart patterns (head & shoulders, double tops/bottoms, etc.)',
      'Confirm pattern completion before entry',
      'Enter on breakout of pattern boundary',
      'Place stop loss at logical level based on pattern',
      'Take profit based on pattern's measured move'
    ],
    entryConditions: [
      'Pattern fully forms and confirms',
      'Price breaks pattern boundary (neckline, resistance, etc.)',
      'Volume confirms the breakout',
      'Pattern occurs at significant price level'
    ],
    exitConditions: [
      'Price reaches measured move target',
      'Price action shows reversal signs',
      'Time-based exit if trade stalls',
      'Trailing stop after partial profit taking'
    ],
    timeframes: ['4h', '1d', '1w'],
    markets: ['Stocks', 'Forex', 'Commodities', 'Crypto'],
    riskRewardRatio: 2.0,
    winRate: 65,
    avgPnL: 1.7
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTrades: 126,
  winRate: 61.2,
  profitFactor: 1.85,
  avgWin: 2.3,
  avgLoss: -1.2,
  bestTrade: 8.7,
  worstTrade: -3.5,
  currentStreak: 3,
  longestWinStreak: 7,
  longestLossStreak: 4
};

export const mockStrategyPerformance: StrategyPerformance[] = [
  {
    strategyId: '1',
    strategyName: 'Breakout Strategy',
    totalTrades: 58,
    winRate: 62.1,
    avgPnL: 1.85,
    profitFactor: 1.9,
    maxDrawdown: 8.2
  },
  {
    strategyId: '2',
    strategyName: 'Support Bounce',
    totalTrades: 43,
    winRate: 58.5,
    avgPnL: 2.1,
    profitFactor: 1.75,
    maxDrawdown: 9.1
  },
  {
    strategyId: '3',
    strategyName: 'Technical Pattern',
    totalTrades: 25,
    winRate: 65.0,
    avgPnL: 1.7,
    profitFactor: 2.1,
    maxDrawdown: 6.8
  }
];

export const mockTimeframePerformance: TimeframePerformance[] = [
  { timeframe: '15m', totalTrades: 18, winRate: 55.5, avgPnL: 1.2 },
  { timeframe: '1h', totalTrades: 32, winRate: 63.2, avgPnL: 1.8 },
  { timeframe: '4h', totalTrades: 45, winRate: 62.8, avgPnL: 2.1 },
  { timeframe: '1d', totalTrades: 31, winRate: 58.1, avgPnL: 1.9 }
];

export const mockMarketPerformance: MarketPerformance[] = [
  { market: 'Stocks', totalTrades: 73, winRate: 61.8, avgPnL: 1.9 },
  { market: 'Forex', totalTrades: 28, winRate: 58.2, avgPnL: 1.7 },
  { market: 'Crypto', totalTrades: 18, winRate: 65.3, avgPnL: 2.2 },
  { market: 'Commodities', totalTrades: 7, winRate: 59.4, avgPnL: 1.5 }
];
