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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Subtle Snowflakes Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
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
      <div className="relative z-10 container max-w-xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-14 animate-fade-in">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center animate-float">
                <Gift className="w-8 h-8 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse-subtle" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-5 leading-tight">
            Secret Santa
            <span className="block text-gradient mt-1">Gift Finder</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Describe your recipient and we'll find the perfect gift they'll love
          </p>
        </header>

        {/* Main Card */}
        <main 
          className={cn(
            "bg-card rounded-3xl border border-border p-8 md:p-10",
            "shadow-medium",
            "animate-scale-in"
          )}
          style={{ animationDelay: "0.15s" }}
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
        <footer className="text-center mt-10 text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p>Powered by Vellum AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
