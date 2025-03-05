
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "glass-card p-5 transition-transform duration-300 hover:translate-y-[-2px]",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="flex items-end gap-2">
        <p className="text-2xl font-semibold">{value}</p>
        
        {trend && (
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-full",
            trend === "up" ? "bg-success/10 text-success" : 
            trend === "down" ? "bg-destructive/10 text-destructive" : 
            "bg-muted text-muted-foreground"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "―"}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
