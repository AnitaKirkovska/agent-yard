import { Gift, PartyPopper, RefreshCw, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    // Try to find JSON in the text (it might be wrapped in other content)
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

export const RecommendationsDisplay = ({ recommendations, onReset }: RecommendationsDisplayProps) => {
  const parsedRecommendations = useMemo(() => parseRecommendations(recommendations), [recommendations]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-green flex items-center justify-center shadow-soft">
          <PartyPopper className="w-6 h-6 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            Gift Recommendations
          </h3>
          <p className="text-sm text-muted-foreground">
            Here are some perfect gift ideas for your Secret Santa!
          </p>
        </div>
      </div>

      {/* Recommendations Content */}
      {parsedRecommendations ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {parsedRecommendations.map((rec, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden",
                "shadow-soft hover:shadow-md transition-all duration-300",
                "hover:border-primary/30"
              )}
            >
              {/* Product Image - Top Full Width */}
              {rec.image_url && (
                <div className="w-full aspect-square bg-white flex items-center justify-center p-4">
                  <img
                    src={rec.image_url}
                    alt={rec.product_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="flex-1 flex flex-col gap-3 p-4">
                {/* Product header */}
                <div>
                  {rec.link ? (
                    <a
                      href={rec.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display font-semibold text-foreground text-base hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      {rec.product_name}
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  ) : (
                    <h4 className="font-display font-semibold text-foreground text-base">
                      {rec.product_name}
                    </h4>
                  )}
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {rec.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {rec.description}
                </p>

                {/* Why it's perfect */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/30 border border-accent/20">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 italic line-clamp-3">
                    {rec.why_its_perfect}
                  </p>
                </div>

                {/* View Product Button */}
                {rec.link && (
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg mt-auto",
                      "bg-primary text-primary-foreground font-medium text-sm",
                      "hover:bg-primary/90 transition-colors"
                    )}
                  >
                    View Product <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className={cn(
            "p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm",
            "shadow-soft"
          )}
        >
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap leading-relaxed">
              {recommendations}
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-2 text-accent">
        <Gift className="w-5 h-5" />
        <span className="text-sm font-medium">Happy gifting!</span>
        <Gift className="w-5 h-5" />
      </div>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className={cn(
          "w-full h-12 transition-all duration-300",
          "border-primary/30 hover:border-primary hover:bg-primary/5"
        )}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Find More Gift Ideas
      </Button>
    </div>
  );
};
