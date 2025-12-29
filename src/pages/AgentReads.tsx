import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { BookOpen, Send, Loader2, RotateCcw, ExternalLink } from "lucide-react";
import { ToolHeader } from "@/components/ToolHeader";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import vellumLogo from "@/assets/vellum-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookRecommendation {
  title: string;
  author: string;
  description: string;
  why_perfect: string;
  cover_url?: string;
  amazon_link?: string;
}

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

const parseBookRecommendations = (value: string): BookRecommendation[] => {
  try {
    // Try to parse as JSON array directly
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // If it's an object with a books array
    if (parsed.books && Array.isArray(parsed.books)) {
      return parsed.books;
    }
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      return parsed.recommendations;
    }
    return [];
  } catch {
    // Try to extract JSON from the string
    const jsonMatch = value.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
};

const AgentReads = () => {
  const [lifeSituation, setLifeSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const executeWorkflow = useCallback(async () => {
    if (!lifeSituation.trim()) {
      toast({
        title: "Please share your situation",
        description: "Tell us about your goals or life situation to get book recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations([]);

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
            workflowDeploymentName: "life-context-book-recommender",
            releaseTag: "LATEST",
            inputs: [
              {
                type: "STRING",
                name: "life_situation",
                value: lifeSituation,
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

      // Find the recommendations output
      const recommendationsOutput = result.data.outputs?.find(
        (output) => output.name === "recommendations" || output.name === "books"
      );

      if (recommendationsOutput?.value) {
        const books = parseBookRecommendations(recommendationsOutput.value);
        if (books.length > 0) {
          setRecommendations(books);
        } else {
          throw new Error("Could not parse book recommendations");
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
    }
  }, [lifeSituation, toast]);

  const handleReset = () => {
    setLifeSituation("");
    setRecommendations([]);
    setError(null);
  };

  const hasRecommendations = recommendations.length > 0;

  // Floating book decorations
  const floatingBooks = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      left: Math.random() * 100,
      size: 16 + Math.random() * 12,
      duration: 12 + Math.random() * 8,
      emoji: ["📚", "📖", "📕", "📗", "📘", "📙"][Math.floor(Math.random() * 6)],
    })), 
  []);

  return (
    <>
      <Helmet>
        <title>Agent Reads | AI Book Recommendations Based on Your Life</title>
        <meta name="description" content="Get personalized book recommendations based on your goals and life situation. Our AI librarian finds the perfect reads for where you are in life." />
        <meta property="og:title" content="Agent Reads | AI Book Recommendations" />
        <meta property="og:description" content="Get personalized book recommendations based on your goals and life situation." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-amber-950/20 via-background to-background relative overflow-hidden">
        {/* Floating book decorations during loading */}
        {isLoading && (
          <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
            {floatingBooks.map((book) => (
              <div
                key={book.id}
                className="absolute animate-float-up opacity-30"
                style={{
                  left: `${book.left}%`,
                  bottom: '-40px',
                  animationDelay: `${book.delay}s`,
                  animationDuration: `${book.duration}s`,
                  fontSize: `${book.size}px`,
                }}
              >
                {book.emoji}
              </div>
            ))}
          </div>
        )}

        {/* Rustic ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-900/10 blur-3xl animate-orb-float"
            style={{ animationDelay: "0s" }}
          />
          <div 
            className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-orange-900/10 blur-3xl animate-orb-float"
            style={{ animationDelay: "-5s" }}
          />
          <div 
            className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-yellow-900/10 blur-3xl animate-orb-float"
            style={{ animationDelay: "-10s" }}
          />
        </div>

        {/* Header */}
        <ToolHeader
          workflowName="life-context-book-recommender"
        />

        {/* Main Content */}
        <div className={cn(
          "relative z-10 w-full px-4 transition-all duration-500",
          hasRecommendations 
            ? "py-4" 
            : "py-8 md:py-16 container max-w-xl mx-auto"
        )}>
          {/* Page Header */}
          {!hasRecommendations && (
            <header className="text-center mb-8 animate-fade-in">
              {/* Partner Logos */}
              <TooltipProvider>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-muted-foreground/70 text-sm font-medium">Built with</span>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer border border-amber-200/50 dark:border-amber-800/50">
                        <BookOpen className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p className="font-medium">The Librarian's Wisdom</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://vellum.ai?utm_medium=tool&utm_content=anita&utm_source=tool&utm_campaign=agent_reads" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                      >
                        <img src={vellumLogo} alt="Vellum" className="w-8 h-8 object-contain" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p className="font-medium">vellum.ai</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://lovable.dev" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <img src={lovableLogo} alt="Lovable" className="w-full h-full object-cover" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p className="font-medium">lovable.dev</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 tracking-tight">
                Agent <span className="text-amber-600 dark:text-amber-400">Reads</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto font-serif italic">
                "Tell me where you are in life, and I shall guide you to the books that will light your path."
              </p>
            </header>
          )}

          {/* Results Header */}
          {hasRecommendations && (
            <header className="flex items-center justify-between gap-3 mb-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-800/50">
                  <BookOpen className="w-6 h-6 text-amber-700 dark:text-amber-400" />
                </div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Your <span className="text-amber-600 dark:text-amber-400">Reading List</span>
                </h1>
              </div>
              <Button 
                onClick={handleReset} 
                variant="outline"
                size="sm"
                className="h-9 px-4 text-sm font-medium rounded-xl border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </header>
          )}

          {/* Main Form */}
          {!hasRecommendations && !isLoading && (
            <main 
              className="rounded-3xl border border-amber-200/40 dark:border-amber-800/40 bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-lg animate-scale-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-foreground mb-2 block">
                    What's going on in your life?
                  </span>
                  <Textarea
                    value={lifeSituation}
                    onChange={(e) => setLifeSituation(e.target.value)}
                    placeholder="I'm starting a new business and feeling overwhelmed... / Going through a career change at 40... / Want to understand investing better... / Looking for inspiration after a difficult year..."
                    className="min-h-[140px] resize-none rounded-xl border-amber-200/60 dark:border-amber-800/60 bg-background/50 focus:border-amber-500 focus:ring-amber-500/20 font-serif"
                  />
                </label>

                <Button
                  onClick={executeWorkflow}
                  disabled={isLoading || !lifeSituation.trim()}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium shadow-lg shadow-amber-900/20 transition-all duration-300"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Find My Next Read
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}
            </main>
          )}

          {/* Loading State */}
          {isLoading && (
            <main className="rounded-3xl border border-amber-200/40 dark:border-amber-800/40 bg-card/80 backdrop-blur-xl p-8 md:p-12 shadow-lg animate-scale-in text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-6">
                <Loader2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                Consulting the shelves...
              </h3>
              <p className="text-muted-foreground font-serif italic">
                Our librarian is searching through countless volumes to find the perfect reads for you.
              </p>
            </main>
          )}

          {/* Recommendations Grid */}
          {hasRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in container max-w-6xl mx-auto">
              {recommendations.map((book, index) => (
                <article 
                  key={index}
                  className="group rounded-2xl border border-amber-200/40 dark:border-amber-800/40 bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl hover:border-amber-300/60 dark:hover:border-amber-700/60 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Book Cover */}
                  {book.cover_url && (
                    <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 overflow-hidden">
                      <img 
                        src={book.cover_url} 
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Book Info */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-foreground mb-1 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 font-serif italic">
                      by {book.author}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {book.description}
                    </p>

                    {book.why_perfect && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 mb-4">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Why this book?</p>
                        <p className="text-sm text-foreground/80 line-clamp-3">{book.why_perfect}</p>
                      </div>
                    )}

                    {book.amazon_link && (
                      <a
                        href={book.amazon_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        View on Amazon
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentReads;
