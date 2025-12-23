import { Gift, PartyPopper, RefreshCw, ExternalLink, Sparkles } from "lucide-react";
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
  onReset: () => void;
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

export const RecommendationsDisplay = ({ recommendations, onReset }: RecommendationsDisplayProps) => {
  const parsedRecommendations = useMemo(() => parseRecommendations(recommendations), [recommendations]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground mb-4">
          <PartyPopper className="w-4 h-4" />
          <span className="text-sm font-medium">Perfect matches found</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          Gift Recommendations
        </h3>
        <p className="text-muted-foreground">Curated picks based on your description</p>
      </div>

      {/* Recommendations Grid */}
      {parsedRecommendations ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {parsedRecommendations.map((rec, index) => {
            const link = cleanUrl(rec.link);
            const imageUrl = cleanUrl(rec.image_url);

            return (
              <article
                key={index}
                className={cn(
                  "group relative flex flex-col rounded-2xl bg-card border border-border/50 overflow-hidden",
                  "hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                )}
              >
                {/* Product Image */}
                {imageUrl ? (
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={rec.product_name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center">
                    <Gift className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}

                {/* Product Details */}
                <div className="flex-1 flex flex-col p-5 gap-4">
                  {/* Title & Price */}
                  <div>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-2"
                      >
                        <h4 className="font-display font-semibold text-foreground text-lg leading-tight hover:text-primary transition-colors">
                          {rec.product_name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                      </a>
                    ) : (
                      <h4 className="font-display font-semibold text-foreground text-lg leading-tight">
                        {rec.product_name}
                      </h4>
                    )}

                    <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {rec.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {rec.description}
                  </p>

                  {/* Why it's perfect - hover on stars */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="inline-flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                          <Sparkles className="w-5 h-5 text-accent" />
                          <span className="text-sm text-muted-foreground">Why it's perfect</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs p-3">
                        <p className="text-sm">{rec.why_its_perfect}</p>
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
                        "inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl mt-auto",
                        "bg-primary text-primary-foreground font-medium",
                        "hover:bg-primary/90 transition-all duration-200",
                        "group-hover:shadow-md"
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
        <div className="p-6 rounded-2xl border border-border bg-card">
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap leading-relaxed">{recommendations}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <div className="flex items-center gap-2 text-accent">
          <Gift className="w-5 h-5" />
          <span className="text-sm font-medium">Happy gifting!</span>
          <Gift className="w-5 h-5" />
        </div>

        <Button onClick={onReset} variant="outline" size="lg" className="px-8">
          <RefreshCw className="w-4 h-4 mr-2" />
          Find More Gift Ideas
        </Button>
      </div>
    </div>
  );
};
