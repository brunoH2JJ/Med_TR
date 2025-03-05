
import { Trade } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface TradeCardProps {
  trade: Trade;
  className?: string;
}

export function TradeCard({ trade, className }: TradeCardProps) {
  const isProfit = trade.status === "win";
  const isOpen = trade.status === "open";
  
  return (
    <div className={cn(
      "glass-card overflow-hidden transition-all duration-300 hover:shadow-elegant",
      className
    )}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{trade.symbol}</h3>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                trade.direction === "long" 
                  ? "bg-success/10 text-success" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {trade.direction === "long" ? (
                  <span className="flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" />
                    Long
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" />
                    Short
                  </span>
                )}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{trade.strategy}</span>
          </div>
          
          <div className={cn(
            "text-sm font-medium px-2 py-1 rounded",
            isProfit 
              ? "bg-success/10 text-success" 
              : isOpen 
                ? "bg-muted text-muted-foreground" 
                : "bg-destructive/10 text-destructive"
          )}>
            {isOpen ? "OPEN" : (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {trade.pnlPercentage?.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Entry:</span>{" "}
            <span className="font-medium">{trade.entryPrice}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Exit:</span>{" "}
            <span className="font-medium">{trade.exitPrice || "Open"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Stop Loss:</span>{" "}
            <span className="font-medium">{trade.stopLoss}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Take Profit:</span>{" "}
            <span className="font-medium">{trade.takeProfit}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>
            {format(new Date(trade.entryDate), "MMM d, yyyy")}
            {trade.exitDate && ` - ${format(new Date(trade.exitDate), "MMM d, yyyy")}`}
          </span>
        </div>
        
        {trade.tags && trade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {trade.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {trade.notes && (
          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{trade.notes}</p>
        )}
      </div>
      
      {trade.setupImage && (
        <div className="border-t border-border/50 p-2">
          <div className="relative aspect-video rounded overflow-hidden bg-muted">
            <img 
              src={trade.setupImage} 
              alt={`${trade.symbol} chart setup`} 
              className="w-full h-full object-cover"
            />
            <a 
              href={trade.setupImage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-2 right-2 p-1 bg-background/80 backdrop-blur-sm rounded text-foreground hover:bg-background/90 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
