import { Gift, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const messages = [
    "Analyzing preferences...",
    "Searching for perfect matches...",
    "Curating gift ideas...",
    "Almost there...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 12 + 4;
      });
    }, 350);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-fade-in">
      {/* Main loader */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse-soft" />
        
        {/* Icon container */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Gift className="w-10 h-10 text-primary-foreground" />
        </div>
        
        {/* Spinner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-32 h-32 text-primary/30 animate-spin-slow" />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-display font-semibold text-foreground">
          Finding Gifts
        </h3>
        <p 
          key={messageIndex}
          className="text-muted-foreground animate-fade-in min-h-[1.5rem]"
        >
          {messages[messageIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-56 h-1 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 92)}%` }}
        />
      </div>
    </div>
  );
};