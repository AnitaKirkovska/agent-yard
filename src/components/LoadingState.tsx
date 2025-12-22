import { Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoadingState = () => {
  const messages = [
    "Checking the nice list...",
    "Consulting the elves...",
    "Wrapping up ideas...",
    "Finding the perfect match...",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
      {/* Animated gift box */}
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl bg-gradient-festive shadow-festive flex items-center justify-center animate-float">
          <Gift className="w-12 h-12 text-primary-foreground" />
        </div>
        
        {/* Sparkles around the gift */}
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
        <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute top-1/2 -right-4 w-4 h-4 text-accent animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-display font-semibold text-foreground">
          Magic in Progress
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="animate-pulse">{messages[Math.floor(Date.now() / 2000) % messages.length]}</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full bg-primary",
              "animate-pulse"
            )}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};
