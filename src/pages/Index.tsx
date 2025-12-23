import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { GiftFinderForm } from "@/components/GiftFinderForm";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Snowflake } from "@/components/ui/Snowflake";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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

      // Add previous recommendations context to avoid duplicates
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
        setAllRecommendations(prev => [...prev, recommendationsOutput.value]);
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

  // Generate snowflakes
  const snowflakes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: (["sm", "md", "lg"] as const)[Math.floor(Math.random() * 3)],
    left: `${Math.random() * 100}%`,
  }));

  const hasRecommendations = allRecommendations.length > 0;

  return (
    <div className={cn(
      "bg-background relative overflow-hidden flex flex-col",
      hasRecommendations ? "h-screen" : "min-h-screen"
    )}>
      {/* Snowflakes Background */}
      <div className="fixed inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <Snowflake
            key={flake.id}
            delay={flake.delay}
            size={flake.size}
            left={flake.left}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 w-full px-4 transition-all duration-500 flex flex-col",
        hasRecommendations 
          ? "flex-1 py-6 min-h-0" 
          : "py-12 md:py-20 container max-w-2xl mx-auto"
      )}>
        {/* Header */}
        {hasRecommendations ? (
          <header className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <img 
              src={santaFace} 
              alt="Santa Claus" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
              Secret Santa <span className="text-gradient-festive">Gift Finder</span>
            </h1>
          </header>
        ) : (
          <header className="text-center mb-12 animate-fade-in">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative animate-float">
                <img 
                  src={santaFace} 
                  alt="Santa Claus" 
                  className="w-24 h-24 object-contain"
                />
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-accent animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Secret Santa
              <span className="block text-gradient-festive">Gift Finder</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Tell us a bit about who you're shopping for, and we'll help you find a gift they'll absolutely love ✨
            </p>
          </header>
        )}

        {/* Main Card */}
        <main 
          className={cn(
            "bg-card rounded-2xl border border-border",
            "shadow-soft backdrop-blur-sm",
            "animate-scale-in",
            hasRecommendations 
              ? "flex-1 min-h-0 flex flex-col overflow-hidden p-4 md:p-6" 
              : "p-6 md:p-8"
          )}
          style={{ animationDelay: "0.2s" }}
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

        {/* Footer - hide when showing results */}
        {!hasRecommendations && (
          <footer className="text-center mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p>Powered by Vellum AI Workflows</p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;
