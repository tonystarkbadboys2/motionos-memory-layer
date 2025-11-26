import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";
import { formatDistanceToNow } from "date-fns";

interface Message {
  role: "user" | "agent";
  content: string;
  time: string;
}

interface Ticket {
  id: string;
  title: string;
  similarity: string;
}

const Helpdesk = () => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    { role: "user", content: "How do I integrate the API with my React app?", time: new Date().toLocaleTimeString() },
    { role: "agent", content: "I'll help you with that. First, install our SDK...", time: new Date().toLocaleTimeString() },
  ]);

  const [similarTickets, setSimilarTickets] = useState<Ticket[]>([
    { id: "#2847", title: "React API integration", similarity: "94%" },
    { id: "#2723", title: "SDK setup help", similarity: "87%" },
    { id: "#2619", title: "Authentication with React", similarity: "82%" },
  ]);

  const [suggestedReply, setSuggestedReply] = useState(
    "Based on your conversation history and similar resolved tickets, here's what I recommend: Install our React SDK with `npm install @motionos/react-sdk`, then initialize it with your API key. I'll send you a complete setup guide with code examples."
  );

  useEffect(() => {
    memoryStream.start();
    
    const unsubscribe = memoryStream.subscribe((event: MemoryEvent) => {
      // Add user questions from memory events
      if (event.type === 'store' && event.content) {
        const newMessage: Message = {
          role: "user",
          content: event.content,
          time: new Date().toLocaleTimeString(),
        };
        
        setConversationHistory(prev => [...prev, newMessage]);
        
        // Generate agent response after a short delay
        setTimeout(() => {
          const agentResponse: Message = {
            role: "agent",
            content: `I can help you with "${event.content.substring(0, 30)}...". Let me check similar resolved cases.`,
            time: new Date().toLocaleTimeString(),
          };
          setConversationHistory(prev => [...prev, agentResponse]);
          
          // Update suggested reply based on new context
          setSuggestedReply(
            `Based on the latest query about "${event.content.substring(0, 40)}...", I recommend checking our documentation and reviewing similar resolved tickets. The memory system has identified relevant patterns from past conversations.`
          );
        }, 1500);
        
        // Add similar ticket
        const ticketNum = Math.floor(Math.random() * 9000) + 1000;
        const similarity = Math.floor(Math.random() * 20) + 75;
        setSimilarTickets(prev => [
          { 
            id: `#${ticketNum}`, 
            title: event.content.substring(0, 40), 
            similarity: `${similarity}%` 
          },
          ...prev.slice(0, 4)
        ]);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground">Smart Support Memory</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            AI-powered helpdesk with conversation memory
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation History */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold font-mono text-foreground">Conversation History</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
                <span className="text-xs font-mono text-primary">Live</span>
              </div>
            </div>
            <div className="space-y-4">
              {conversationHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    msg.role === "user"
                      ? "bg-secondary/30 border border-border/50"
                      : "bg-primary/10 border border-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-xs text-primary">
                      {msg.role === "user" ? "User" : "Agent"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="font-mono text-sm text-foreground">{msg.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-primary">Memory Context:</span> Full conversation history
                available for context-aware responses
              </p>
            </div>
          </div>

          {/* Similar Tickets */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold font-mono text-foreground">Similar Tickets</h2>
            </div>
            <div className="space-y-3 mb-6">
              {similarTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs text-primary">{ticket.id}</span>
                      <p className="font-mono text-sm text-foreground mt-1">{ticket.title}</p>
                    </div>
                    <span className="font-mono text-xs text-accent">{ticket.similarity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-primary">Memory Retrieval:</span> Similar past tickets
                automatically surfaced using semantic search
              </p>
            </div>

            {/* Suggested Reply */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-bold font-mono text-foreground">Suggested Reply</h3>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in">
                <p className="font-mono text-sm text-foreground">
                  {suggestedReply}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Helpdesk;
