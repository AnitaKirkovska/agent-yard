import { Gift, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const messages = [
    "Checking the nice list...",
    "Consulting the elves...",
    "Wrapping up ideas...",
    "Finding the perfect match...",
    "Sprinkling holiday magic...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15 + 5;
      });
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Animated gift box with orbiting elements */}
      <div className="relative w-32 h-32">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        
        {/* Main gift box */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-festive shadow-festive flex items-center justify-center animate-float">
          <Gift className="w-12 h-12 text-primary-foreground" />
        </div>
        
        {/* Orbiting sparkles */}
        <div className="absolute inset-0 animate-spin-slow">
          <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-5 h-5 text-accent" />
          <Star className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-4 h-4 text-accent fill-accent" />
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }}>
          <Sparkles className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-2 w-4 h-4 text-primary" />
          <Star className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-5 h-5 text-primary fill-primary" />
        </div>
      </div>

      {/* Loading text with smooth transition */}
      <div className="text-center space-y-3 min-h-[80px]">
        <h3 className="text-xl font-display font-semibold text-foreground">
          Magic in Progress
        </h3>
        <p 
          key={messageIndex}
          className="text-muted-foreground animate-fade-in"
        >
          {messages[messageIndex]}
        </p>
      </div>

      {/* Smooth progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 95)}%` }}
        />
      </div>

      {/* Floating particles */}
      <div className="flex gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i % 2 === 0 ? "bg-primary" : "bg-accent"
            )}
            style={{ 
              animation: `float 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
