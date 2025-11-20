import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Database, Activity, Clock, Code, Headphones, Settings, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Activity },
  { name: "Memory Console", href: "/console", icon: Database },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "API Playground", href: "/api", icon: Code },
  { name: "Helpdesk Demo", href: "/helpdesk", icon: Headphones },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border glass-panel">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border">
              <h1 className="text-2xl font-bold font-mono text-primary neon-glow">
                MotionOS
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-mono">Memory Layer v1.0</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 neon-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full transition-all">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
