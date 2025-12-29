import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { BookOpen, Send, Loader2, RotateCcw, ExternalLink, Star, Calendar, Quote, Info, ChevronDown, ChevronUp } from "lucide-react";
import { ToolHeader } from "@/components/ToolHeader";
import { AgentReadsLearnings } from "@/components/AgentReadsLearnings";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import vellumLogo from "@/assets/vellum-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import serpApiLogo from "@/assets/serp-api-logo.png";
import googleBooksLogo from "@/assets/google-books-logo.png";
import libraryBackground from "@/assets/library-background.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookRecommendation {
  title: string;
  author: string;
  description?: string;
  why_perfect?: string;
  why_relevant?: string;
  cover_url?: string;
  amazon_link?: string;
  amazon_url?: string;
  publication_year?: number;
  rating?: number;
  review_quote?: string;
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

const parseBookRecommendations = (value: unknown): BookRecommendation[] => {
  // Handle array directly (new workflow output format)
  // Each item may be wrapped in {type: "JSON", value: {...}}
  if (Array.isArray(value)) {
    return value.map((item) => {
      // If item has a nested value property (Vellum ARRAY format)
      if (item && typeof item === 'object' && 'value' in item) {
        return item.value as BookRecommendation;
      }
      return item as BookRecommendation;
    });
  }
  
  // Handle string (old workflow output format)
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed.books && Array.isArray(parsed.books)) {
        return parsed.books;
      }
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed.recommendations;
      }
      return [];
    } catch {
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
  }
  
  return [];
};

// Collapsible "Why this book?" section
const WhyThisBookSection = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
      >
        <Info className="w-4 h-4" />
        <span>Why this book?</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200/50 animate-fade-in">
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      )}
    </div>
  );
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
      
      <div className="h-screen relative overflow-hidden">
        {/* Gradient background */}
        <div 
          className="fixed inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #1a1a2e 75%, #0d1b2a 100%)'
          }}
        />
        
        {/* Subtle overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        {/* Floating book decorations during loading */}
        {isLoading && (
          <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
            {floatingBooks.map((book) => (
              <div
                key={book.id}
                className="absolute animate-float-up opacity-50"
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

        {/* Header */}
        <ToolHeader
          workflowName="life-context-book-recommender"
          whatILearned={{
            title: "Building a Fast Book Recommender",
            content: <AgentReadsLearnings />
          }}
        />

        {/* Main Content */}
        <div className={cn(
          "relative z-10 w-full px-4 transition-all duration-500 min-h-screen flex flex-col",
          hasRecommendations 
            ? "justify-center py-16" 
            : "justify-center container max-w-xl mx-auto py-8 md:py-16"
        )}>
          {/* Page Header */}
          {!hasRecommendations && (
            <header className="text-center mb-8 animate-fade-in">
              {/* Partner Logos */}
              <TooltipProvider>
                <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                  <span className="text-white/70 text-sm font-medium">Built with</span>
                  
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

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://serpapi.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <img src={serpApiLogo} alt="SerpAPI" className="w-full h-full object-cover" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p className="font-medium">serpapi.com</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href="https://developers.google.com/books" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="h-12 px-3 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                      >
                        <img src={googleBooksLogo} alt="Google Books" className="h-6 object-contain" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card text-foreground border-border">
                      <p className="font-medium">Google Books API</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 tracking-tight drop-shadow-lg">
                Agent <span className="text-amber-400">Reads</span>
              </h1>

              <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto drop-shadow">
                Share your goals or current situation, and get personalized book recommendations
              </p>
            </header>
          )}

          {/* Results Header */}
          {hasRecommendations && (
            <header className="flex items-center justify-between gap-3 mb-6 animate-fade-in container max-w-6xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-900/70 border border-amber-600/50 backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg">
                  Your <span className="text-amber-400">Reading List</span>
                </h1>
              </div>
              <Button 
                onClick={handleReset} 
                size="sm"
                className="h-9 px-4 text-sm font-medium rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Search
              </Button>
            </header>
          )}

          {/* Main Form */}
          {!hasRecommendations && !isLoading && (
            <main 
              className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl animate-scale-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-white/90 mb-3 block">
                    What's going on in your life?
                  </span>
                  <Textarea
                    value={lifeSituation}
                    onChange={(e) => setLifeSituation(e.target.value)}
                    placeholder="I'm starting a new business and feeling overwhelmed... / Going through a career change at 40... / Want to understand investing better..."
                    className="min-h-[120px] resize-none rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-amber-400 focus:ring-amber-400/20"
                  />
                </label>

                <Button
                  onClick={executeWorkflow}
                  disabled={isLoading || !lifeSituation.trim()}
                  className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Find My Next Read
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                  {error}
                </div>
              )}
            </main>
          )}


          {isLoading && (
            <main className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 shadow-2xl animate-scale-in text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/20 mb-5">
                <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-1">
                Consulting the shelves...
              </h3>
              <p className="text-white/60 text-sm">
                Finding the perfect reads for you...
              </p>
            </main>
          )}

          {/* Recommendations Grid */}
          {hasRecommendations && (
            <div className="flex-1 flex items-center justify-center pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in max-w-6xl w-full">
              {recommendations.map((book, index) => (
                <article 
                  key={index}
                  className="group rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
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
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {book.title}
                      </h3>
                      {book.rating && (
                        <div className="flex items-center gap-1 shrink-0 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium text-amber-700">{book.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-sm text-gray-600 font-serif italic">
                        by {book.author}
                      </p>
                      {book.publication_year && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {book.publication_year}
                        </span>
                      )}
                    </div>
                    
                    {(book.why_perfect || book.why_relevant) && (
                      <WhyThisBookSection content={book.why_perfect || book.why_relevant || ""} />
                    )}

                    {book.review_quote && (
                      <div className="flex items-start gap-2 text-gray-500 mb-3">
                        <Quote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <p className="text-xs italic line-clamp-2">{book.review_quote}</p>
                      </div>
                    )}

                    {(book.amazon_url || book.amazon_link) && (
                      <a
                        href={book.amazon_url || book.amazon_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-sm font-medium text-amber-700 hover:bg-amber-200 transition-colors"
                      >
                        View on Amazon
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentReads;
