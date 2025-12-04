import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Clock, AlertCircle, Sparkles, History, Tag } from "lucide-react";

const Helpdesk = () => {
  const ticket = {
    id: "TKT-4892",
    subject: "Unable to export data to CSV format",
    customer: "Sarah Chen",
    email: "sarah.chen@acmecorp.com",
    company: "Acme Corporation",
    priority: "High",
    status: "Open",
    created: "2 hours ago",
    message: `Hi Support Team,

I've been trying to export my project data to CSV for the past hour but keep getting a timeout error. This is urgent as I need to present this data to stakeholders tomorrow morning.

I've tried:
- Refreshing the page
- Using a different browser (Chrome and Firefox)
- Reducing the date range

None of these worked. The export starts but fails at around 60% completion.

My account is on the Pro plan and I have about 50,000 records to export.

Please help ASAP!

Best,
Sarah`
  };

  const memoryData = {
    customerProfile: {
      totalTickets: 12,
      avgResolutionTime: "4.2 hours",
      satisfaction: "4.8/5",
      accountTier: "Pro",
      accountAge: "2 years",
      lastContact: "3 weeks ago"
    },
    pastIssues: [
      { id: "TKT-3201", title: "Export timeout on large datasets", date: "3 months ago", resolution: "Increased timeout limit" },
      { id: "TKT-2847", title: "CSV formatting issues with special characters", date: "6 months ago", resolution: "UTF-8 encoding fix" },
      { id: "TKT-1923", title: "Slow dashboard loading", date: "1 year ago", resolution: "Cache optimization" }
    ],
    suggestedResponse: `Hi Sarah,

I can see you've experienced export issues before, and I apologize for the inconvenience. Based on your account's data volume (50,000 records), here's what I recommend:

1. **Immediate fix**: I've temporarily increased your export timeout limit from 60s to 180s. Please try your export again.

2. **For future exports**: Consider using our batch export feature (Settings → Export → Enable Batch Mode) which handles large datasets more reliably.

3. **Alternative**: I can also generate a direct download link for you within the next 30 minutes if the above doesn't work.

Let me know which option works best for you!

Best,
Support Team`
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">Helpdesk Ticket View</h1>
          <p className="text-muted-foreground mt-1">Real-time memory context for support agents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Ticket Details */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="glass-panel border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">{ticket.id}</Badge>
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">{ticket.priority}</Badge>
                    <Badge variant="secondary">{ticket.status}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {ticket.created}
                  </span>
                </div>
                <CardTitle className="text-lg mt-3">{ticket.subject}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/30">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.customer}</p>
                    <p className="text-sm text-muted-foreground">{ticket.email} • {ticket.company}</p>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans bg-transparent p-0">{ticket.message}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Response */}
            <Card className="glass-panel border-primary/30 neon-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI-Generated Response
                  <Badge className="ml-auto bg-primary/20 text-primary border-primary/30">Memory-Enhanced</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm text-foreground/90 font-sans">{memoryData.suggestedResponse}</pre>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">Use This Response</Button>
                  <Button variant="outline">Edit</Button>
                  <Button variant="ghost">Regenerate</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Memory Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-panel border-accent/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-accent/20 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-accent" />
                  </div>
                  MotionOS Memory Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Profile */}
                <div>
                  <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <User className="h-3 w-3" /> Customer Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-muted-foreground text-xs">Total Tickets</p>
                      <p className="font-mono font-medium">{memoryData.customerProfile.totalTickets}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-muted-foreground text-xs">Avg Resolution</p>
                      <p className="font-mono font-medium">{memoryData.customerProfile.avgResolutionTime}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-muted-foreground text-xs">Satisfaction</p>
                      <p className="font-mono font-medium text-primary">{memoryData.customerProfile.satisfaction}</p>
                    </div>
                    <div className="p-2 rounded bg-muted/30">
                      <p className="text-muted-foreground text-xs">Account Tier</p>
                      <p className="font-mono font-medium">{memoryData.customerProfile.accountTier}</p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Past Issues */}
                <div>
                  <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <History className="h-3 w-3" /> Related Past Issues
                  </h4>
                  <div className="space-y-2">
                    {memoryData.pastIssues.map((issue) => (
                      <div key={issue.id} className="p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-primary">{issue.id}</span>
                          <span className="text-xs text-muted-foreground">{issue.date}</span>
                        </div>
                        <p className="text-sm font-medium">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Tag className="h-3 w-3 inline mr-1" />
                          {issue.resolution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Memory Tags */}
                <div>
                  <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                    Memory Tags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {["export-issues", "large-dataset", "pro-tier", "technical", "urgent"].map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Memory confidence: 94%</span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> 3 memories loaded
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Helpdesk;
