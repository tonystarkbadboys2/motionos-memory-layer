import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { memoryStream, MemoryEvent } from "@/utils/memoryStream";

interface TimelineItem {
  id: string;
  time: string;
  content: string;
  decay: number;
  age: number; // in milliseconds
}

const Timeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([
    { id: "1", time: "Just now", content: "API integration completed", decay: 0, age: 0 },
    { id: "2", time: "5 min ago", content: "User preferences updated", decay: 10, age: 5 * 60 * 1000 },
    { id: "3", time: "15 min ago", content: "Support ticket resolved", decay: 20, age: 15 * 60 * 1000 },
    { id: "4", time: "1 hour ago", content: "Database schema modified", decay: 40, age: 60 * 60 * 1000 },
    { id: "5", time: "3 hours ago", content: "Authentication flow tested", decay: 60, age: 3 * 60 * 60 * 1000 },
    { id: "6", time: "6 hours ago", content: "Payment integration configured", decay: 75, age: 6 * 60 * 60 * 1000 },
    { id: "7", time: "12 hours ago", content: "Email templates created", decay: 85, age: 12 * 60 * 60 * 1000 },
    { id: "8", time: "1 day ago", content: "Project kickoff meeting", decay: 90, age: 24 * 60 * 60 * 1000 },
  ]);

  useEffect(() => {
    memoryStream.start();
    
    const unsubscribe = memoryStream.subscribe((event: MemoryEvent) => {
      if (event.content) {
        const newItem: TimelineItem = {
          id: event.id,
          time: "Just now",
          content: event.content,
          decay: 0,
          age: 0,
        };
        
        setTimelineData(prev => [newItem, ...prev.slice(0, 15)]);
      }
    });

    // Update decay values over time
    const decayInterval = setInterval(() => {
      setTimelineData(prev => prev.map(item => {
        const newAge = item.age + 1000;
        const hoursOld = newAge / (1000 * 60 * 60);
        const newDecay = Math.min(90, Math.floor((hoursOld / 24) * 90));
        
        // Update time labels
        let timeLabel = "Just now";
        if (hoursOld >= 24) {
          timeLabel = `${Math.floor(hoursOld / 24)} day${Math.floor(hoursOld / 24) > 1 ? 's' : ''} ago`;
        } else if (hoursOld >= 1) {
          timeLabel = `${Math.floor(hoursOld)} hour${Math.floor(hoursOld) > 1 ? 's' : ''} ago`;
        } else if (newAge >= 60000) {
          timeLabel = `${Math.floor(newAge / 60000)} min ago`;
        }
        
        return { ...item, age: newAge, decay: newDecay, time: timeLabel };
      }));
    }, 1000);
    
    return () => {
      unsubscribe();
      clearInterval(decayInterval);
    };
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-foreground">Memory Timeline</h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              Visualize memory decay over time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
            <span className="text-xs font-mono text-primary">Live Updates</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-primary/10"></div>

            {/* Timeline items */}
            <div className="space-y-6">
              {timelineData.map((item, index) => (
                <div key={item.id} className="relative pl-16 group">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-6 w-5 h-5 rounded-full border-2 transition-all duration-1000",
                      item.decay < 30
                        ? "bg-primary border-primary animate-pulse-glow"
                        : item.decay < 70
                        ? "bg-primary/60 border-primary/60"
                        : "bg-primary/20 border-primary/20"
                    )}
                  ></div>

                  {/* Content */}
                  <div
                    className={cn(
                      "glass-panel rounded-lg p-4 transition-all duration-1000 group-hover:border-primary/30",
                      item.decay < 30
                        ? "opacity-100 animate-slide-in-up"
                        : item.decay < 70
                        ? "opacity-70"
                        : "opacity-40"
                    )}
                    style={index === 0 ? {} : { animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p
                        className={cn(
                          "font-mono text-sm",
                          item.decay < 30
                            ? "text-foreground"
                            : item.decay < 70
                            ? "text-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.content}
                      </p>
                      <span className="font-mono text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {item.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-1000",
                            item.decay < 30
                              ? "bg-primary neon-glow"
                              : item.decay < 70
                              ? "bg-primary/60"
                              : "bg-primary/20"
                          )}
                          style={{ width: `${100 - item.decay}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {100 - item.decay}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-secondary/30 border border-border/50">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">Memory Decay:</span> Older memories gradually fade,
              representing natural information decay. Strength indicator shows memory retention
              percentage.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Timeline;
