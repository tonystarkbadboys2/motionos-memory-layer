import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Shield, Layers, ShieldCheck } from "lucide-react";
import { EpisodicTimeline } from "@/components/memory/EpisodicTimeline";
import { AuditPanel } from "@/components/memory/AuditPanel";
import { ContextReconstruction } from "@/components/memory/ContextReconstruction";
import { ConfidenceGating } from "@/components/memory/ConfidenceGating";

const Timeline = () => {
  const [activeTab, setActiveTab] = useState("timeline");

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">Memory Events</h1>
          <p className="text-muted-foreground mt-1">
            Full memory management with episodic timeline, audit tools, and context reconstruction
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Context</span>
            </TabsTrigger>
            <TabsTrigger value="gating" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Gating</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <EpisodicTimeline />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditPanel />
          </TabsContent>

          <TabsContent value="context" className="mt-6">
            <ContextReconstruction />
          </TabsContent>

          <TabsContent value="gating" className="mt-6">
            <ConfidenceGating />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Timeline;
