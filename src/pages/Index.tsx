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
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInputs, setLastInputs] = useState<{ friendDescription: string; budget: string } | null>(null);
  const [previousRecommendations, setPreviousRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const executeWorkflow = useCallback(async (
    inputs: { friendDescription: string; budget: string },
    excludeContext?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
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
      if (excludeContext) {
        workflowInputs.push({
          type: "STRING",
          name: "exclude_previous",
          value: excludeContext,
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
        setRecommendations(recommendationsOutput.value);
        // Store this recommendation to exclude in future requests
        setPreviousRecommendations(prev => [...prev, recommendationsOutput.value]);
        toast({
          title: "Gift ideas found! 🎁",
          description: "Check out the personalized recommendations below.",
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
    }
  }, [toast]);

  const handleFindMore = useCallback(() => {
    if (lastInputs) {
      // Create context from previous recommendations to exclude
      const excludeContext = previousRecommendations.join("\n---\n");
      executeWorkflow(lastInputs, excludeContext);
    }
  }, [lastInputs, previousRecommendations, executeWorkflow]);

  const handleReset = () => {
    setRecommendations(null);
    setError(null);
    setLastInputs(null);
    setPreviousRecommendations([]);
  };

  // Generate snowflakes
  const snowflakes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: (["sm", "md", "lg"] as const)[Math.floor(Math.random() * 3)],
    left: `${Math.random() * 100}%`,
  }));

  return (
    <div className={cn(
      "bg-background relative overflow-hidden flex flex-col",
      recommendations ? "h-screen" : "min-h-screen"
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
        recommendations 
          ? "flex-1 py-6 min-h-0" 
          : "py-12 md:py-20 container max-w-2xl mx-auto"
      )}>
        {/* Header - hide when showing results */}
        {!recommendations && (
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
            recommendations 
              ? "flex-1 min-h-0 flex flex-col overflow-hidden p-4 md:p-6" 
              : "p-6 md:p-8"
          )}
          style={{ animationDelay: "0.2s" }}
        >
          {isLoading ? (
            <LoadingState />
          ) : recommendations ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <RecommendationsDisplay 
                recommendations={recommendations} 
                onFindMore={handleFindMore}
                onStartOver={handleReset}
              />
            </div>
          ) : error ? (
            <ErrorDisplay error={error} onRetry={handleReset} />
          ) : (
            <GiftFinderForm onSubmit={executeWorkflow} isLoading={isLoading} />
          )}
        </main>

        {/* Footer - hide when showing results */}
        {!recommendations && (
          <footer className="text-center mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p>Powered by Vellum AI Workflows</p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default Index;
