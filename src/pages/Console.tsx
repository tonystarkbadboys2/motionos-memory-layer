import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";

interface Memory {
  id: string;
  userId: string;
  sessionId: string;
  content: string;
  tags: string[];
  source: string;
  timestamp: Date;
}

const Console = () => {
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("");
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "mem_001",
      userId: "user_12345",
      sessionId: "sess_abc",
      content: "User prefers dark mode interface",
      tags: ["preference", "ui"],
      source: "settings",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "mem_002",
      userId: "user_12345",
      sessionId: "sess_abc",
      content: "Requested help with API integration",
      tags: ["support", "api"],
      source: "chat",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ]);

  useEffect(() => {
    // Start the memory stream
    memoryStream.start();
    
    // Subscribe to new memory events
    const unsubscribe = memoryStream.subscribe((event: MemoryEvent) => {
      if (event.type === 'store' && event.content) {
        const newMemory: Memory = {
          id: event.id,
          userId: event.userId,
          sessionId: event.sessionId || 'default',
          content: event.content,
          tags: ['realtime', 'stream'],
          source: 'websocket',
          timestamp: event.timestamp,
        };
        
        setMemories(prev => [newMemory, ...prev]);
        toast.success("New memory received via stream");
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleStoreMemory = () => {
    if (!userId || !content) {
      toast.error("User ID and Memory content are required");
      return;
    }

    const newMemory: Memory = {
      id: `mem_${Date.now()}`,
      userId,
      sessionId: sessionId || "default",
      content,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      source: source || "console",
      timestamp: new Date(),
    };

    setMemories([newMemory, ...memories]);
    toast.success("Memory stored successfully");
    
    // Clear form
    setUserId("");
    setSessionId("");
    setContent("");
    setTags("");
    setSource("");
  };

  const handleClearMemories = () => {
    setMemories([]);
    toast.success("All memories cleared");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground">Memory Console</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Store and retrieve memory data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold font-mono text-foreground mb-6">Store Memory</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="font-mono text-sm">User ID *</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="user_12345"
                  className="bg-secondary/50 border-border font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionId" className="font-mono text-sm">Session ID</Label>
                <Input
                  id="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="sess_abc123"
                  className="bg-secondary/50 border-border font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="font-mono text-sm">Memory Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter memory content..."
                  className="bg-secondary/50 border-border font-mono min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="font-mono text-sm">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="preference, api, support"
                  className="bg-secondary/50 border-border font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source" className="font-mono text-sm">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="chat, api, settings"
                  className="bg-secondary/50 border-border font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleStoreMemory}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono neon-glow"
                >
                  Store Memory
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleClearMemories}
                  className="font-mono border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Memory List */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-mono text-foreground">Stored Memories</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
                <span className="text-xs font-mono text-primary">Streaming</span>
              </div>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {memories.length === 0 ? (
                <p className="text-muted-foreground font-mono text-sm text-center py-8">
                  No memories stored yet
                </p>
              ) : (
                memories.map((memory, index) => (
                  <div
                    key={memory.id}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all animate-slide-in-up"
                    style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-xs text-primary">{memory.id}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {memory.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-foreground mb-2">{memory.content}</p>
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span>User: {memory.userId}</span>
                      <span>•</span>
                      <span>Session: {memory.sessionId}</span>
                      {memory.source && (
                        <>
                          <span>•</span>
                          <span>Source: {memory.source}</span>
                        </>
                      )}
                    </div>
                    {memory.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {memory.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Console;
