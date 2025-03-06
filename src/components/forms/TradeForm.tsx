import { useState } from "react";
import { TradingViewChart } from "@/components/charts/TradingViewChart";
import { mockStrategies, saveTrade } from "@/lib/tradeData";
import { Trade, TradeDirection, TradeStatus } from "@/lib/types";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const defaultTrade: Partial<Trade> = {
  symbol: '',
  direction: 'long',
  entryPrice: 0,
  stopLoss: 0,
  takeProfit: 0,
  quantity: 0,
  status: 'open',
  entryDate: new Date().toISOString(),
  chartTimeframe: '1d',
  strategy: '',
};

export function TradeForm() {
  const [trade, setTrade] = useState<Partial<Trade>>(defaultTrade);
  const [preview, setPreview] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (['entryPrice', 'exitPrice', 'stopLoss', 'takeProfit', 'quantity'].includes(name)) {
      setTrade({ ...trade, [name]: parseFloat(value) || 0 });
    } else {
      setTrade({ ...trade, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setTrade({ ...trade, [name]: value });
  };

  const calculatePnL = () => {
    if (!trade.entryPrice || !trade.exitPrice || !trade.quantity) return;
    
    const diff = trade.direction === 'long' 
      ? (trade.exitPrice - trade.entryPrice) 
      : (trade.entryPrice - trade.exitPrice);
    
    const pnl = diff * (trade.quantity || 0);
    const pnlPercentage = (diff / trade.entryPrice) * 100;
    
    setTrade({
      ...trade,
      pnl,
      pnlPercentage,
      status: pnl >= 0 ? 'win' : 'loss'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trade.symbol || !trade.entryPrice || !trade.strategy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (trade.exitPrice) {
      calculatePnL();
    }
    
    const completeTradeData: Trade = {
      id: Date.now().toString(),
      symbol: trade.symbol || '',
      direction: trade.direction as TradeDirection || 'long',
      entryPrice: trade.entryPrice || 0,
      exitPrice: trade.exitPrice,
      stopLoss: trade.stopLoss || 0,
      takeProfit: trade.takeProfit || 0,
      quantity: trade.quantity || 0,
      entryDate: trade.entryDate || new Date().toISOString(),
      exitDate: trade.exitDate,
      status: trade.status as TradeStatus || 'open',
      pnl: trade.pnl || 0,
      pnlPercentage: trade.pnlPercentage || 0,
      notes: trade.notes || '',
      tags: trade.tags || [],
      strategy: trade.strategy || '',
      setupImage: trade.setupImage || '',
      chartTimeframe: trade.chartTimeframe || '1d',
    };
    
    saveTrade(completeTradeData);
    
    toast({
      title: "Trade saved",
      description: `${trade.symbol} ${trade.direction} trade has been saved successfully.`,
    });
    
    console.log("Submitted trade:", completeTradeData);
    
    setTrade(defaultTrade);
    setPreview(false);
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Trade Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  placeholder="AAPL"
                  value={trade.symbol}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select 
                  value={trade.direction} 
                  onValueChange={(value) => handleSelectChange('direction', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price *</Label>
                <Input
                  id="entryPrice"
                  name="entryPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={trade.entryPrice || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  name="exitPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={trade.exitPrice || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss *</Label>
                <Input
                  id="stopLoss"
                  name="stopLoss"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={trade.stopLoss || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit *</Label>
                <Input
                  id="takeProfit"
                  name="takeProfit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={trade.takeProfit || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={trade.quantity || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={trade.status} 
                  onValueChange={(value) => handleSelectChange('status', value as TradeStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy *</Label>
              <Select 
                value={trade.strategy} 
                onValueChange={(value) => handleSelectChange('strategy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {mockStrategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.name}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chartTimeframe">Chart Timeframe</Label>
              <Select 
                value={trade.chartTimeframe} 
                onValueChange={(value) => handleSelectChange('chartTimeframe', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="30m">30 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter your trade notes here..."
                value={trade.notes || ''}
                onChange={handleInputChange}
                className="h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setupImage">Setup Image URL</Label>
              <Input
                id="setupImage"
                name="setupImage"
                placeholder="https://example.com/image.jpg"
                value={trade.setupImage || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Chart Preview</h2>
              
              <div className="rounded-md overflow-hidden border border-border bg-card/50">
                {trade.symbol ? (
                  <TradingViewChart
                    symbol={trade.symbol}
                    interval={trade.chartTimeframe}
                    entryPrice={trade.entryPrice}
                    exitPrice={trade.exitPrice}
                    stopLoss={trade.stopLoss}
                    takeProfit={trade.takeProfit}
                    direction={trade.direction as TradeDirection}
                    height="300px"
                  />
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-muted/30 text-muted-foreground">
                    Enter a symbol to see chart preview
                  </div>
                )}
              </div>
            </div>
            
            {preview && trade.symbol && (
              <div className="glass-card p-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Trade Summary</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="font-medium">{trade.symbol}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Direction:</span>
                    <span className="font-medium capitalize">{trade.direction}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Entry Price:</span>
                    <span className="font-medium">{trade.entryPrice}</span>
                  </div>
                  
                  {trade.exitPrice && (
                    <div className="flex justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">Exit Price:</span>
                      <span className="font-medium">{trade.exitPrice}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Stop Loss:</span>
                    <span className="font-medium">{trade.stopLoss}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Take Profit:</span>
                    <span className="font-medium">{trade.takeProfit}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{trade.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between pb-2 border-b border-border/40">
                    <span className="text-muted-foreground">Strategy:</span>
                    <span className="font-medium">{trade.strategy}</span>
                  </div>
                  
                  {trade.pnl && trade.exitPrice && (
                    <div className="flex justify-between pb-2 border-b border-border/40">
                      <span className="text-muted-foreground">P&L:</span>
                      <span className={`font-medium ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {trade.pnl.toFixed(2)} ({trade.pnlPercentage?.toFixed(2)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              if (trade.exitPrice) calculatePnL();
              setPreview(!preview);
            }}
          >
            {preview ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          
          <Button type="submit">Save Trade</Button>
        </div>
      </form>
    </div>
  );
}
