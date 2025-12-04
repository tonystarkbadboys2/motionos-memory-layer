import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check, Database, Search, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ApiPlayground = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const examples = [
    {
      title: "Store Memory",
      description: "Persist a new memory to the user's memory store",
      method: "POST",
      endpoint: "/v1/memory/store",
      icon: Database,
      code: `curl -X POST https://api.motionos.ai/v1/memory/store \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "content": "Customer prefers email communication",
    "tags": ["preference", "communication"],
    "metadata": {
      "source": "support_ticket",
      "ticket_id": "TKT-4892",
      "importance": 0.85
    }
  }'`,
      response: `{
  "success": true,
  "memory": {
    "id": "mem_abc123",
    "user_id": "user_123",
    "content": "Customer prefers email communication",
    "tags": ["preference", "communication"],
    "strength": 1.0,
    "created_at": "2024-01-15T14:32:18Z"
  }
}`
    },
    {
      title: "Retrieve Memories",
      description: "Query memories with filtering and relevance scoring",
      method: "POST",
      endpoint: "/v1/memory/retrieve",
      icon: Search,
      code: `curl -X POST https://api.motionos.ai/v1/memory/retrieve \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "query": "What are the customer communication preferences?",
    "limit": 5,
    "min_strength": 0.3,
    "tags": ["preference"]
  }'`,
      response: `{
  "success": true,
  "memories": [
    {
      "id": "mem_abc123",
      "content": "Customer prefers email communication",
      "relevance": 0.94,
      "strength": 0.87,
      "tags": ["preference", "communication"],
      "created_at": "2024-01-15T14:32:18Z"
    },
    {
      "id": "mem_def456",
      "content": "Responds best to detailed explanations",
      "relevance": 0.72,
      "strength": 0.65,
      "tags": ["preference", "support"],
      "created_at": "2024-01-10T09:15:00Z"
    }
  ],
  "query_time_ms": 45
}`
    },
    {
      title: "Clear Memories",
      description: "Delete memories by user, tags, or time range",
      method: "DELETE",
      endpoint: "/v1/memory/clear",
      icon: Trash2,
      code: `curl -X DELETE https://api.motionos.ai/v1/memory/clear \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "tags": ["temporary"],
    "older_than": "2024-01-01T00:00:00Z"
  }'`,
      response: `{
  "success": true,
  "deleted_count": 12,
  "message": "Successfully cleared 12 memories matching criteria"
}`
    },
    {
      title: "Chat with Memory",
      description: "AI chat that automatically retrieves relevant context",
      method: "POST",
      endpoint: "/v1/chat",
      icon: Sparkles,
      code: `curl -X POST https://api.motionos.ai/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "message": "What issues has this customer had before?",
    "session_id": "session_xyz",
    "store_response": true
  }'`,
      response: `{
  "success": true,
  "response": "Based on their history, this customer has had 3 previous issues: export timeouts (resolved by increasing limits), CSV encoding problems (fixed with UTF-8), and dashboard performance (cache optimization applied). They're on the Pro plan and generally satisfied.",
  "memories_used": 3,
  "confidence": 0.92,
  "tokens_used": 245
}`
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">API Preview</h1>
          <p className="text-muted-foreground mt-1">Explore the MotionOS API with example requests and responses</p>
        </div>

        {/* Quick Reference */}
        <Card className="glass-panel border-primary/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-muted-foreground">Base URL:</span>
              <code className="px-2 py-1 rounded bg-muted font-mono text-sm text-primary">
                https://api.motionos.ai
              </code>
              <span className="text-sm text-muted-foreground ml-4">Auth:</span>
              <code className="px-2 py-1 rounded bg-muted font-mono text-sm">
                Bearer YOUR_API_KEY
              </code>
            </div>
          </CardContent>
        </Card>

        {/* API Examples */}
        <div className="space-y-6">
          {examples.map((example, index) => (
            <Card key={example.title} className="glass-panel border-border overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <example.icon className="h-4 w-4 text-primary" />
                    </div>
                    {example.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={`font-mono ${
                      example.method === "POST" ? "bg-green-500/20 text-green-400" :
                      example.method === "DELETE" ? "bg-destructive/20 text-destructive" :
                      "bg-primary/20 text-primary"
                    }`}>
                      {example.method}
                    </Badge>
                    <code className="text-sm font-mono text-muted-foreground">{example.endpoint}</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="request" className="w-full">
                  <div className="px-6 border-b border-border">
                    <TabsList className="bg-transparent h-10 p-0 gap-4">
                      <TabsTrigger value="request" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">
                        Request
                      </TabsTrigger>
                      <TabsTrigger value="response" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0">
                        Response
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="request" className="m-0">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => copyToClipboard(example.code, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <pre className="p-4 overflow-x-auto text-sm bg-background/50">
                        <code className="text-foreground/90">{example.code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="response" className="m-0">
                    <pre className="p-4 overflow-x-auto text-sm bg-background/50">
                      <code className="text-primary/90">{example.response}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SDKs Coming Soon */}
        <Card className="glass-panel border-accent/30">
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-1">SDKs Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Official SDKs for Python, Node.js, and Go are in development
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline">Python</Badge>
              <Badge variant="outline">Node.js</Badge>
              <Badge variant="outline">Go</Badge>
              <Badge variant="outline">Ruby</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApiPlayground;
