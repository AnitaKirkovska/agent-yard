import { useState, useCallback } from "react";
import { Gift, Sparkles } from "lucide-react";
import { GiftFinderForm } from "@/components/GiftFinderForm";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Snowflake } from "@/components/ui/Snowflake";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const { toast } = useToast();

  const executeWorkflow = useCallback(async (inputs: { friendDescription: string; budget: string }) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
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
            inputs: [
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
            ],
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

  const handleReset = () => {
    setRecommendations(null);
    setError(null);
  };

  // Generate snowflakes
  const snowflakes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 10,
    size: (["sm", "md", "lg"] as const)[Math.floor(Math.random() * 3)],
    left: `${Math.random() * 100}%`,
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
      <div className="relative z-10 container max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-festive shadow-festive flex items-center justify-center animate-float">
                <Gift className="w-10 h-10 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
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

        {/* Main Card */}
        <main 
          className={cn(
            "bg-card rounded-2xl border border-border p-6 md:p-8",
            "shadow-soft backdrop-blur-sm",
            "animate-scale-in"
          )}
          style={{ animationDelay: "0.2s" }}
        >
          {isLoading ? (
            <LoadingState />
          ) : recommendations ? (
            <RecommendationsDisplay 
              recommendations={recommendations} 
              onReset={handleReset} 
            />
          ) : error ? (
            <ErrorDisplay error={error} onRetry={handleReset} />
          ) : (
            <GiftFinderForm onSubmit={executeWorkflow} isLoading={isLoading} />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p>Powered by Vellum AI Workflows</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
