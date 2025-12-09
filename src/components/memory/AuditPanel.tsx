import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  History,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Memory {
  id: string;
  content: string;
  confidence: number;
  isVerified: boolean;
  isRedacted: boolean;
  createdAt: string;
  tags: string[];
  source: string;
}

interface AuditLog {
  id: string;
  memoryId: string;
  action: "create" | "read" | "update" | "delete" | "verify" | "redact" | "unredact";
  previousContent?: string;
  newContent?: string;
  reason?: string;
  createdAt: string;
  userId: string;
}

const mockMemories: Memory[] = [
  {
    id: "mem_001",
    content: "Customer prefers email communication over phone calls",
    confidence: 0.95,
    isVerified: true,
    isRedacted: false,
    createdAt: "2024-01-15T14:32:18Z",
    tags: ["preference", "communication"],
    source: "ticket"
  },
  {
    id: "mem_002",
    content: "Account has recurring export timeout issues with large datasets",
    confidence: 0.88,
    isVerified: false,
    isRedacted: false,
    createdAt: "2024-01-10T09:15:00Z",
    tags: ["technical", "export"],
    source: "system"
  },
  {
    id: "mem_003",
    content: "[REDACTED] - Personal information removed",
    confidence: 0.75,
    isVerified: false,
    isRedacted: true,
    createdAt: "2023-12-20T16:45:33Z",
    tags: ["pii", "redacted"],
    source: "ticket"
  },
  {
    id: "mem_004",
    content: "Customer is on Pro tier with access to advanced features",
    confidence: 0.99,
    isVerified: true,
    isRedacted: false,
    createdAt: "2023-12-18T11:20:00Z",
    tags: ["account", "tier"],
    source: "billing"
  },
  {
    id: "mem_005",
    content: "Prefers detailed technical explanations in support responses",
    confidence: 0.72,
    isVerified: false,
    isRedacted: false,
    createdAt: "2023-11-05T13:55:42Z",
    tags: ["preference", "support"],
    source: "feedback"
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    memoryId: "mem_001",
    action: "verify",
    reason: "Confirmed by customer in ticket #4892",
    createdAt: "2024-01-15T15:00:00Z",
    userId: "admin_user"
  },
  {
    id: "log_002",
    memoryId: "mem_003",
    action: "redact",
    previousContent: "Customer email is john.doe@example.com",
    reason: "PII compliance - removing personal email",
    createdAt: "2024-01-14T10:30:00Z",
    userId: "admin_user"
  },
  {
    id: "log_003",
    memoryId: "mem_002",
    action: "update",
    previousContent: "Account has export timeout issues",
    newContent: "Account has recurring export timeout issues with large datasets",
    reason: "Added context about dataset size",
    createdAt: "2024-01-12T09:00:00Z",
    userId: "support_agent"
  }
];

export function AuditPanel() {
  const [memories, setMemories] = useState(mockMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editReason, setEditReason] = useState("");
  const [showAuditLog, setShowAuditLog] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified" | "redacted">("all");

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === "verified") return matchesSearch && m.isVerified;
    if (filter === "unverified") return matchesSearch && !m.isVerified && !m.isRedacted;
    if (filter === "redacted") return matchesSearch && m.isRedacted;
    return matchesSearch;
  });

  const handleVerify = (memoryId: string) => {
    setMemories(prev => prev.map(m => 
      m.id === memoryId ? { ...m, isVerified: true } : m
    ));
    toast.success("Memory verified successfully");
  };

  const handleUnverify = (memoryId: string) => {
    setMemories(prev => prev.map(m => 
      m.id === memoryId ? { ...m, isVerified: false } : m
    ));
    toast.info("Memory verification removed");
  };

  const handleRedact = (memoryId: string) => {
    setMemories(prev => prev.map(m => 
      m.id === memoryId ? { 
        ...m, 
        isRedacted: true, 
        content: "[REDACTED] - Content removed for compliance",
        tags: [...m.tags.filter(t => t !== "pii"), "redacted"]
      } : m
    ));
    toast.success("Memory redacted successfully");
  };

  const handleEdit = () => {
    if (!selectedMemory || !editContent.trim()) return;
    
    setMemories(prev => prev.map(m => 
      m.id === selectedMemory.id ? { ...m, content: editContent.trim() } : m
    ));
    setSelectedMemory(null);
    setEditContent("");
    setEditReason("");
    toast.success("Memory updated successfully");
  };

  const handleDelete = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
    toast.success("Memory deleted successfully");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-400";
    if (confidence >= 0.7) return "text-accent";
    return "text-yellow-400";
  };

  const getActionBadge = (action: AuditLog["action"]) => {
    const styles = {
      create: "bg-green-500/20 text-green-400",
      read: "bg-blue-500/20 text-blue-400",
      update: "bg-yellow-500/20 text-yellow-400",
      delete: "bg-destructive/20 text-destructive",
      verify: "bg-primary/20 text-primary",
      redact: "bg-orange-500/20 text-orange-400",
      unredact: "bg-purple-500/20 text-purple-400"
    };
    return styles[action] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <Card className="glass-panel border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Auditable Memory Manager
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review, edit, verify, and redact stored memories with full audit trail
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{memories.length} memories</Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-400">
                {memories.filter(m => m.isVerified).length} verified
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "verified", "unverified", "redacted"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          {/* Memory List */}
          <div className="space-y-2">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors",
                  memory.isRedacted 
                    ? "bg-orange-500/5 border-orange-500/20" 
                    : memory.isVerified 
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm",
                      memory.isRedacted && "italic text-muted-foreground"
                    )}>
                      {memory.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="font-mono">{memory.id}</span>
                      <span>•</span>
                      <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={getConfidenceColor(memory.confidence)}>
                        {(memory.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {memory.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    {memory.isVerified ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-400"
                        onClick={() => handleUnverify(memory.id)}
                        title="Remove verification"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    ) : !memory.isRedacted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleVerify(memory.id)}
                        title="Verify memory"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    {!memory.isRedacted && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedMemory(memory);
                                setEditContent(memory.content);
                              }}
                              title="Edit memory"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Memory</DialogTitle>
                              <DialogDescription>
                                Update the memory content. Changes will be logged for audit.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="text-sm font-medium">Content</label>
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Reason for change</label>
                                <Input
                                  value={editReason}
                                  onChange={(e) => setEditReason(e.target.value)}
                                  placeholder="E.g., Correcting typo, adding context..."
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedMemory(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleEdit}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-orange-400"
                          onClick={() => handleRedact(memory.id)}
                          title="Redact memory"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowAuditLog(showAuditLog === memory.id ? null : memory.id)}
                      title="View audit log"
                    >
                      <History className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(memory.id)}
                      title="Delete memory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Audit log expansion */}
                {showAuditLog === memory.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <History className="h-3 w-3" />
                      Audit History
                    </p>
                    <div className="space-y-2">
                      {mockAuditLogs
                        .filter(log => log.memoryId === memory.id)
                        .map(log => (
                          <div key={log.id} className="p-2 rounded bg-background/50 text-xs">
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-xs", getActionBadge(log.action))}>
                                {log.action}
                              </Badge>
                              <span className="text-muted-foreground">
                                {new Date(log.createdAt).toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">by {log.userId}</span>
                            </div>
                            {log.reason && (
                              <p className="mt-1 text-muted-foreground">
                                Reason: {log.reason}
                              </p>
                            )}
                          </div>
                        ))}
                      {mockAuditLogs.filter(log => log.memoryId === memory.id).length === 0 && (
                        <p className="text-xs text-muted-foreground">No audit logs available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
