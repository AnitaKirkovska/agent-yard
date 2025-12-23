import { useState, useCallback, useMemo } from "react";
import { Gift, RefreshCw, RotateCcw, Loader2, Gamepad2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CatchPresentsGame } from "@/components/CatchPresentsGame";
import { GiftFinderForm } from "@/components/GiftFinderForm";
import { LoadingState } from "@/components/LoadingState";
import { RecommendationsDisplay } from "@/components/RecommendationsDisplay";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { triggerCelebration, triggerSubtleSparkle } from "@/lib/confetti";
import { Button } from "@/components/ui/button";
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
  const [showGame, setShowGame] = useState(false);
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

  // Generate snowflakes for loading state
  const snowflakes = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      left: Math.random() * 100,
      size: 12 + Math.random() * 12,
      duration: 8 + Math.random() * 6,
    })), 
  []);

  return (
    <div className="theme-christmas bg-background relative overflow-hidden flex flex-col h-screen">
      {/* Snowflakes - only show during loading */}
      {isLoading && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute text-primary/20 animate-snowfall"
              style={{
                left: `${flake.left}%`,
                top: '-20px',
                animationDelay: `${flake.delay}s`,
                animationDuration: `${flake.duration}s`,
                fontSize: `${flake.size}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

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
        "relative z-10 w-full px-4 transition-all duration-500 flex flex-col flex-1 min-h-0",
        hasRecommendations 
          ? "py-6" 
          : "py-8 md:py-12 container max-w-xl mx-auto justify-center"
      )}>
        {/* Header */}
        {hasRecommendations ? (
          <header className="flex items-center justify-between gap-3 mb-4 animate-fade-in shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-subtle">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Secret Santa <span className="text-gradient">Gift Finder</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleFindMore} 
                disabled={isLoadingMore}
                size="sm"
                className={cn(
                  "h-9 px-4 text-sm font-medium rounded-xl",
                  "bg-gradient-primary hover:opacity-90 hover:shadow-glow transition-all duration-300"
                )}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Find More Ideas
                  </>
                )}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline"
                size="sm"
                disabled={isLoadingMore}
                className="h-9 px-4 text-sm font-medium rounded-xl border-border/60 hover:bg-muted/50 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </header>
        ) : (
          <header className="text-center mb-6 animate-fade-in shrink-0">
            {/* Back link */}
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all apps
            </Link>

            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src={santaFace} 
                alt="Santa Claus" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain animate-float-gentle"
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 tracking-tight">
              Secret Santa
              <span className="block text-gradient mt-1">Gift Finder</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
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
              : isLoading 
                ? "p-6 md:p-8 glass"
                : "p-6 md:p-8 glass"
          )}
          style={{ animationDelay: "0.15s" }}
        >
          {isLoading ? (
            <LoadingState description={lastInputs?.friendDescription} />
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
      </div>

      {/* Footer - Always visible */}
      <footer className="relative z-10 text-center py-4 text-sm text-muted-foreground/60 animate-fade-in shrink-0 flex items-center justify-center gap-4" style={{ animationDelay: "0.3s" }}>
        <p>Powered by <a href="https://vellum.ai?utm_medium=tool&utm_content=anita&utm_source=tool&utm_campaign=secret_santa" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Vellum AI Workflows</a></p>
        <button
          onClick={() => setShowGame(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          Play Game
        </button>
      </footer>

      {/* Mini-game modal */}
      {showGame && <CatchPresentsGame onClose={() => setShowGame(false)} />}
    </div>
  );
};

export default Index;