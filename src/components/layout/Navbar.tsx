
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ListPlus, Lightbulb, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <header className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1 rounded-md">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="hidden font-semibold text-lg sm:block">TradeJournal</span>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-6">
          <Link 
            to="/" 
            className={cn("nav-link flex items-center gap-1", location.pathname === "/" && "active")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/enter-trade" 
            className={cn("nav-link flex items-center gap-1", location.pathname === "/enter-trade" && "active")}
          >
            <ListPlus className="h-4 w-4" />
            <span>Enter Trade</span>
          </Link>
          
          <Link 
            to="/strategy" 
            className={cn("nav-link flex items-center gap-1", location.pathname === "/strategy" && "active")}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Strategy</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={cn("nav-link flex items-center gap-1", location.pathname === "/analytics" && "active")}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
