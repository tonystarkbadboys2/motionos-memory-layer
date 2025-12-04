import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, RefreshCcw, ArrowRight, Sparkles } from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Resolution Time",
      icon: Clock,
      before: "4.2 hours",
      after: "1.8 hours",
      improvement: "-57%",
      description: "Average time to resolve tickets"
    },
    {
      title: "First Response Accuracy",
      icon: Target,
      before: "67%",
      after: "94%",
      improvement: "+40%",
      description: "Tickets resolved on first response"
    },
    {
      title: "CSAT Score",
      icon: TrendingUp,
      before: "3.6/5",
      after: "4.8/5",
      improvement: "+33%",
      description: "Customer satisfaction rating"
    },
    {
      title: "Ticket Repetition",
      icon: RefreshCcw,
      before: "34%",
      after: "8%",
      improvement: "-76%",
      description: "Same issues reopened within 30 days"
    }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" /> Impact Dashboard
          </Badge>
          <h1 className="text-3xl font-bold font-mono text-foreground">Before & After MotionOS</h1>
          <p className="text-muted-foreground mt-2">
            Real metrics from teams using MotionOS memory layer for helpdesk operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title} className="glass-panel border-border overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <metric.icon className="h-4 w-4 text-primary" />
                    </div>
                    {metric.title}
                  </CardTitle>
                  <Badge 
                    className={`font-mono ${
                      metric.improvement.startsWith('+')
                        ? "bg-primary/20 text-primary"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {metric.improvement}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {/* Before */}
                  <div className="flex-1 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Before</p>
                    <p className="text-2xl font-bold font-mono text-destructive/80">{metric.before}</p>
                  </div>
                  
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  
                  {/* After */}
                  <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/30 neon-glow">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">After</p>
                    <p className="text-2xl font-bold font-mono text-primary">{metric.after}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <Card className="glass-panel border-accent/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold font-mono text-primary">2.4x</p>
                <p className="text-sm text-muted-foreground">Faster Resolution</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-accent">$42K</p>
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-primary">89%</p>
                <p className="text-sm text-muted-foreground">Agent Efficiency</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-accent">4.8★</p>
                <p className="text-sm text-muted-foreground">Avg CSAT Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          * Based on aggregated data from beta customers over 90-day trial periods
        </p>
      </div>
    </Layout>
  );
};

export default Dashboard;
