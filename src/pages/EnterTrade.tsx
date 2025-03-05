
import { Navbar } from "@/components/layout/Navbar";
import { TradeForm } from "@/components/forms/TradeForm";

const EnterTrade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-6 md:py-10 mx-auto max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Enter Trade</h1>
          <p className="text-muted-foreground mt-1">
            Log your trade details with entry/exit points and notes.
          </p>
        </div>
        
        <TradeForm />
      </main>
    </div>
  );
};

export default EnterTrade;
