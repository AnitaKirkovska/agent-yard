import { Gift, RefreshCw, ExternalLink, Sparkles, RotateCcw } from "lucide-react";
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
  recommendations: string;
  onFindMore: () => void;
  onStartOver: () => void;
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

export const RecommendationsDisplay = ({ recommendations, onFindMore, onStartOver }: RecommendationsDisplayProps) => {
  const parsedRecommendations = useMemo(() => parseRecommendations(recommendations), [recommendations]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-green text-primary-foreground shadow-lg">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wide">Perfect matches found</span>
        </div>
        <h3 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">
          Gift Recommendations
        </h3>
        <p className="text-muted-foreground text-lg">Curated picks based on your description</p>
      </div>

      {/* Recommendations Grid */}
      {parsedRecommendations ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {parsedRecommendations.map((rec, index) => {
            const link = cleanUrl(rec.link);
            const imageUrl = cleanUrl(rec.image_url);

            return (
              <article
                key={index}
                className={cn(
                  "group relative flex flex-col rounded-3xl bg-card overflow-hidden",
                  "border-2 border-transparent",
                  "shadow-soft hover:shadow-festive transition-all duration-500",
                  "hover:-translate-y-2 hover:border-primary/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Product Image */}
                {imageUrl ? (
                  <div className="relative aspect-square bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.1),transparent_70%)]" />
                    <img
                      src={imageUrl}
                      alt={rec.product_name}
                      loading="lazy"
                      className="relative w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
                    <div className="p-6 rounded-full bg-muted/50">
                      <Gift className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="relative flex-1 flex flex-col p-6 gap-4 bg-card">
                  {/* Title & Price Row */}
                  <div className="space-y-3">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-start gap-2"
                      >
                        <h4 className="font-display font-bold text-foreground text-xl leading-tight group-hover/link:text-primary transition-colors duration-200">
                          {rec.product_name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/60 mt-1.5 shrink-0 group-hover/link:text-primary transition-colors" />
                      </a>
                    ) : (
                      <h4 className="font-display font-bold text-foreground text-xl leading-tight">
                        {rec.product_name}
                      </h4>
                    )}

                    <span className="inline-flex px-4 py-1.5 rounded-full bg-gradient-festive text-primary-foreground font-bold text-base shadow-sm">
                      {rec.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                    {rec.description}
                  </p>

                  {/* Why it's perfect */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center gap-2 py-2 px-3 -mx-3 rounded-xl hover:bg-accent/10 transition-all duration-200 cursor-pointer group/why">
                          <div className="p-1.5 rounded-lg bg-accent/20 group-hover/why:bg-accent/30 transition-colors">
                            <Sparkles className="w-4 h-4 text-accent" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground group-hover/why:text-foreground transition-colors">Why it's perfect</span>
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
                        "inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl mt-auto",
                        "bg-primary text-primary-foreground font-semibold text-base",
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
        <div className="p-8 rounded-3xl border-2 border-border/50 bg-card shadow-soft">
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap leading-relaxed">{recommendations}</div>
          </div>
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
            className="px-8 py-6 text-base font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Find More Gift Ideas
          </Button>
          
          <Button 
            onClick={onStartOver} 
            variant="outline"
            size="lg" 
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
