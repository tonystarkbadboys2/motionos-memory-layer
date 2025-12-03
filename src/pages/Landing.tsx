import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Brain, Zap, Shield, Code, Clock } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-mono">MotionOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link to="/auth" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm" className="font-mono">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-sm font-mono text-primary">Now in Public Beta</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6 leading-tight">
          Persistent Memory<br />
          <span className="text-primary">for AI Systems</span>
        </h1>
        
        <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-10">
          Give your AI applications long-term memory. Store, retrieve, and manage 
          contextual data across conversations and sessions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-mono text-lg px-8">
            <Link to="/auth?mode=signup">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-mono text-lg px-8">
            <Link to="/demo">Try Live Demo</Link>
          </Button>
        </div>

        {/* Code Preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="glass-panel rounded-xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <pre className="font-mono text-sm overflow-x-auto">
              <code className="text-muted-foreground">
{`// Store a memory
await motionos.memory.store({
  content: "User prefers dark mode",
  tags: ["preference", "ui"],
  sessionId: "chat_session_123"
});

// Retrieve with context
const memories = await motionos.memory.retrieve({
  tags: ["preference"],
  limit: 10
});`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold font-mono text-center mb-16">
            Built for Production AI
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Persistent Storage",
                description: "Memories survive restarts, deployments, and scaling. Your AI never forgets."
              },
              {
                icon: Zap,
                title: "Sub-10ms Retrieval",
                description: "Optimized for real-time AI applications. Memory retrieval that won't slow you down."
              },
              {
                icon: Shield,
                title: "User Isolation",
                description: "Row-level security ensures each user's memories are completely private."
              },
              {
                icon: Clock,
                title: "Memory Decay",
                description: "Natural forgetting curves. Older memories fade, keeping context relevant."
              },
              {
                icon: Code,
                title: "Simple API",
                description: "REST API with SDKs for JavaScript, Python, and more. Integrate in minutes."
              },
              {
                icon: Brain,
                title: "AI-Native",
                description: "Designed specifically for LLM context management and conversation memory."
              }
            ].map((feature, i) => (
              <div key={i} className="glass-panel rounded-xl p-6 hover:border-primary/30 transition-all">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold font-mono mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-mono text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-mono mb-6">
            Ready to give your AI memory?
          </h2>
          <p className="text-muted-foreground font-mono mb-8 max-w-xl mx-auto">
            Start with 1,000 free memories per month. No credit card required.
          </p>
          <Button asChild size="lg" className="font-mono">
            <Link to="/auth?mode=signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-sm">MotionOS © 2024</span>
          </div>
          <div className="flex gap-6">
            <Link to="/docs" className="text-sm font-mono text-muted-foreground hover:text-foreground">Docs</Link>
            <Link to="/pricing" className="text-sm font-mono text-muted-foreground hover:text-foreground">Pricing</Link>
            <a href="mailto:support@motionos.dev" className="text-sm font-mono text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
