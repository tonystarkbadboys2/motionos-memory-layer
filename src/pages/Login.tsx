import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just navigate to dashboard
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-foreground">
          <div>
            <h1 className="text-5xl font-bold mb-3 neon-glow">
              MotionOS
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              The memory operating system for AI that never forgets
            </p>
          </div>
          
          <div className="space-y-8 max-w-md">
            <div className="glass-panel rounded-lg p-6 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-glow" />
                <div>
                  <p className="font-semibold mb-1">Persistent Memory</p>
                  <p className="text-sm text-muted-foreground">
                    Store and retrieve context across infinite sessions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-lg p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 animate-pulse-glow" />
                <div>
                  <p className="font-semibold mb-1">System-Level Control</p>
                  <p className="text-sm text-muted-foreground">
                    Manage memory retention, decay, and retrieval patterns
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-lg p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-glow" />
                <div>
                  <p className="font-semibold mb-1">Developer-First API</p>
                  <p className="text-sm text-muted-foreground">
                    Simple, powerful API for seamless integration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to access your memory layer
            </p>
          </div>

          <div className="glass-panel rounded-xl p-8 space-y-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-11 border-border hover:bg-secondary/50 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-secondary/50 border-border transition-all focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-secondary/50 border-border transition-all focus:border-primary"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all neon-glow"
              >
                Sign in
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Start free trial
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
