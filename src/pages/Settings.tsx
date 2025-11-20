import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const Settings = () => {
  const [retentionDays, setRetentionDays] = useState([30]);
  const [sessionMemory, setSessionMemory] = useState(true);
  const [autoDecay, setAutoDecay] = useState(true);

  const handleExport = () => {
    toast.success("Memory export initiated");
  };

  const handleClear = () => {
    toast.success("All memories cleared");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-foreground">Settings</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Configure memory layer preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Memory Retention */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold font-mono text-foreground mb-6">Memory Retention</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="font-mono text-sm">Retention Period (Days)</Label>
                  <span className="font-mono text-sm text-primary">{retentionDays[0]} days</span>
                </div>
                <Slider
                  value={retentionDays}
                  onValueChange={setRetentionDays}
                  min={7}
                  max={365}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Memories older than this will be automatically deleted
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-border">
                <div>
                  <Label className="font-mono text-sm">Auto-Decay</Label>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    Gradually reduce memory strength over time
                  </p>
                </div>
                <Switch checked={autoDecay} onCheckedChange={setAutoDecay} />
              </div>
            </div>
          </div>

          {/* Session Settings */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold font-mono text-foreground mb-6">Session Settings</h2>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-mono text-sm">Session Memory</Label>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  Store memories per session for context isolation
                </p>
              </div>
              <Switch checked={sessionMemory} onCheckedChange={setSessionMemory} />
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold font-mono text-foreground mb-6">Data Management</h2>
            <div className="space-y-4">
              <Button
                onClick={handleExport}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono neon-glow"
              >
                Export All Memory Data
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full font-mono border-destructive text-destructive hover:bg-destructive/10"
              >
                Clear All Memory
              </Button>
              <p className="text-xs font-mono text-muted-foreground">
                Warning: Clearing all memory is permanent and cannot be undone
              </p>
            </div>
          </div>

          {/* API Configuration */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold font-mono text-foreground mb-4">
              API Configuration
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                <span className="font-mono text-sm text-muted-foreground">API Version</span>
                <span className="font-mono text-sm text-foreground">v1.0</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                <span className="font-mono text-sm text-muted-foreground">Rate Limit</span>
                <span className="font-mono text-sm text-foreground">1000 req/min</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                <span className="font-mono text-sm text-muted-foreground">Endpoint</span>
                <span className="font-mono text-sm text-primary">api.motionos.dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
