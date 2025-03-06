
import React from "react";
import { Check, ChevronRight, Target } from "lucide-react";
import { Strategy } from "@/lib/types";

interface StrategyListProps {
  strategies: Strategy[];
  selectedStrategy: Strategy | null;
  onSelectStrategy: (strategy: Strategy) => void;
}

export const StrategyList = ({ 
  strategies, 
  selectedStrategy, 
  onSelectStrategy 
}: StrategyListProps) => {
  return (
    <div className="glass-card p-4 lg:col-span-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Strategy List</h2>
        <span className="text-xs text-muted-foreground">{strategies.length} strategies</span>
      </div>
      
      <div className="space-y-2">
        {strategies.map((strategy) => (
          <div 
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy)}
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
  );
};
