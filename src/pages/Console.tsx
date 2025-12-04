import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  memories?: number;
}

const Console = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your MotionOS-powered assistant. I have access to the memory layer, so I can remember context from our conversation and recall relevant information. How can I help you today?",
      memories: 0
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo responses based on keywords
    let response = "";
    let memoriesUsed = 0;
    
    if (userMessage.toLowerCase().includes("export") || userMessage.toLowerCase().includes("csv")) {
      response = "Based on the memory context, I can see this customer (Sarah Chen from Acme Corp) has experienced export issues before. Their last export timeout was 3 months ago, which was resolved by increasing the timeout limit. They're on the Pro plan with ~50,000 records. I'd recommend checking if the same timeout issue is occurring.";
      memoriesUsed = 3;
    } else if (userMessage.toLowerCase().includes("customer") || userMessage.toLowerCase().includes("history")) {
      response = "I found 3 relevant memories for this customer:\n\n1. **Account Status**: Pro tier, 2 years active\n2. **Past Issues**: 12 total tickets, 4.8/5 satisfaction\n3. **Preferences**: Prefers detailed technical explanations, responds well to step-by-step guides\n\nTheir most recent interaction was 3 weeks ago regarding dashboard performance.";
      memoriesUsed = 4;
    } else if (userMessage.toLowerCase().includes("suggest") || userMessage.toLowerCase().includes("response")) {
      response = "Based on the context and customer history, here's a suggested response:\n\n*\"Hi [Customer], I can see from our records that you've dealt with a similar issue before. Based on your account's data volume, I'd recommend trying [specific solution]. If that doesn't work, I can escalate this to our engineering team who helped resolve your previous case.\"*\n\nThis incorporates their preference for detailed explanations and references their history.";
      memoriesUsed = 2;
    } else {
      response = "I've processed your request. The MotionOS memory layer allows me to maintain context across conversations and recall relevant information from previous interactions. Is there anything specific about a customer or ticket you'd like me to look up?";
      memoriesUsed = 1;
    }
    
    setMessages(prev => [...prev, {
      role: "assistant",
      content: response,
      memories: memoriesUsed
    }]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    simulateResponse(userMessage);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold font-mono text-foreground">AI Console</h1>
          <p className="text-muted-foreground">Chat with memory-enhanced AI assistant</p>
        </div>

        <Card className="glass-panel border-border flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.memories !== undefined && message.memories > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {message.memories} memories used
                      </Badge>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about customer history, suggest responses..."
                className="flex-1 bg-background/50"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Try: "What's this customer's history?" or "Suggest a response for the export issue"
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Console;
