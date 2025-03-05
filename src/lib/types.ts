
export type TradeStatus = 'win' | 'loss' | 'open';

export type TradeDirection = 'long' | 'short';

export type Trade = {
  id: string;
  symbol: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  entryDate: string;
  exitDate?: string;
  status: TradeStatus;
  pnl?: number;
  pnlPercentage?: number;
  notes?: string;
  tags?: string[];
  strategy: string;
  setupImage?: string;
  chartTimeframe: string;
};

export type Strategy = {
  id: string;
  name: string;
  description: string;
  rules: string[];
  entryConditions: string[];
  exitConditions: string[];
  timeframes: string[];
  markets: string[];
  riskRewardRatio: number;
  winRate?: number;
  avgPnL?: number;
};

export type StrategyPerformance = {
  strategyId: string;
  strategyName: string;
  totalTrades: number;
  winRate: number;
  avgPnL: number;
  profitFactor: number;
  maxDrawdown: number;
};

export type TimeframePerformance = {
  timeframe: string;
  totalTrades: number;
  winRate: number;
  avgPnL: number;
};

export type MarketPerformance = {
  market: string;
  totalTrades: number;
  winRate: number;
  avgPnL: number;
};

export type DashboardStats = {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  bestTrade: number;
  worstTrade: number;
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
};
