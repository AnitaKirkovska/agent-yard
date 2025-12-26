import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExecutionCounterProps {
  workflowName: string;
  className?: string;
}

const CACHE_KEY_PREFIX = "workflow_stats_";

export const ExecutionCounter = ({ workflowName, className = "" }: ExecutionCounterProps) => {
  const [count, setCount] = useState<number | null>(() => {
    // Initialize from localStorage immediately (synchronous, instant)
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${workflowName}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.count ?? null;
      }
    } catch {}
    return null;
  });
  const [isLoading, setIsLoading] = useState(count === null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Try to get from database cache
        const { data: cached, error: cacheError } = await supabase
          .from("workflow_stats_cache")
          .select("execution_count, cached_at")
          .eq("workflow_name", workflowName)
          .maybeSingle();

        if (!cacheError && cached) {
          setCount(cached.execution_count);
          setIsLoading(false);
          
          // Update localStorage
          localStorage.setItem(`${CACHE_KEY_PREFIX}${workflowName}`, JSON.stringify({
            count: cached.execution_count,
            cachedAt: cached.cached_at
          }));

          // Check if needs refresh (older than 24 hours)
          const cachedAt = new Date(cached.cached_at);
          const hoursSinceCached = (Date.now() - cachedAt.getTime()) / (1000 * 60 * 60);

          if (hoursSinceCached >= 24) {
            // Background refresh
            supabase.functions.invoke('get-workflow-stats', {
              body: { workflowDeploymentName: workflowName }
            }).then(({ data }) => {
              if (data?.count !== undefined) {
                setCount(data.count);
                localStorage.setItem(`${CACHE_KEY_PREFIX}${workflowName}`, JSON.stringify({
                  count: data.count,
                  cachedAt: new Date().toISOString()
                }));
              }
            }).catch(console.error);
          }
          return;
        }

        // No cache, call edge function
        const { data, error } = await supabase.functions.invoke('get-workflow-stats', {
          body: { workflowDeploymentName: workflowName }
        });

        if (!error && data?.count !== undefined) {
          setCount(data.count);
          localStorage.setItem(`${CACHE_KEY_PREFIX}${workflowName}`, JSON.stringify({
            count: data.count,
            cachedAt: new Date().toISOString()
          }));
        }
      } catch (err) {
        console.error("Failed to fetch execution count:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [workflowName]);

  // If we have a count from localStorage, show it immediately (no loading state)
  if (count !== null) {
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
  }

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

  return null;
};
