
import { useState, useEffect } from "react";
import { Strategy } from "@/lib/types";
import { getStoredStrategies, saveStrategies } from "@/lib/tradeData";
import { toast } from "@/components/ui/use-toast";

export const useStrategyData = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  // Load strategies from localStorage on mount
  useEffect(() => {
    const storedStrategies = getStoredStrategies();
    setStrategies(storedStrategies);
    if (storedStrategies.length > 0) {
      setSelectedStrategy(storedStrategies[0]);
    }
  }, []);

  // Handle creating a new strategy
  const handleCreateStrategy = (newStrategyData: Partial<Strategy>) => {
    const newStrategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: newStrategyData.name || "Untitled Strategy",
      description: newStrategyData.description || "",
      rules: newStrategyData.rules || [],
      entryConditions: newStrategyData.entryConditions || [],
      exitConditions: newStrategyData.exitConditions || [],
      markets: newStrategyData.markets || [],
      timeframes: newStrategyData.timeframes || [],
      riskRewardRatio: newStrategyData.riskRewardRatio || 2,
      winRate: 0,
    };
    
    const updatedStrategies = [...strategies, newStrategy];
    setStrategies(updatedStrategies);
    setSelectedStrategy(newStrategy);
    saveStrategies(updatedStrategies);
    
    toast({
      title: "Strategy Created",
      description: `"${newStrategy.name}" has been created successfully.`,
    });
  };
  
  // Handle updating an existing strategy
  const handleUpdateStrategy = (updatedStrategyData: Partial<Strategy>) => {
    if (!selectedStrategy) return;
    
    const updatedStrategy = {
      ...selectedStrategy,
      ...updatedStrategyData,
    };
    
    const updatedStrategies = strategies.map((strategy) => 
      strategy.id === selectedStrategy.id ? updatedStrategy : strategy
    );
    
    setStrategies(updatedStrategies);
    setSelectedStrategy(updatedStrategy);
    saveStrategies(updatedStrategies);
    
    toast({
      title: "Strategy Updated",
      description: `"${updatedStrategy.name}" has been updated successfully.`,
    });
  };

  return {
    strategies,
    selectedStrategy,
    setSelectedStrategy,
    handleCreateStrategy,
    handleUpdateStrategy
  };
};
