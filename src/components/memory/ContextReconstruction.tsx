import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Layers, 
  Search, 
  Sparkles, 
  User, 
  Ticket, 
  Clock,
  TrendingUp,
  Link2,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryFragment {
  id: string;
  content: string;
  source: string;
  timestamp: string;
  relevance: number;
  sessionId: string;
}

interface ReconstructedContext {
  userId: string;
  userName: string;
  accountTier: string;
  totalInteractions: number;
  satisfactionScore: number;
  keyInsights: string[];
  memoryFragments: MemoryFragment[];
  contextScore: number;
}

const mockContext: ReconstructedContext = {
  userId: "user_abc123",
  userName: "Sarah Chen",
  accountTier: "Pro",
  totalInteractions: 47,
  satisfactionScore: 4.8,
  keyInsights: [
    "Prefers email communication over phone",
    "Experienced 3 export timeout issues in past 6 months",
    "Primary use case: data analytics and reporting",
    "Usually contacts support during business hours EST",
    "Responds well to detailed technical explanations"
  ],
  memoryFragments: [
    {
      id: "frag_001",
      content: "Customer reported export timeout - dataset exceeds 50K records",
      source: "TKT-4892",
      timestamp: "2024-01-15T14:32:18Z",
      relevance: 0.95,
      sessionId: "session_abc"
    },
    {
      id: "frag_002",
      content: "Previous timeout resolved by increasing limit from 60s to 180s",
      source: "TKT-3201",
      timestamp: "2023-12-20T16:45:33Z",
      relevance: 0.88,
      sessionId: "session_def"
    },
    {
      id: "frag_003",
      content: "Account upgraded to Pro tier - unlocked advanced features",
      source: "BILLING",
      timestamp: "2024-01-10T09:15:00Z",
      relevance: 0.72,
      sessionId: "session_ghi"
    },
    {
      id: "frag_004",
      content: "Praised quick response in satisfaction survey - 5/5 rating",
      source: "FEEDBACK",
      timestamp: "2023-12-18T11:20:00Z",
      relevance: 0.65,
      sessionId: "session_jkl"
    },
    {
      id: "frag_005",
      content: "Uses batch export feature for weekly reports",
      source: "ANALYTICS",
      timestamp: "2023-11-05T13:55:42Z",
      relevance: 0.58,
      sessionId: "session_mno"
    }
  ],
  contextScore: 94
};

export function ContextReconstruction() {
  const [searchQuery, setSearchQuery] = useState("sarah chen");
  const [context, setContext] = useState<ReconstructedContext | null>(mockContext);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFragment, setExpandedFragment] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setContext(mockContext);
    setIsLoading(false);
  };

  const getSourceColor = (source: string) => {
    if (source.startsWith("TKT")) return "bg-destructive/20 text-destructive border-destructive/30";
    if (source === "BILLING") return "bg-primary/20 text-primary border-primary/30";
    if (source === "FEEDBACK") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (source === "ANALYTICS") return "bg-accent/20 text-accent border-accent/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-4">
      {/* Search Panel */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5 text-primary" />
            Context Reconstruction
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregate fragmented memories across sessions to build unified customer context
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, or ticket ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Reconstruct
            </Button>
          </div>
        </CardContent>
      </Card>

      {context && (
        <>
          {/* Customer Profile Card */}
          <Card className="glass-panel border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{context.userName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {context.accountTier}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-mono">
                        {context.userId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Context Confidence</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={context.contextScore} className="w-24" />
                    <span className="text-lg font-bold text-primary">{context.contextScore}%</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold">{context.totalInteractions}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Ticket className="h-4 w-4" />
                    Total Interactions
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{context.satisfactionScore}/5</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Satisfaction
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{context.memoryFragments.length}</p>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Layers className="h-4 w-4" />
                    Memory Fragments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="glass-panel border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                AI-Synthesized Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {context.keyInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent">
                      {index + 1}
                    </div>
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Memory Fragments */}
          <Card className="glass-panel border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                Aggregated Memory Fragments
                <Badge variant="outline" className="ml-2">{context.memoryFragments.length} sources</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {context.memoryFragments.map((fragment) => (
                  <div 
                    key={fragment.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-colors",
                      expandedFragment === fragment.id 
                        ? "bg-muted/50 border-primary/30" 
                        : "bg-background/50 border-border hover:border-primary/20"
                    )}
                    onClick={() => setExpandedFragment(
                      expandedFragment === fragment.id ? null : fragment.id
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm">{fragment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getSourceColor(fragment.source))}
                          >
                            {fragment.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(fragment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Relevance</p>
                          <p className={cn(
                            "font-mono text-sm font-medium",
                            fragment.relevance >= 0.8 ? "text-primary" : 
                            fragment.relevance >= 0.6 ? "text-accent" : "text-muted-foreground"
                          )}>
                            {(fragment.relevance * 100).toFixed(0)}%
                          </p>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          expandedFragment === fragment.id && "rotate-90"
                        )} />
                      </div>
                    </div>

                    {expandedFragment === fragment.id && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Session ID:</span>{" "}
                            <span className="font-mono">{fragment.sessionId}</span>
                          </div>
                          <div>
                            <span className="font-medium">Fragment ID:</span>{" "}
                            <span className="font-mono">{fragment.id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
