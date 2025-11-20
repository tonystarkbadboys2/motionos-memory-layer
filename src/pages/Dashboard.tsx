import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Database, Activity, Zap, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const recentActivity = [
    { id: 1, action: "Memory stored", user: "user_12345", time: "2 min ago", status: "success" },
    { id: 2, action: "Memory retrieved", user: "user_67890", time: "5 min ago", status: "success" },
    { id: 3, action: "Session created", user: "user_54321", time: "12 min ago", status: "success" },
    { id: 4, action: "Memory stored", user: "user_98765", time: "15 min ago", status: "success" },
    { id: 5, action: "Memory cleared", user: "user_11111", time: "18 min ago", status: "warning" },
  ];

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
            value="1,247"
            icon={Database}
            trend="+12.5% from last hour"
          />
          <MetricCard
            title="Active Sessions"
            value="89"
            icon={Activity}
            trend="3 new this minute"
          />
          <MetricCard
            title="API Calls Today"
            value="15.2K"
            icon={Zap}
            trend="+8.3% vs yesterday"
          />
          <MetricCard
            title="Memory Health"
            value="99.7%"
            icon={TrendingUp}
            trend="All systems operational"
          />
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold font-mono text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-primary' : 'bg-accent'
                  } neon-glow`}></div>
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
