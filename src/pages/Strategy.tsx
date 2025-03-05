
import { Navbar } from "@/components/layout/Navbar";
import { mockStrategies, mockStrategyPerformance } from "@/lib/tradeData";
import { Strategy } from "@/lib/types";
import { useState } from "react";
import { 
  BarChart3, 
  Check, 
  ChevronRight, 
  Clock, 
  Edit, 
  Plus, 
  Target, 
  TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StrategyPage = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(mockStrategies[0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-10 mx-auto max-w-7xl animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Strategies</h1>
            <p className="text-muted-foreground mt-1">
              Define and track your trading strategies.
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-4 lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Strategy List</h2>
              <span className="text-xs text-muted-foreground">{mockStrategies.length} strategies</span>
            </div>
            
            <div className="space-y-2">
              {mockStrategies.map((strategy) => (
                <div 
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy)}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                    selectedStrategy?.id === strategy.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {selectedStrategy?.id === strategy.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Target className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{strategy.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Win Rate: {strategy.winRate}%
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {selectedStrategy && (
              <>
                <div className="glass-card p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">{selectedStrategy.name}</h2>
                      <p className="text-muted-foreground">{selectedStrategy.description}</p>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="rules">
                    <TabsList className="mb-4">
                      <TabsTrigger value="rules">Rules</TabsTrigger>
                      <TabsTrigger value="conditions">Conditions</TabsTrigger>
                      <TabsTrigger value="markets">Markets</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="rules" className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Trading Rules</h3>
                        <ul className="space-y-2">
                          {selectedStrategy.rules.map((rule, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk/Reward</h3>
                        <div className="bg-secondary p-3 rounded-md">
                          <div className="flex items-center justify-between">
                            <span>Target Ratio:</span>
                            <span className="font-medium">1:{selectedStrategy.riskRewardRatio}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="conditions" className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Entry Conditions</h3>
                        <ul className="space-y-2">
                          {selectedStrategy.entryConditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-success/10 text-success rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                                <TrendingUp className="h-3 w-3" />
                              </span>
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Exit Conditions</h3>
                        <ul className="space-y-2">
                          {selectedStrategy.exitConditions.map((condition, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-destructive/10 text-destructive rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                                <BarChart3 className="h-3 w-3" />
                              </span>
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="markets" className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Suitable Markets</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedStrategy.markets.map((market, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                            >
                              {market}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeframes</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedStrategy.timeframes.map((timeframe, index) => (
                            <span 
                              key={index}
                              className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm"
                            >
                              <Clock className="h-3 w-3 mr-1.5" />
                              {timeframe}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4">
                      {mockStrategyPerformance
                        .filter(perf => perf.strategyId === selectedStrategy.id)
                        .map(performance => (
                          <div key={performance.strategyId} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{performance.winRate}%</div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{performance.totalTrades}</div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm font-medium">Avg. P&L</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{performance.avgPnL}%</div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{performance.profitFactor}</div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrategyPage;
