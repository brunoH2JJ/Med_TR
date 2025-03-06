
import { useState } from "react";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { StrategyFormModal } from "@/components/strategy/StrategyFormModal";
import { StrategyList } from "@/components/strategy/StrategyList";
import { StrategyDetails } from "@/components/strategy/StrategyDetails";
import { useStrategyData } from "@/hooks/useStrategyData";

const StrategyPage = () => {
  const [isNewStrategyModalOpen, setIsNewStrategyModalOpen] = useState(false);
  const [isEditStrategyModalOpen, setIsEditStrategyModalOpen] = useState(false);
  
  const {
    strategies,
    selectedStrategy,
    setSelectedStrategy,
    handleCreateStrategy,
    handleUpdateStrategy
  } = useStrategyData();

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
          
          <Button onClick={() => setIsNewStrategyModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StrategyList 
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            onSelectStrategy={setSelectedStrategy}
          />
          
          <div className="lg:col-span-2 space-y-6">
            {selectedStrategy && (
              <StrategyDetails 
                strategy={selectedStrategy}
                onEdit={() => setIsEditStrategyModalOpen(true)}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* New Strategy Modal */}
      <StrategyFormModal
        open={isNewStrategyModalOpen}
        onOpenChange={setIsNewStrategyModalOpen}
        onSave={handleCreateStrategy}
      />
      
      {/* Edit Strategy Modal */}
      {selectedStrategy && (
        <StrategyFormModal
          open={isEditStrategyModalOpen}
          onOpenChange={setIsEditStrategyModalOpen}
          strategy={selectedStrategy}
          onSave={handleUpdateStrategy}
        />
      )}
    </div>
  );
};

export default StrategyPage;
