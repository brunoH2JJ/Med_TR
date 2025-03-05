
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { TradeCard } from "@/components/ui/TradeCard";
import { mockDashboardStats, mockTrades } from "@/lib/tradeData";
import { AreaChart, BarChart2, DollarSign, Percent, TrendingUp, Award, Calendar, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("recent");
  const recentTrades = mockTrades.slice(0, 3);

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
            value={mockDashboardStats.totalTrades} 
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <StatCard 
            title="Win Rate" 
            value={`${mockDashboardStats.winRate}%`} 
            icon={<Percent className="h-4 w-4" />}
            trend={mockDashboardStats.winRate > 50 ? "up" : "down"}
          />
          <StatCard 
            title="Profit Factor" 
            value={mockDashboardStats.profitFactor} 
            icon={<DollarSign className="h-4 w-4" />}
            trend={mockDashboardStats.profitFactor > 1 ? "up" : "down"}
          />
          <StatCard 
            title="Best Trade" 
            value={`${mockDashboardStats.bestTrade}%`} 
            icon={<TrendingUp className="h-4 w-4" />}
            trend="up"
          />
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Current Streak" 
            value={`${mockDashboardStats.currentStreak} wins`}
            icon={<Award className="h-4 w-4" />}
            trend="up"
          />
          <StatCard 
            title="Longest Win Streak" 
            value={mockDashboardStats.longestWinStreak}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard 
            title="Avg Win / Avg Loss" 
            value={`${mockDashboardStats.avgWin}% / ${Math.abs(mockDashboardStats.avgLoss)}%`}
            icon={<AreaChart className="h-4 w-4" />}
            description={`Ratio: ${(mockDashboardStats.avgWin / Math.abs(mockDashboardStats.avgLoss)).toFixed(2)}`}
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
                  {recentTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="open" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTrades.filter(t => t.status === 'open').map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="closed" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTrades.filter(t => t.status !== 'open').map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
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
