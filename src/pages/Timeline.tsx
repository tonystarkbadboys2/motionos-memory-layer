import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Clock, Sparkles } from "lucide-react";

const Timeline = () => {
  const events = [
    {
      id: "evt_001",
      event: "Customer reported export timeout issue",
      timestamp: "2024-01-15 14:32:18",
      recency: 0.98,
      importance: 0.92,
      source: "ticket",
      tags: ["export", "technical"]
    },
    {
      id: "evt_002", 
      event: "Account upgraded to Pro tier",
      timestamp: "2024-01-10 09:15:00",
      recency: 0.85,
      importance: 0.78,
      source: "billing",
      tags: ["account", "upgrade"]
    },
    {
      id: "evt_003",
      event: "Resolved CSV encoding issue - UTF-8 fix applied",
      timestamp: "2023-12-20 16:45:33",
      recency: 0.72,
      importance: 0.88,
      source: "resolution",
      tags: ["export", "resolved"]
    },
    {
      id: "evt_004",
      event: "Customer praised quick response time",
      timestamp: "2023-12-18 11:20:00",
      recency: 0.70,
      importance: 0.65,
      source: "feedback",
      tags: ["positive", "csat"]
    },
    {
      id: "evt_005",
      event: "Large dataset warning triggered (50K+ records)",
      timestamp: "2023-11-05 13:55:42",
      recency: 0.58,
      importance: 0.95,
      source: "system",
      tags: ["warning", "data"]
    },
    {
      id: "evt_006",
      event: "Initial onboarding completed",
      timestamp: "2023-08-22 10:00:00",
      recency: 0.35,
      importance: 0.60,
      source: "onboarding",
      tags: ["new-customer"]
    },
    {
      id: "evt_007",
      event: "API integration enabled for workspace",
      timestamp: "2023-09-15 14:22:11",
      recency: 0.42,
      importance: 0.75,
      source: "settings",
      tags: ["api", "integration"]
    },
    {
      id: "evt_008",
      event: "Dashboard performance issue reported",
      timestamp: "2023-10-01 09:30:00",
      recency: 0.48,
      importance: 0.82,
      source: "ticket",
      tags: ["performance", "technical"]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-primary";
    if (score >= 0.5) return "text-accent";
    return "text-muted-foreground";
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      ticket: "bg-destructive/20 text-destructive border-destructive/30",
      billing: "bg-primary/20 text-primary border-primary/30",
      resolution: "bg-green-500/20 text-green-400 border-green-500/30",
      feedback: "bg-accent/20 text-accent border-accent/30",
      system: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      onboarding: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      settings: "bg-muted text-muted-foreground border-border"
    };
    return colors[source] || "bg-muted text-muted-foreground";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Memory Events</h1>
            <p className="text-muted-foreground mt-1">Browse and analyze stored memory events</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>

        <Card className="glass-panel border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search events..." 
                  className="pl-9 bg-background/50"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{events.length} events</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-mono text-xs">EVENT</TableHead>
                  <TableHead className="font-mono text-xs">TIMESTAMP</TableHead>
                  <TableHead className="font-mono text-xs text-center">RECENCY</TableHead>
                  <TableHead className="font-mono text-xs text-center">IMPORTANCE</TableHead>
                  <TableHead className="font-mono text-xs">SOURCE</TableHead>
                  <TableHead className="font-mono text-xs">TAGS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="border-border hover:bg-muted/30 cursor-pointer">
                    <TableCell className="max-w-[300px]">
                      <p className="truncate">{event.event}</p>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground whitespace-nowrap">
                      {event.timestamp}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-mono font-medium ${getScoreColor(event.recency)}`}>
                        {event.recency.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-mono font-medium ${getScoreColor(event.importance)}`}>
                        {event.importance.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getSourceBadge(event.source)}`}>
                        {event.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {event.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {event.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{event.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Score Legend */}
        <Card className="glass-panel border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Score Legend:</span>
                </div>
                <div className="flex items-center gap-4">
                  <span><span className="text-primary font-mono">0.8+</span> High</span>
                  <span><span className="text-accent font-mono">0.5-0.8</span> Medium</span>
                  <span><span className="text-muted-foreground font-mono">&lt;0.5</span> Low</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">
                Scores combine time decay and contextual relevance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Timeline;
