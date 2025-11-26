import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Clock, Activity, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";
import { formatDistanceToNow } from "date-fns";

const Index = () => {
  const [totalMemories, setTotalMemories] = useState(1247893);
  const [apiCalls, setApiCalls] = useState(45230);
  const [activeSessions, setActiveSessions] = useState(147);
  const [recentActivity, setRecentActivity] = useState<MemoryEvent[]>([]);

  useEffect(() => {
    memoryStream.start();

    const unsubscribe = memoryStream.subscribe((event) => {
      // Update metrics based on event type
      if (event.type === 'store') {
        setTotalMemories(prev => prev + 1);
        setApiCalls(prev => prev + 1);
      } else if (event.type === 'retrieve') {
        setApiCalls(prev => prev + 1);
      } else if (event.type === 'session_start') {
        setActiveSessions(prev => prev + 1);
      }

      // Add to recent activity (keep last 5)
      setRecentActivity(prev => [event, ...prev].slice(0, 5));
    });

    return () => {
      unsubscribe();
      memoryStream.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border glass-panel">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-primary neon-glow">MotionOS</h1>
          </div>
          <Link to="/login">
            <Button variant="outline" className="font-mono">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center space-y-8">
          <div className="inline-block px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-mono text-primary mb-4">
            Memory Layer for AI Systems
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            Give AI systems
            <br />
            <span className="text-primary neon-glow">long-term memory</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            MotionOS lets AI applications store, retrieve, and manage persistent memory—so your AI doesn't forget between sessions.
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
            <div className="glass-panel rounded-xl p-6 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-mono text-muted-foreground">Memories Stored</p>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold font-mono text-foreground">{totalMemories.toLocaleString()}</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-mono text-muted-foreground">API Calls Today</p>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold font-mono text-foreground">{apiCalls.toLocaleString()}</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-mono text-muted-foreground">Active Sessions</p>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <p className="text-3xl font-bold font-mono text-foreground">{activeSessions}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-8">
            <Link to="/login">
              <Button size="lg" className="font-mono text-base">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="font-mono text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-panel rounded-xl p-8 border border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold font-mono">Live Memory Stream</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-mono text-muted-foreground">Streaming</span>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 font-mono">Waiting for memory events...</p>
            ) : (
              recentActivity.map((event) => (
                <div 
                  key={event.id} 
                  className="glass-panel rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-all animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'success' ? 'bg-primary' : 
                        event.status === 'warning' ? 'bg-accent' : 'bg-destructive'
                      }`}></div>
                      <span className="font-mono text-sm text-foreground">
                        {event.type === 'store' ? '📝 Memory Stored' :
                         event.type === 'retrieve' ? '🔍 Memory Retrieved' :
                         event.type === 'session_start' ? '🚀 Session Started' : event.type}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-2 ml-5">
                    <p className="text-sm text-muted-foreground font-mono">{event.userId}</p>
                    {event.content && (
                      <p className="text-sm text-foreground mt-1">{event.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What does it actually do?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A memory operating system for AI—enabling persistent context across sessions, intelligent retrieval, and structured memory management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-xl p-8 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-mono">Store Memories</h3>
            <p className="text-muted-foreground leading-relaxed">
              AI systems write important context, user preferences, and conversation history to persistent memory storage—tagged and structured for easy retrieval.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-mono">Intelligent Retrieval</h3>
            <p className="text-muted-foreground leading-relaxed">
              When AI needs context, MotionOS retrieves relevant memories based on semantic similarity, recency, and importance—delivering the right information at the right time.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-mono">Memory Decay</h3>
            <p className="text-muted-foreground leading-relaxed">
              Memories naturally fade over time unless reinforced—mimicking human memory to keep your AI's context fresh and relevant while pruning outdated information.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 hover:border-primary/30 transition-all">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-mono">Developer API</h3>
            <p className="text-muted-foreground leading-relaxed">
              Simple REST API for writing and querying memories. Integrate memory capabilities into your AI product with just a few API calls—no infrastructure headaches.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for AI developers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're building chatbots, AI assistants, or autonomous agents—give them the memory they need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-primary">
            <h3 className="text-xl font-bold mb-2 font-mono">AI Chatbots</h3>
            <p className="text-muted-foreground">
              Remember user preferences, conversation history, and context across sessions.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-accent">
            <h3 className="text-xl font-bold mb-2 font-mono">AI Assistants</h3>
            <p className="text-muted-foreground">
              Maintain long-term context about projects, tasks, and user workflows.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-primary">
            <h3 className="text-xl font-bold mb-2 font-mono">Autonomous Agents</h3>
            <p className="text-muted-foreground">
              Store learned behaviors, task history, and environmental context over time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="glass-panel rounded-2xl p-12 text-center neon-glow-strong">
          <h2 className="text-4xl font-bold mb-4">Ready to add memory to your AI?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start building with MotionOS today. View the demo dashboard or sign in to get started.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="font-mono text-base">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="font-mono text-base">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border glass-panel mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-mono">
              © 2024 MotionOS. Memory Layer for AI Systems.
            </p>
            <div className="flex gap-6">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
                Dashboard
              </Link>
              <Link to="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
                API Docs
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
