import { useState, useCallback, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Gift, RefreshCw, RotateCcw, Loader2, Gamepad2, ArrowLeft, ExternalLink, Lightbulb } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  // Close game when results load
  useEffect(() => {
    if (!isLoading && allRecommendations.length > 0 && showGame) {
      setShowGame(false);
    }
  }, [isLoading, allRecommendations.length, showGame]);

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
    <>
      <Helmet>
        <title>Secret Santa Gift Finder | AI-Powered Gift Ideas</title>
        <meta name="description" content="Find the perfect Secret Santa gift with AI. Describe your friend's personality and get personalized gift recommendations instantly." />
        <meta property="og:title" content="Secret Santa Gift Finder | AI-Powered Gift Ideas" />
        <meta property="og:description" content="Find the perfect Secret Santa gift with AI. Describe your friend's personality and get personalized gift recommendations instantly." />
        <meta property="og:image" content="https://agentyard.co/images/og-secret-santa.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Secret Santa Gift Finder | AI-Powered Gift Ideas" />
        <meta name="twitter:description" content="Find the perfect Secret Santa gift with AI. Describe your friend's personality and get personalized gift recommendations instantly." />
        <meta name="twitter:image" content="https://agentyard.co/images/og-secret-santa.png" />
      </Helmet>
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

      {/* Top bar - fixed at top */}
      <div className="relative z-10 px-4 pt-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all apps
        </Link>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-medium transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                What I Learned
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-display flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  What I Learned Building This
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 text-sm text-muted-foreground leading-relaxed mt-4">
                <section>
                  <h3 className="font-semibold text-foreground mb-1">Map nodes were essential</h3>
                  <p>Map nodes were needed so that we can concurrently search for products, which resulted in -40s latency cut.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Deduplication is required</h3>
                  <p>Searching from multiple angles often returns the same products, so duplicates need to be removed before ranking.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Diversity needs to be forced</h3>
                  <p>Without explicit rules, the AI reuses similar keywords and categories, which makes results feel repetitive.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Constraints improve gift quality</h3>
                  <p>Adding clear avoid rules filters out bad gifts and makes recommendations feel more thoughtful.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">The best filter is simple</h3>
                  <p>Would they buy this themselves? If yes, it's probably not a good gift.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Speed vs quality tradeoff</h3>
                  <p>Fewer results per search and less scraping make the workflow much faster.</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Links are tricky</h3>
                  <p>Google Shopping often gives redirect URLs, so clean retailer links require extra steps.</p>
                </section>

                <section className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <h3 className="font-semibold text-foreground mb-1">💡 Big takeaway</h3>
                  <p className="text-foreground">Good recommendations come from workflow design, clear rules, and taste—not just better models.</p>
                </section>
              </div>
            </DialogContent>
          </Dialog>
          <a 
            href="https://app.vellum.ai/public/workflow-deployments/98d37ca2-5771-4fe7-bd26-01d5f95bea32?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Fork this Agent
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "relative z-10 w-full px-4 transition-all duration-500 flex flex-col flex-1 min-h-0",
        hasRecommendations 
          ? "py-4" 
          : "py-4 md:py-8 container max-w-xl mx-auto justify-center"
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
            <div className="flex flex-col items-center">
              <LoadingState description={lastInputs?.friendDescription} />
              <button
                onClick={() => setShowGame(true)}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors animate-fade-in"
                style={{ animationDelay: "1s" }}
              >
                <Gamepad2 className="w-4 h-4" />
                Play a game while you wait!
              </button>
            </div>
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
      <footer className="relative z-10 text-center py-4 text-sm text-muted-foreground/60 animate-fade-in shrink-0" style={{ animationDelay: "0.3s" }}>
        <p>Built with love using <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Lovable</a> and <a href="https://vellum.ai?utm_medium=tool&utm_content=anita&utm_source=tool&utm_campaign=secret_santa" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Vellum</a></p>
      </footer>

      {/* Mini-game modal */}
      {showGame && <CatchPresentsGame onClose={() => setShowGame(false)} />}
    </div>
    </>
  );
};

export default Index;