import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PendingMemory {
  id: string;
  content: string;
  source: string;
  confidence: number;
  suggestedTags: string[];
  timestamp: string;
  reason?: string;
}

const mockPendingMemories: PendingMemory[] = [
  {
    id: "pending_001",
    content: "Customer mentioned they work with datasets around 100K records daily",
    source: "TKT-4892",
    confidence: 0.72,
    suggestedTags: ["usage", "data-volume"],
    timestamp: "2024-01-15T14:35:00Z",
    reason: "Inferred from conversation context - not explicitly stated"
  },
  {
    id: "pending_002",
    content: "Prefers to receive updates via Slack notifications",
    source: "TKT-4890",
    confidence: 0.65,
    suggestedTags: ["preference", "communication"],
    timestamp: "2024-01-15T12:20:00Z",
    reason: "Mentioned in passing - may need verification"
  },
  {
    id: "pending_003",
    content: "Primary timezone appears to be EST based on activity patterns",
    source: "ANALYTICS",
    confidence: 0.58,
    suggestedTags: ["timezone", "pattern"],
    timestamp: "2024-01-14T10:00:00Z",
    reason: "Derived from login patterns - indirect inference"
  },
  {
    id: "pending_004",
    content: "May be considering upgrade to Enterprise tier",
    source: "TKT-4885",
    confidence: 0.45,
    suggestedTags: ["potential-upgrade", "enterprise"],
    timestamp: "2024-01-13T16:00:00Z",
    reason: "Asked about Enterprise features - intent unclear"
  }
];

export function ConfidenceGating() {
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.8]);
  const [autoStoreHighConfidence, setAutoStoreHighConfidence] = useState(true);
  const [humanReviewRequired, setHumanReviewRequired] = useState(true);
  const [pendingMemories, setPendingMemories] = useState(mockPendingMemories);
  const [reviewingMemory, setReviewingMemory] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleApprove = (memoryId: string) => {
    setPendingMemories(prev => prev.filter(m => m.id !== memoryId));
    toast.success("Memory approved and stored");
    setReviewingMemory(null);
  };

  const handleReject = (memoryId: string) => {
    setPendingMemories(prev => prev.filter(m => m.id !== memoryId));
    toast.info("Memory rejected and discarded");
    setReviewingMemory(null);
  };

  const handleEditAndApprove = (memoryId: string) => {
    if (!editedContent.trim()) {
      toast.error("Please provide updated content");
      return;
    }
    setPendingMemories(prev => prev.filter(m => m.id !== memoryId));
    toast.success("Memory edited and stored");
    setReviewingMemory(null);
    setEditedContent("");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-accent";
    if (confidence >= 0.4) return "text-yellow-400";
    return "text-destructive";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-accent";
    if (confidence >= 0.4) return "bg-yellow-500";
    return "bg-destructive";
  };

  const aboveThreshold = pendingMemories.filter(m => m.confidence >= confidenceThreshold[0]);
  const belowThreshold = pendingMemories.filter(m => m.confidence < confidenceThreshold[0]);

  return (
    <div className="space-y-4">
      {/* Settings Card */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Confidence-Gated Writes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Only store memories above a confidence threshold with optional human review
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Confidence Threshold</Label>
              <Badge variant="outline" className="font-mono text-lg">
                {(confidenceThreshold[0] * 100).toFixed(0)}%
              </Badge>
            </div>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              min={0.3}
              max={0.95}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More memories (lower quality)</span>
              <span>Fewer memories (higher quality)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <Label className="font-medium">Auto-Store High Confidence</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically store memories above threshold
                </p>
              </div>
              <Switch 
                checked={autoStoreHighConfidence} 
                onCheckedChange={setAutoStoreHighConfidence} 
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div>
                <Label className="font-medium">Human Review Required</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Require approval for low-confidence memories
                </p>
              </div>
              <Switch 
                checked={humanReviewRequired} 
                onCheckedChange={setHumanReviewRequired} 
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-background/50 border border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{aboveThreshold.length}</p>
              <p className="text-xs text-muted-foreground">Above Threshold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{belowThreshold.length}</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{pendingMemories.length}</p>
              <p className="text-xs text-muted-foreground">Total Queue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Memories */}
      <Card className="glass-panel border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Pending Memory Queue
            </CardTitle>
            <Badge variant="outline">{pendingMemories.length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingMemories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-400" />
              <p>No pending memories to review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMemories.map((memory) => {
                const isReviewing = reviewingMemory === memory.id;
                const meetsThreshold = memory.confidence >= confidenceThreshold[0];

                return (
                  <div
                    key={memory.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      meetsThreshold 
                        ? "bg-green-500/5 border-green-500/20" 
                        : "bg-yellow-500/5 border-yellow-500/20",
                      isReviewing && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {meetsThreshold ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {memory.source}
                          </Badge>
                          {meetsThreshold && autoStoreHighConfidence && (
                            <Badge className="text-xs bg-green-500/20 text-green-400">
                              Auto-approve enabled
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm">{memory.content}</p>
                        
                        {memory.reason && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            ⚠️ {memory.reason}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {memory.suggestedTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                          <p className={cn(
                            "text-lg font-bold font-mono",
                            getConfidenceColor(memory.confidence)
                          )}>
                            {(memory.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Progress 
                          value={memory.confidence * 100} 
                          className={cn("w-20 h-2", getConfidenceBg(memory.confidence))}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    {!isReviewing ? (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setReviewingMemory(memory.id);
                            setEditedContent(memory.content);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(memory.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(memory.id)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div>
                          <Label className="text-sm">Edit content before storing:</Label>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReviewingMemory(null);
                              setEditedContent("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditAndApprove(memory.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Save & Approve
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
