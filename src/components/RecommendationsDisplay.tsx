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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
          <PartyPopper className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
          Perfect Matches Found
        </h3>
        <p className="text-sm text-muted-foreground">
          Curated gift ideas based on your description
        </p>
      </div>

      {/* Recommendations Content */}
      {parsedRecommendations ? (
        <div className="space-y-4">
          {parsedRecommendations.map((rec, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-2xl border border-border bg-muted/20",
                "hover:border-primary/20 hover:bg-muted/30",
                "transition-all duration-200"
              )}
            >
              <div className="flex gap-5">
                {/* Product Image */}
                {rec.image_url && (
                  <div className="shrink-0">
                    <img
                      src={rec.image_url}
                      alt={rec.product_name}
                      className="w-20 h-20 object-cover rounded-xl border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-4">
                  {/* Product header */}
                  <div>
                    {rec.link ? (
                      <a
                        href={rec.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display font-semibold text-foreground text-xl hover:text-primary transition-colors inline-flex items-center gap-2"
                      >
                        {rec.product_name}
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    ) : (
                      <h4 className="font-display font-semibold text-foreground text-xl">
                        {rec.product_name}
                      </h4>
                    )}
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-accent/15 text-accent font-medium text-sm">
                      {rec.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Why it's perfect */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/80 italic leading-relaxed">
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
                        "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl",
                        "bg-primary text-primary-foreground font-medium text-sm",
                        "hover:opacity-90 transition-opacity w-fit"
                      )}
                    >
                      View Product <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-border bg-muted/20">
          <div className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap leading-relaxed">
              {recommendations}
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        className={cn(
          "w-full h-12 transition-all duration-200 rounded-xl",
          "border-border hover:border-primary/30 hover:bg-primary/5"
        )}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Find More Gifts
      </Button>
    </div>
  );
};
