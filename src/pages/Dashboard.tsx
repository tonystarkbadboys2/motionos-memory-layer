import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Database, Activity, Zap, TrendingUp } from "lucide-react";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";

const Dashboard = () => {
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    action: string;
    user: string;
    time: string;
    status: string;
  }>>([
    { id: "1", action: "Memory stored", user: "user_12345", time: "2 min ago", status: "success" },
    { id: "2", action: "Memory retrieved", user: "user_67890", time: "5 min ago", status: "success" },
    { id: "3", action: "Session created", user: "user_54321", time: "12 min ago", status: "success" },
  ]);
  
  const [totalMemories, setTotalMemories] = useState(1247);
  const [activeSessions, setActiveSessions] = useState(89);
  const [apiCalls, setApiCalls] = useState(15200);

  useEffect(() => {
    // Start the memory stream
    memoryStream.start();
    
    // Subscribe to new events
    const unsubscribe = memoryStream.subscribe((event: MemoryEvent) => {
      const actionMap = {
        store: 'Memory stored',
        retrieve: 'Memory retrieved',
        clear: 'Memory cleared',
        session_start: 'Session created',
        session_end: 'Session ended',
      };
      
      const newActivity = {
        id: event.id,
        action: actionMap[event.type],
        user: event.userId,
        time: 'Just now',
        status: event.status,
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      
      // Update metrics
      if (event.type === 'store') {
        setTotalMemories(prev => prev + 1);
      } else if (event.type === 'session_start') {
        setActiveSessions(prev => prev + 1);
      }
      setApiCalls(prev => prev + 1);
    });
    
    return () => {
      unsubscribe();
      memoryStream.stop();
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground">System Overview</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Real-time memory layer metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Memories"
            value={totalMemories.toLocaleString()}
            icon={Database}
            trend="+12.5% from last hour"
            className="animate-fade-in"
          />
          <MetricCard
            title="Active Sessions"
            value={activeSessions}
            icon={Activity}
            trend="3 new this minute"
            className="animate-fade-in"
          />
          <MetricCard
            title="API Calls Today"
            value={`${(apiCalls / 1000).toFixed(1)}K`}
            icon={Zap}
            trend="+8.3% vs yesterday"
            className="animate-fade-in"
          />
          <MetricCard
            title="Memory Health"
            value="99.7%"
            icon={TrendingUp}
            trend="All systems operational"
            className="animate-fade-in"
          />
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-mono text-foreground">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
              <span className="text-xs font-mono text-primary">Live</span>
            </div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all animate-slide-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-primary animate-pulse-glow' : 'bg-accent'
                  }`}></div>
                  <div>
                    <p className="font-mono text-sm text-foreground">{activity.action}</p>
                    <p className="font-mono text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
