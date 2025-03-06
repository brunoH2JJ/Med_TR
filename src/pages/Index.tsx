
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { TradeCard } from "@/components/ui/TradeCard";
import { getStoredTrades, calculateDashboardStats } from "@/lib/tradeData";
import { AreaChart, BarChart2, DollarSign, Percent, TrendingUp, Award, Calendar, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trade, DashboardStats } from "@/lib/types";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("recent");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
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
  });

  useEffect(() => {
    // Load trades from localStorage
    const storedTrades = getStoredTrades();
    setTrades(storedTrades);
    
    // Calculate stats based on stored trades
    setStats(calculateDashboardStats(storedTrades));
  }, []);

  // Get recent trades (last 3)
  const recentTrades = [...trades].sort((a, b) => {
    const dateA = new Date(a.entryDate).getTime();
    const dateB = new Date(b.entryDate).getTime();
    return dateB - dateA;
  }).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-10 mx-auto max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your trading performance.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Trades" 
            value={stats.totalTrades} 
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <StatCard 
            title="Win Rate" 
            value={`${stats.winRate}%`} 
            icon={<Percent className="h-4 w-4" />}
            trend={stats.winRate > 50 ? "up" : "down"}
          />
          <StatCard 
            title="Profit Factor" 
            value={stats.profitFactor} 
            icon={<DollarSign className="h-4 w-4" />}
            trend={stats.profitFactor > 1 ? "up" : "down"}
          />
          <StatCard 
            title="Best Trade" 
            value={`${stats.bestTrade}%`} 
            icon={<TrendingUp className="h-4 w-4" />}
            trend="up"
          />
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Current Streak" 
            value={`${Math.abs(stats.currentStreak)} ${stats.currentStreak >= 0 ? 'wins' : 'losses'}`}
            icon={<Award className="h-4 w-4" />}
            trend={stats.currentStreak >= 0 ? "up" : "down"}
          />
          <StatCard 
            title="Longest Win Streak" 
            value={stats.longestWinStreak}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard 
            title="Avg Win / Avg Loss" 
            value={`${stats.avgWin}% / ${Math.abs(stats.avgLoss)}%`}
            icon={<AreaChart className="h-4 w-4" />}
            description={stats.avgLoss !== 0 ? `Ratio: ${(stats.avgWin / Math.abs(stats.avgLoss)).toFixed(2)}` : 'N/A'}
          />
        </div>
        
        {/* Trades Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Trades</h2>
            <Tabs 
              defaultValue="recent" 
              value={selectedTab} 
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            
              <TabsContent value="recent" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentTrades.length > 0 ? (
                    recentTrades.map((trade) => (
                      <TradeCard key={trade.id} trade={trade} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No trades entered yet. Start by adding a trade on the "Enter Trade" page.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="open" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trades.filter(t => t.status === 'open').length > 0 ? (
                    trades.filter(t => t.status === 'open').map((trade) => (
                      <TradeCard key={trade.id} trade={trade} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No open trades found.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="closed" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trades.filter(t => t.status !== 'open').length > 0 ? (
                    trades.filter(t => t.status !== 'open').map((trade) => (
                      <TradeCard key={trade.id} trade={trade} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No closed trades found.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
