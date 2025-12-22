import { Gift, PartyPopper, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecommendationsDisplayProps {
  recommendations: string;
  onReset: () => void;
}

export const RecommendationsDisplay = ({ recommendations, onReset }: RecommendationsDisplayProps) => {
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
