import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Play } from "lucide-react";
import { toast } from "sonner";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";

const ApiPlayground = () => {
  const [apiKey, setApiKey] = useState("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
  const [copied, setCopied] = useState<string | null>(null);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    memoryStream.start();
    
    const unsubscribe = memoryStream.subscribe((event: MemoryEvent) => {
      setApiCallCount(prev => prev + 1);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const executeApiCall = (exampleId: string) => {
    setIsExecuting(true);
    
    // Simulate API call
    setTimeout(() => {
      const timestamp = new Date().toISOString();
      const mockResponse = {
        status: "success",
        data: {
          memory_id: `mem_${Date.now()}`,
          user_id: "user_12345",
          session_id: "sess_abc123",
          content: exampleId === 'store' ? "User prefers dark mode" : "Retrieved memory data",
          tags: ["preference", "ui"],
          created_at: timestamp,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      setLastResponse(mockResponse);
      setApiCallCount(prev => prev + 1);
      setIsExecuting(false);
      toast.success(`API call executed: ${exampleId}`);
    }, 1200);
  };

  const codeExamples = [
    {
      id: "store",
      title: "Store Memory",
      method: "POST",
      endpoint: "/api/v1/memory/store",
      code: `curl -X POST https://api.motionos.dev/v1/memory/store \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_12345",
    "session_id": "sess_abc123",
    "content": "User prefers dark mode",
    "tags": ["preference", "ui"],
    "source": "settings"
  }'`,
    },
    {
      id: "retrieve",
      title: "Retrieve Memory",
      method: "GET",
      endpoint: "/api/v1/memory/retrieve",
      code: `curl -X GET https://api.motionos.dev/v1/memory/retrieve \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G \\
  -d "user_id=user_12345" \\
  -d "session_id=sess_abc123"`,
    },
    {
      id: "delete",
      title: "Clear User Memory",
      method: "DELETE",
      endpoint: "/api/v1/memory/clear",
      code: `curl -X DELETE https://api.motionos.dev/v1/memory/clear \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d "user_id=user_12345"`,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground">API Playground</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Test MotionOS Memory Layer API endpoints
          </p>
        </div>

        {/* API Key Section */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-mono text-foreground">API Key</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
              <span className="text-xs font-mono text-primary">{apiCallCount} calls today</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="font-mono text-sm">
              Your API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-secondary/50 border-border font-mono"
                type="password"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(apiKey, "apiKey")}
                className="font-mono border-border"
              >
                {copied === "apiKey" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              This is a demo key. Replace with your production key.
            </p>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-6">
          {codeExamples.map((example) => (
            <div key={example.id} className="glass-panel rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold font-mono text-foreground">
                    {example.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono ${
                        example.method === "POST"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : example.method === "GET"
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {example.method}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {example.endpoint}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => executeApiCall(example.id)}
                    disabled={isExecuting}
                    className="font-mono border-border bg-primary/10 hover:bg-primary/20"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {isExecuting ? "Running..." : "Execute"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className="font-mono border-border"
                  >
                    {copied === example.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <pre className="text-xs font-mono text-foreground overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Live Response */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-mono text-foreground">
              {lastResponse ? "Live Response" : "Example Response"}
            </h3>
            {lastResponse && (
              <span className="text-xs font-mono text-primary animate-pulse-glow">
                ● Just executed
              </span>
            )}
          </div>
          <div className="bg-background/50 rounded-lg p-4 border border-border/50">
            <pre className="text-xs font-mono text-foreground overflow-x-auto">
              <code>
                {lastResponse ? JSON.stringify(lastResponse, null, 2) : `{
  "status": "success",
  "data": {
    "memory_id": "mem_a1b2c3d4",
    "user_id": "user_12345",
    "session_id": "sess_abc123",
    "content": "User prefers dark mode",
    "tags": ["preference", "ui"],
    "created_at": "2024-01-20T10:30:00Z",
    "expires_at": "2024-02-20T10:30:00Z"
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApiPlayground;
