import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  ArrowRight, 
  Link2, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Settings,
  CreditCard,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  content: string;
  timestamp: string;
  type: "ticket" | "billing" | "system" | "feedback" | "resolution" | "onboarding" | "settings";
  importance: number;
  confidence: number;
  linkedEvents?: string[];
  sessionId?: string;
  tags: string[];
  isVerified?: boolean;
}

interface EpisodicTimelineProps {
  events?: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const mockEvents: TimelineEvent[] = [
  {
    id: "evt_001",
    content: "Customer reported export timeout issue - data volume exceeds 50K records",
    timestamp: "2024-01-15T14:32:18Z",
    type: "ticket",
    importance: 0.92,
    confidence: 0.95,
    linkedEvents: ["evt_003", "evt_005"],
    sessionId: "session_abc123",
    tags: ["export", "technical", "urgent"],
    isVerified: true
  },
  {
    id: "evt_002",
    content: "Account upgraded to Pro tier - unlocked advanced export features",
    timestamp: "2024-01-10T09:15:00Z",
    type: "billing",
    importance: 0.78,
    confidence: 0.99,
    linkedEvents: [],
    sessionId: "session_abc123",
    tags: ["account", "upgrade"],
    isVerified: true
  },
  {
    id: "evt_003",
    content: "Previous export timeout resolved - increased timeout limit from 60s to 180s",
    timestamp: "2023-12-20T16:45:33Z",
    type: "resolution",
    importance: 0.88,
    confidence: 0.92,
    linkedEvents: ["evt_001"],
    sessionId: "session_def456",
    tags: ["export", "resolved"],
    isVerified: true
  },
  {
    id: "evt_004",
    content: "Customer praised quick response time - mentioned in satisfaction survey",
    timestamp: "2023-12-18T11:20:00Z",
    type: "feedback",
    importance: 0.65,
    confidence: 0.88,
    linkedEvents: [],
    tags: ["positive", "csat"]
  },
  {
    id: "evt_005",
    content: "Large dataset warning triggered - records exceed recommended batch size",
    timestamp: "2023-11-05T13:55:42Z",
    type: "system",
    importance: 0.95,
    confidence: 0.99,
    linkedEvents: ["evt_001"],
    tags: ["warning", "data"],
    isVerified: true
  },
  {
    id: "evt_006",
    content: "Initial onboarding completed - API integration enabled",
    timestamp: "2023-08-22T10:00:00Z",
    type: "onboarding",
    importance: 0.60,
    confidence: 0.99,
    linkedEvents: [],
    tags: ["new-customer"]
  }
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "ticket": return Ticket;
    case "billing": return CreditCard;
    case "resolution": return CheckCircle;
    case "feedback": return MessageSquare;
    case "system": return AlertCircle;
    case "settings": return Settings;
    default: return Clock;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "ticket": return "bg-destructive/20 text-destructive border-destructive/30";
    case "billing": return "bg-primary/20 text-primary border-primary/30";
    case "resolution": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "feedback": return "bg-accent/20 text-accent border-accent/30";
    case "system": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "onboarding": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export function EpisodicTimeline({ events = mockEvents, onEventClick }: EpisodicTimelineProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showLinked, setShowLinked] = useState<string | null>(null);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeDiff = (current: string, previous: string) => {
    const diff = new Date(current).getTime() - new Date(previous).getTime();
    const days = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24)));
    if (days === 0) return "Same day";
    if (days === 1) return "1 day later";
    if (days < 7) return `${days} days later`;
    if (days < 30) return `${Math.floor(days / 7)} weeks later`;
    return `${Math.floor(days / 30)} months later`;
  };

  const linkedEventsMap = new Map<string, TimelineEvent>();
  events.forEach(e => linkedEventsMap.set(e.id, e));

  return (
    <Card className="glass-panel border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Episodic Memory Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Chronologically linked events preserving interaction flow and causality
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
          
          {events.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const isExpanded = expandedEvent === event.id;
            const showingLinked = showLinked === event.id;
            const hasLinks = event.linkedEvents && event.linkedEvents.length > 0;
            
            return (
              <div key={event.id} className="relative">
                {/* Time diff indicator */}
                {index > 0 && (
                  <div className="ml-12 py-2 text-xs text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    {getTimeDiff(events[index - 1].timestamp, event.timestamp)}
                  </div>
                )}
                
                {/* Event node */}
                <div 
                  className={cn(
                    "relative flex items-start gap-4 p-4 hover:bg-muted/30 cursor-pointer transition-colors",
                    isExpanded && "bg-muted/30"
                  )}
                  onClick={() => {
                    setExpandedEvent(isExpanded ? null : event.id);
                    onEventClick?.(event);
                  }}
                >
                  {/* Timeline node */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                    getEventColor(event.type)
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.content}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatDate(event.timestamp)}</span>
                          {event.sessionId && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{event.sessionId.slice(0, 12)}...</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {event.isVerified && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 p-3 rounded-lg bg-background/50 border border-border space-y-3">
                        {/* Scores */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Importance Score</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${event.importance * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-mono">{(event.importance * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full"
                                  style={{ width: `${event.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-mono">{(event.confidence * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Linked events */}
                        {hasLinks && (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowLinked(showingLinked ? null : event.id);
                              }}
                            >
                              <Link2 className="h-4 w-4 mr-2" />
                              {event.linkedEvents!.length} linked event{event.linkedEvents!.length > 1 ? "s" : ""}
                              {showingLinked ? (
                                <ChevronDown className="h-4 w-4 ml-auto" />
                              ) : (
                                <ChevronRight className="h-4 w-4 ml-auto" />
                              )}
                            </Button>
                            
                            {showingLinked && (
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/30">
                                {event.linkedEvents!.map(linkedId => {
                                  const linked = linkedEventsMap.get(linkedId);
                                  if (!linked) return null;
                                  return (
                                    <div key={linkedId} className="p-2 rounded bg-muted/30 text-sm">
                                      <p className="font-medium truncate">{linked.content}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(linked.timestamp)}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
