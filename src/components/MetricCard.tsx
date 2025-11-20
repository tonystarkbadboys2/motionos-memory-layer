import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export const MetricCard = ({ title, value, icon: Icon, trend, className }: MetricCardProps) => {
  return (
    <div className={cn("glass-panel rounded-xl p-6 hover:border-primary/30 transition-all", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-mono text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold font-mono mt-2 text-foreground">{value}</h3>
          {trend && (
            <p className="text-xs font-mono text-primary mt-1">{trend}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};
