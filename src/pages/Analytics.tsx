
import { Navbar } from "@/components/layout/Navbar";
import { 
  mockStrategyPerformance, 
  mockTimeframePerformance, 
  mockMarketPerformance,
  mockTrades 
} from "@/lib/tradeData";
import { useState } from "react";
import { BarChart, BarChart3, Filter, LineChart, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

const COLORS = ['#3f83f8', '#0e9f6e', '#e74694', '#8b5cf6', '#f05252', '#ff5a1f'];

const Analytics = () => {
  const [period, setPeriod] = useState("all");
  
  // Calculate win/loss data for pie chart
  const winLossData = [
    { name: 'Wins', value: mockTrades.filter(t => t.status === 'win').length },
    { name: 'Losses', value: mockTrades.filter(t => t.status === 'loss').length },
  ];
  
  // Format data for bar chart
  const strategyBarData = mockStrategyPerformance.map(strategy => ({
    name: strategy.strategyName,
    winRate: strategy.winRate,
    avgPnL: strategy.avgPnL,
    profitFactor: strategy.profitFactor,
  }));
  
  // Format data for line chart
  const pnlData = mockTrades
    .filter(t => t.status !== 'open')
    .map((trade, index) => ({
      name: index + 1,
      pnl: trade.pnlPercentage,
      symbol: trade.symbol,
    }));
  
  // Calculate cumulative P&L
  const cumulativePnlData = [];
  let cumulative = 0;

  mockTrades
    .filter(t => t.status !== 'open')
    .forEach((trade, index) => {
      if (trade.pnlPercentage) {
        cumulative += trade.pnlPercentage;
        cumulativePnlData.push({
          name: index + 1,
          cumulative,
          symbol: trade.symbol,
        });
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-10 mx-auto max-w-7xl animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Analyze your trading performance with comprehensive metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs 
              value={period} 
              onValueChange={setPeriod}
              className="w-[400px]"
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="all">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Win/Loss Ratio</CardTitle>
              <CardDescription>Distribution of winning and losing trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0e9f6e' : '#f05252'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">P&L by Trade</CardTitle>
              <CardDescription>Profit/loss percentage per trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={pnlData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(2)}%`, 'P&L']}
                      labelFormatter={(label) => `Trade #${label}`}
                    />
                    <Bar 
                      dataKey="pnl" 
                      fill="#3f83f8" 
                      radius={[4, 4, 0, 0]}
                      stackId="a"
                      name="P&L %"
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Cumulative P&L</CardTitle>
              <CardDescription>Running total of profit/loss</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={cumulativePnlData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toFixed(2)}%`, 'Cumulative P&L']}
                      labelFormatter={(label) => `Trade #${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulative" 
                      stroke="#3f83f8" 
                      strokeWidth={2} 
                      dot={{ r: 3 }}
                      name="Cumulative P&L %"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Strategy Performance</CardTitle>
              <CardDescription>Comparison of different trading strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={strategyBarData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#3f83f8" />
                    <Bar dataKey="avgPnL" name="Avg P&L %" fill="#0e9f6e" />
                    <Bar dataKey="profitFactor" name="Profit Factor" fill="#8b5cf6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance by Timeframe</CardTitle>
              <CardDescription>Win rate across different chart timeframes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={mockTimeframePerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="timeframe" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#3f83f8" />
                    <Bar dataKey="avgPnL" name="Avg P&L %" fill="#0e9f6e" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Performance by Market</CardTitle>
              <CardDescription>Win rate across different markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={mockMarketPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="market" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#ff5a1f" />
                    <Bar dataKey="avgPnL" name="Avg P&L %" fill="#e74694" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
