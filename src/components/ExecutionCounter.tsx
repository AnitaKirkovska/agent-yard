import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExecutionCounterProps {
  workflowName: string;
  className?: string;
}

export const ExecutionCounter = ({ workflowName, className = "" }: ExecutionCounterProps) => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-workflow-stats', {
          body: { workflowDeploymentName: workflowName }
        });

        if (error) {
          console.error("Error fetching workflow stats:", error);
          return;
        }

        setCount(data?.count ?? 0);
      } catch (err) {
        console.error("Failed to fetch execution count:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [workflowName]);

  if (isLoading) {
    return (
      <div
        className={
          `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm text-muted-foreground text-xs font-medium shadow-sm ${className}`
        }
        aria-label="Loading execution count"
      >
        <Activity className="w-3 h-3 animate-pulse" />
        <span className="animate-pulse">...</span>
      </div>
    );
  }

  if (count === null) return null;

  return (
    <div
      className={
        `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm text-foreground text-xs font-medium shadow-sm ${className}`
      }
      aria-label={`${count} workflow runs`}
    >
      <Activity className="w-3 h-3" />
      <span>{count.toLocaleString()} runs</span>
    </div>
  );
};
