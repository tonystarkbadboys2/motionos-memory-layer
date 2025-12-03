import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { streamChat, storeMemory, retrieveMemories, clearMemories } from "@/lib/api";
import { toast } from "sonner";
import { 
  Brain, Send, Loader2, LogOut, Database, MessageSquare, 
  Settings, Trash2, Plus, Clock 
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Memory {
  memory_id: string;
  content: string;
  tags: string[];
  strength: number;
  created_at: string;
}

const AppPage = () => {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "memories">("chat");
  const [newMemory, setNewMemory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (session?.access_token) {
      loadMemories();
    }
  }, [session]);

  const loadMemories = async () => {
    if (!session?.access_token) return;
    const result = await retrieveMemories(session.access_token, { limit: 20 });
    if (result.status === "success") {
      setMemories(result.data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !session?.access_token) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMessage],
        token: session.access_token,
        onDelta: updateAssistant,
        onDone: () => {
          setIsLoading(false);
          loadMemories(); // Refresh memories after chat
        },
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      toast.error("Failed to send message");
      setIsLoading(false);
    }
  };

  const handleAddMemory = async () => {
    if (!newMemory.trim() || !session?.access_token) return;
    
    const result = await storeMemory(session.access_token, {
      content: newMemory.trim(),
      tags: ["manual"],
      source: "dashboard",
    });
    
    if (result.status === "success") {
      toast.success("Memory stored");
      setNewMemory("");
      loadMemories();
    } else {
      toast.error(result.error || "Failed to store memory");
    }
  };

  const handleClearMemory = async (memoryId: string) => {
    if (!session?.access_token) return;
    
    const result = await clearMemories(session.access_token, { memoryId });
    if (result.status === "success") {
      toast.success("Memory deleted");
      loadMemories();
    } else {
      toast.error(result.error || "Failed to delete memory");
    }
  };

  const handleClearAll = async () => {
    if (!session?.access_token) return;
    
    const result = await clearMemories(session.access_token);
    if (result.status === "success") {
      toast.success(`Cleared ${result.data.deleted_count} memories`);
      setMemories([]);
    } else {
      toast.error(result.error || "Failed to clear memories");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold font-mono">MotionOS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm transition-colors ${
              activeTab === "chat" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "hover:bg-secondary/50"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("memories")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm transition-colors ${
              activeTab === "memories" 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "hover:bg-secondary/50"
            }`}
          >
            <Database className="h-4 w-4" />
            Memories
            <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded">
              {memories.length}
            </span>
          </button>
          <Link
            to="/docs"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm hover:bg-secondary/50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            API Docs
          </Link>
        </nav>

        <div className="pt-4 border-t border-border/50">
          <div className="px-3 py-2 mb-2">
            <p className="font-mono text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start font-mono text-sm"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === "chat" ? (
          <>
            {/* Chat Header */}
            <header className="border-b border-border/50 p-4">
              <h1 className="font-bold font-mono">AI Assistant with Memory</h1>
              <p className="text-sm text-muted-foreground font-mono">
                Your conversations are remembered
              </p>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-mono text-muted-foreground">
                    Start a conversation. I'll remember what you tell me.
                  </p>
                </div>
              )}
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 border border-border/50"
                    }`}
                  >
                    <p className="font-mono text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 border border-border/50 rounded-xl px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 font-mono"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <>
            {/* Memories Header */}
            <header className="border-b border-border/50 p-4 flex items-center justify-between">
              <div>
                <h1 className="font-bold font-mono">Your Memories</h1>
                <p className="text-sm text-muted-foreground font-mono">
                  {memories.length} memories stored
                </p>
              </div>
              {memories.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="font-mono">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </header>

            {/* Add Memory */}
            <div className="p-4 border-b border-border/50">
              <div className="flex gap-2">
                <Input
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  placeholder="Add a new memory..."
                  className="flex-1 font-mono"
                />
                <Button onClick={handleAddMemory} disabled={!newMemory.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Memory List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {memories.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-mono text-muted-foreground">
                    No memories yet. Chat with the AI or add one manually.
                  </p>
                </div>
              ) : (
                memories.map((memory) => (
                  <div
                    key={memory.memory_id}
                    className="glass-panel rounded-lg p-4 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm flex-1">{memory.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleClearMemory(memory.memory_id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(memory.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">{Math.round(memory.strength)}%</span> strength
                      </div>
                      {memory.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AppPage;
