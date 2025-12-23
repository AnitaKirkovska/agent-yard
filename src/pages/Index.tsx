import { useState, useCallback, useEffect, useRef } from "react";
import { Gift, Sparkles } from "lucide-react";
import { GiftFinderForm } from "@/components/GiftFinderForm";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { triggerCelebration, triggerSubtleSparkle } from "@/lib/confetti";
import santaFace from "@/assets/santa-face.png";

interface WorkflowOutput {
  name: string;
  type: string;
  value: string;
}

interface WorkflowResponse {
  data: {
    state: "FULFILLED" | "REJECTED";
    outputs?: WorkflowOutput[];
    error?: { message: string };
  };
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<{ friendDescription: string; budget: string } | null>(null);
  const { toast } = useToast();

  const executeWorkflow = useCallback(async (
    inputs: { friendDescription: string; budget: string },
    isLoadMore: boolean = false
  ) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setAllRecommendations([]);
    }
    setError(null);
    setLastInputs(inputs);

    try {
      const workflowInputs = [
        {
          type: "STRING",
          name: "friend_description",
          value: inputs.friendDescription,
        },
        {
          type: "STRING",
          name: "budget",
          value: inputs.budget,
        },
      ];

      if (isLoadMore && allRecommendations.length > 0) {
        workflowInputs.push({
          type: "STRING",
          name: "exclude_previous",
          value: allRecommendations.join("\n---\n"),
        });
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-workflow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            workflowDeploymentName: "secret-santa-gift-finder",
            releaseTag: "LATEST",
            inputs: workflowInputs,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const result: WorkflowResponse = await response.json();

      if (result.data.state === "REJECTED") {
        throw new Error(result.data.error?.message || "Workflow execution failed");
      }

      const recommendationsOutput = result.data.outputs?.find(
        (output) => output.name === "recommendations" && output.type === "STRING"
      );

      if (recommendationsOutput?.value) {
        const isFirstBatch = allRecommendations.length === 0;
        setAllRecommendations(prev => [...prev, recommendationsOutput.value]);
        
        // Trigger celebration animation
        if (isFirstBatch) {
          setTimeout(() => triggerCelebration(), 300);
        } else {
          setTimeout(() => triggerSubtleSparkle(), 200);
        }
        
        toast({
          title: isLoadMore ? "More gift ideas found! 🎁" : "Gift ideas found! 🎁",
          description: isLoadMore ? "New recommendations added below." : "Check out the personalized recommendations below.",
        });
      } else {
        throw new Error("No recommendations received from the workflow");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [toast, allRecommendations]);

  const handleFindMore = useCallback(() => {
    if (lastInputs) {
      executeWorkflow(lastInputs, true);
    }
  }, [lastInputs, executeWorkflow]);

  const handleReset = () => {
    setAllRecommendations([]);
    setError(null);
    setLastInputs(null);
  };

  const hasRecommendations = allRecommendations.length > 0;

  return (
    <div className={cn(
      "bg-background relative overflow-hidden flex flex-col",
      hasRecommendations ? "h-screen" : "min-h-screen"
    )}>
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "0s" }}
        />
        <div 
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "-5s" }}
        />
        <div 
          className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 w-full px-4 transition-all duration-500 flex flex-col",
        hasRecommendations 
          ? "flex-1 py-6 min-h-0" 
          : "py-16 md:py-24 container max-w-xl mx-auto"
      )}>
        {/* Header */}
        {hasRecommendations ? (
          <header className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <div className="p-2 rounded-xl bg-gradient-subtle">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
              Secret Santa <span className="text-gradient">Gift Finder</span>
            </h1>
          </header>
        ) : (
          <header className="text-center mb-12 animate-fade-in">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-20 blur-2xl scale-150" />
                <div className="relative p-6 rounded-3xl bg-gradient-subtle border border-border/50 animate-float-gentle">
                  <img 
                    src={santaFace} 
                    alt="Santa Claus" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div className="absolute -top-2 -right-2 p-2 rounded-full bg-card border border-border shadow-md-custom">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-5 tracking-tight">
              Secret Santa
              <span className="block text-gradient mt-1">Gift Finder</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Describe your friend and we'll find the perfect gift they'll love
            </p>
          </header>
        )}

        {/* Main Card */}
        <main 
          className={cn(
            "rounded-3xl border border-border/60",
            "shadow-lg-custom",
            "animate-scale-in",
            hasRecommendations 
              ? "flex-1 min-h-0 flex flex-col overflow-hidden p-4 md:p-6 bg-card/90 backdrop-blur-xl" 
              : "p-8 md:p-10 glass"
          )}
          style={{ animationDelay: "0.15s" }}
        >
          {isLoading ? (
            <LoadingState />
          ) : hasRecommendations ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <RecommendationsDisplay 
                recommendations={allRecommendations} 
                onFindMore={handleFindMore}
                onStartOver={handleReset}
                isLoadingMore={isLoadingMore}
              />
            </div>
          ) : error ? (
            <ErrorDisplay error={error} onRetry={handleReset} />
          ) : (
            <GiftFinderForm onSubmit={executeWorkflow} isLoading={isLoading} />
          )}
        </main>

        {/* Footer */}
        {!hasRecommendations && (
          <footer className="text-center mt-10 text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <p>Powered by Vellum AI Workflows</p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;