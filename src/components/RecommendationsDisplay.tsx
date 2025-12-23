import { Gift, RefreshCw, ExternalLink, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface Recommendation {
  product_name: string;
  description: string;
  price: string;
  link: string;
  image_url?: string;
  why_its_perfect: string;
}

interface RecommendationsDisplayProps {
  recommendations: string[];
  onFindMore: () => void;
  onStartOver: () => void;
  isLoadingMore?: boolean;
}

const parseRecommendations = (text: string): Recommendation[] | null => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*"recommendations"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed.recommendations;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const cleanUrl = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const RecommendationsDisplay = ({ recommendations, onFindMore, onStartOver, isLoadingMore = false }: RecommendationsDisplayProps) => {
  // Parse all recommendation strings and flatten into a single array
  const allParsedRecommendations = useMemo(() => {
    const all: Recommendation[] = [];
    for (const rec of recommendations) {
      const parsed = parseRecommendations(rec);
      if (parsed) {
        all.push(...parsed);
      }
    }
    return all.length > 0 ? all : null;
  }, [recommendations]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-green text-primary-foreground text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          <span>Perfect matches found</span>
        </div>
        <h3 className="text-2xl font-display font-bold text-foreground">
          Gift Recommendations
        </h3>
      </div>

      {/* Recommendations Grid */}
      {allParsedRecommendations ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {allParsedRecommendations.map((rec, index) => {
            const link = cleanUrl(rec.link);
            const imageUrl = cleanUrl(rec.image_url);

            return (
              <article
                key={index}
                className={cn(
                  "group relative flex flex-col rounded-2xl bg-card overflow-hidden",
                  "border border-border/60",
                  "shadow-soft hover:shadow-festive transition-all duration-400",
                  "hover:-translate-y-1"
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Product Image */}
                {imageUrl ? (
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={rec.product_name}
                      loading="lazy"
                      className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-400 ease-out"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
                    <div className="p-5 rounded-full bg-muted/40">
                      <Gift className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="relative flex-1 flex flex-col p-5 gap-4">
                  {/* Title Row */}
                  <div className="flex items-start justify-between gap-3">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-start gap-1.5 flex-1 min-w-0"
                      >
                        <h4 className="font-display font-bold text-foreground text-lg leading-snug group-hover/link:text-primary transition-colors duration-200">
                          {rec.product_name}
                        </h4>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 mt-1 shrink-0 group-hover/link:text-primary transition-colors" />
                      </a>
                    ) : (
                      <h4 className="font-display font-bold text-foreground text-lg leading-snug">
                        {rec.product_name}
                      </h4>
                    )}
                  </div>

                  {/* Price Badge */}
                  <span className="inline-flex self-start px-3.5 py-1.5 rounded-lg bg-gradient-festive text-primary-foreground font-bold text-sm shadow-sm">
                    {rec.price}
                  </span>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {rec.description}
                  </p>

                  {/* Why it's perfect */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center gap-2 py-2 rounded-lg hover:bg-accent/10 transition-all duration-200 cursor-pointer group/why">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <span className="text-sm text-muted-foreground group-hover/why:text-foreground transition-colors">Why it's perfect</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs p-4 rounded-xl shadow-xl">
                        <p className="text-sm leading-relaxed">{rec.why_its_perfect}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* View Product Button */}
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl mt-auto",
                        "bg-primary text-primary-foreground font-semibold text-sm",
                        "hover:bg-primary/90 active:scale-[0.98] transition-all duration-200",
                        "shadow-md hover:shadow-lg"
                      )}
                    >
                      View Product <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-border/60 bg-card shadow-soft">
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap leading-relaxed">{recommendations.join('\n\n')}</div>
          </div>
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center gap-3 py-6">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-muted-foreground font-medium">Finding more gift ideas...</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center gap-6 pt-4">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
          <Gift className="w-5 h-5 text-accent" />
          <span className="text-base font-semibold text-accent">Happy gifting!</span>
          <Gift className="w-5 h-5 text-accent" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button 
            onClick={onFindMore} 
            size="lg" 
            disabled={isLoadingMore}
            className="px-8 py-6 text-base font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Find More Gift Ideas
              </>
            )}
          </Button>
          
          <Button 
            onClick={onStartOver} 
            variant="outline"
            size="lg" 
            disabled={isLoadingMore}
            className="px-8 py-6 text-base font-semibold rounded-2xl border-2 hover:bg-muted transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};