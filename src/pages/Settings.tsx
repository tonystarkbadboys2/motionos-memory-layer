import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Clock, Sparkles, Gauge, Archive, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [recencyWeighting, setRecencyWeighting] = useState(true);
  const [importanceScoring, setImportanceScoring] = useState(true);
  const [autoDecay, setAutoDecay] = useState(true);
  const [compression, setCompression] = useState(false);
  
  const [decayRate, setDecayRate] = useState([0.05]);
  const [compressionLevel, setCompressionLevel] = useState([60]);
  const [memoryLimit, setMemoryLimit] = useState([1000]);
  const [recencyBias, setRecencyBias] = useState([70]);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setRecencyWeighting(true);
    setImportanceScoring(true);
    setAutoDecay(true);
    setCompression(false);
    setDecayRate([0.05]);
    setCompressionLevel([60]);
    setMemoryLimit([1000]);
    setRecencyBias([70]);
    toast.info("Settings reset to defaults");
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground mt-1">Configure memory layer behavior and scoring algorithms</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Memory Scoring */}
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Memory Scoring
              </CardTitle>
              <CardDescription>Configure how memories are scored and ranked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Recency Weighting</Label>
                  <p className="text-sm text-muted-foreground">
                    Prioritize recent memories in retrieval results
                  </p>
                </div>
                <Switch checked={recencyWeighting} onCheckedChange={setRecencyWeighting} />
              </div>

              {recencyWeighting && (
                <div className="pl-4 border-l-2 border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Recency Bias</Label>
                    <Badge variant="outline" className="font-mono">{recencyBias[0]}%</Badge>
                  </div>
                  <Slider
                    value={recencyBias}
                    onValueChange={setRecencyBias}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values favor more recent memories
                  </p>
                </div>
              )}

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Importance Scoring</Label>
                  <p className="text-sm text-muted-foreground">
                    Use AI to evaluate memory significance
                  </p>
                </div>
                <Switch checked={importanceScoring} onCheckedChange={setImportanceScoring} />
              </div>
            </CardContent>
          </Card>

          {/* Decay Settings */}
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Decay Settings
              </CardTitle>
              <CardDescription>Control how memories fade over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Auto Decay</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically reduce memory strength over time
                  </p>
                </div>
                <Switch checked={autoDecay} onCheckedChange={setAutoDecay} />
              </div>

              {autoDecay && (
                <div className="pl-4 border-l-2 border-accent/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Decay Rate</Label>
                    <Badge variant="outline" className="font-mono">{decayRate[0]} / day</Badge>
                  </div>
                  <Slider
                    value={decayRate}
                    onValueChange={setDecayRate}
                    min={0.01}
                    max={0.2}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Strength reduction per day (0.01 = 1%)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Storage & Compression */}
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Storage & Compression
              </CardTitle>
              <CardDescription>Manage memory storage limits and compression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Memory Limit per User</Label>
                  <Badge variant="outline" className="font-mono">{memoryLimit[0].toLocaleString()}</Badge>
                </div>
                <Slider
                  value={memoryLimit}
                  onValueChange={setMemoryLimit}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Memory Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress old memories to save storage
                  </p>
                </div>
                <Switch checked={compression} onCheckedChange={setCompression} />
              </div>

              {compression && (
                <div className="pl-4 border-l-2 border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Compression Level</Label>
                    <Badge variant="outline" className="font-mono">{compressionLevel[0]}%</Badge>
                  </div>
                  <Slider
                    value={compressionLevel}
                    onValueChange={setCompressionLevel}
                    min={20}
                    max={90}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher compression saves space but loses detail
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Config Summary */}
          <Card className="glass-panel border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Current Configuration</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Recency</p>
                  <p className="font-mono text-primary">{recencyWeighting ? `${recencyBias}%` : "Off"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Importance</p>
                  <p className="font-mono text-primary">{importanceScoring ? "AI-scored" : "Off"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Decay</p>
                  <p className="font-mono text-accent">{autoDecay ? `${decayRate}/day` : "Off"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Storage</p>
                  <p className="font-mono">{memoryLimit.toLocaleString()} max</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
