import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Docs = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      id: "store",
      method: "POST",
      path: "/functions/v1/memory-store",
      title: "Store Memory",
      description: "Store a new memory in the user's memory bank.",
      request: `{
  "content": "User prefers dark mode",
  "sessionId": "sess_abc123",
  "tags": ["preference", "ui"],
  "source": "chat",
  "metadata": { "priority": "high" },
  "expiresIn": 720 // hours (optional)
}`,
      response: `{
  "status": "success",
  "data": {
    "memory_id": "uuid-here",
    "content": "User prefers dark mode",
    "session_id": "sess_abc123",
    "tags": ["preference", "ui"],
    "source": "chat",
    "created_at": "2024-01-20T10:30:00Z",
    "expires_at": "2024-02-20T10:30:00Z"
  }
}`,
    },
    {
      id: "retrieve",
      method: "GET",
      path: "/functions/v1/memory-retrieve",
      title: "Retrieve Memories",
      description: "Get memories with optional filtering.",
      request: `Query Parameters:
  - session_id: Filter by session
  - tag: Filter by tag
  - limit: Max results (default 50)
  - offset: Pagination offset`,
      response: `{
  "status": "success",
  "data": [
    {
      "memory_id": "uuid-here",
      "content": "User prefers dark mode",
      "session_id": "sess_abc123",
      "tags": ["preference", "ui"],
      "source": "chat",
      "strength": 95.5,
      "created_at": "2024-01-20T10:30:00Z",
      "expires_at": null
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}`,
    },
    {
      id: "clear",
      method: "DELETE",
      path: "/functions/v1/memory-clear",
      title: "Clear Memories",
      description: "Delete specific memory, session memories, or all user memories.",
      request: `{
  "memoryId": "uuid-here", // Delete specific
  // OR
  "sessionId": "sess_abc123" // Delete session
  // OR omit both to delete ALL
}`,
      response: `{
  "status": "success",
  "data": {
    "deleted_count": 15
  }
}`,
    },
    {
      id: "chat",
      method: "POST",
      path: "/functions/v1/chat",
      title: "AI Chat with Memory",
      description: "Chat with AI that has access to user's memories. Supports streaming.",
      request: `{
  "messages": [
    { "role": "user", "content": "What are my preferences?" }
  ],
  "sessionId": "sess_abc123"
}`,
      response: `// Server-Sent Events stream
data: {"choices":[{"delta":{"content":"Based on"}}]}
data: {"choices":[{"delta":{"content":" your memories"}}]}
data: [DONE]`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-mono">MotionOS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/app" className="text-sm font-mono text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Button asChild size="sm" className="font-mono">
              <Link to="/auth?mode=signup">Get API Key</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="font-mono text-sm">Back to home</span>
        </Link>

        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold font-mono mb-4">API Documentation</h1>
          <p className="text-muted-foreground font-mono mb-12">
            Everything you need to integrate MotionOS Memory Layer into your application.
          </p>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-mono mb-4">Authentication</h2>
            <div className="glass-panel rounded-xl p-6">
              <p className="font-mono text-sm mb-4">
                All API requests require authentication via Bearer token. Include your access token in the Authorization header:
              </p>
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <pre className="font-mono text-sm text-primary">
                  Authorization: Bearer YOUR_ACCESS_TOKEN
                </pre>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-4">
                Get your access token by signing in and checking your dashboard.
              </p>
            </div>
          </section>

          {/* Base URL */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-mono mb-4">Base URL</h2>
            <div className="glass-panel rounded-xl p-6">
              <div className="bg-background/50 rounded-lg p-4 border border-border/50 flex items-center justify-between">
                <pre className="font-mono text-sm">
                  https://tshejrkjybjhvpujbmsk.supabase.co
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("https://tshejrkjybjhvpujbmsk.supabase.co", "base")}
                >
                  {copied === "base" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </section>

          {/* Endpoints */}
          <section>
            <h2 className="text-2xl font-bold font-mono mb-6">Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="glass-panel rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold font-mono">{endpoint.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                          endpoint.method === "POST" 
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : endpoint.method === "GET"
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="font-mono text-sm text-muted-foreground">
                          {endpoint.path}
                        </code>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint.path, endpoint.id)}
                    >
                      {copied === endpoint.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <p className="font-mono text-sm text-muted-foreground mb-4">
                    {endpoint.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-mono text-xs text-muted-foreground mb-2">Request</h4>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                        <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {endpoint.request}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-muted-foreground mb-2">Response</h4>
                      <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                        <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                          {endpoint.response}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Docs;
