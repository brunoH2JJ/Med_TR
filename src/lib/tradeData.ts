import { Trade, Strategy, DashboardStats, StrategyPerformance, TimeframePerformance, MarketPerformance } from './types';

// Default data objects
const defaultStrategies: Strategy[] = [
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
      'Take profit based on pattern\'s measured move'
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

// Generic storage utility functions
export const storeData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing ${key} data:`, error);
  }
};

export const retrieveData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} data:`, error);
    return defaultValue;
  }
};

// Strategy-specific storage functions
export const getStoredStrategies = (): Strategy[] => {
  return retrieveData<Strategy[]>('strategies', defaultStrategies);
};

export const saveStrategies = (strategies: Strategy[]): void => {
  storeData('strategies', strategies);
};

// Trades storage functions
export const getStoredTrades = (): Trade[] => {
  return retrieveData<Trade[]>('trades', []);
};

export const saveTrade = (trade: Trade): void => {
  const trades = getStoredTrades();
  trades.push(trade);
  storeData('trades', trades);
};

export const getDefaultTrades = (): Trade[] => {
  return [
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
};

// Calculate dashboard stats based on stored trades
export const calculateDashboardStats = (trades: Trade[]): DashboardStats => {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      bestTrade: 0,
      worstTrade: 0,
      currentStreak: 0,
      longestWinStreak: 0,
      longestLossStreak: 0
    };
  }

  const closedTrades = trades.filter(trade => trade.status !== 'open');
  
  if (closedTrades.length === 0) {
    return {
      totalTrades: trades.length,
      winRate: 0,
      profitFactor: 0,
      avgWin: 0,
      avgLoss: 0,
      bestTrade: 0,
      worstTrade: 0,
      currentStreak: 0,
      longestWinStreak: 0,
      longestLossStreak: 0
    };
  }

  const wins = closedTrades.filter(trade => trade.status === 'win');
  const losses = closedTrades.filter(trade => trade.status === 'loss');
  
  // Calculate win rate
  const winRate = closedTrades.length > 0 
    ? (wins.length / closedTrades.length) * 100 
    : 0;
  
  // Calculate average win and loss percentages
  const avgWin = wins.length > 0 
    ? wins.reduce((sum, trade) => sum + (trade.pnlPercentage || 0), 0) / wins.length 
    : 0;
  
  const avgLoss = losses.length > 0 
    ? losses.reduce((sum, trade) => sum + (trade.pnlPercentage || 0), 0) / losses.length 
    : 0;
  
  // Find best and worst trades
  const pnlPercentages = closedTrades
    .map(trade => trade.pnlPercentage || 0)
    .filter(pnl => !isNaN(pnl));
  
  const bestTrade = pnlPercentages.length > 0 ? Math.max(...pnlPercentages) : 0;
  const worstTrade = pnlPercentages.length > 0 ? Math.min(...pnlPercentages) : 0;
  
  // Calculate profit factor (sum of wins / sum of losses)
  const totalWins = wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const totalLosses = Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? 999 : 0;
  
  // Calculate streaks
  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let tempWinStreak = 0;
  let tempLossStreak = 0;
  
  // Sort trades by date
  const sortedTrades = [...closedTrades].sort((a, b) => 
    new Date(a.exitDate || '').getTime() - new Date(b.exitDate || '').getTime()
  );
  
  for (let i = 0; i < sortedTrades.length; i++) {
    if (sortedTrades[i].status === 'win') {
      tempWinStreak++;
      tempLossStreak = 0;
      currentStreak = tempWinStreak;
    } else {
      tempLossStreak++;
      tempWinStreak = 0;
      currentStreak = -tempLossStreak;
    }
    
    maxWinStreak = Math.max(maxWinStreak, tempWinStreak);
    maxLossStreak = Math.max(maxLossStreak, tempLossStreak);
  }
  
  return {
    totalTrades: trades.length,
    winRate: parseFloat(winRate.toFixed(1)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    bestTrade: parseFloat(bestTrade.toFixed(2)),
    worstTrade: parseFloat(worstTrade.toFixed(2)),
    currentStreak: currentStreak,
    longestWinStreak: maxWinStreak,
    longestLossStreak: maxLossStreak
  };
};

export const mockStrategies = defaultStrategies;
