import { Gift, Sparkles } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface LoadingStateProps {
  description?: string;
}

const getLoadingMessages = (description?: string): string[] => {
  const baseMessages = [
    "Finding the perfect gift...",
    "Thinking about what they'd love...",
    "Almost there...",
  ];

  if (!description) return baseMessages;

  const lowerDesc = description.toLowerCase();
  const personalizedMessages: string[] = [];

  if (lowerDesc.includes("cook") || lowerDesc.includes("kitchen") || lowerDesc.includes("baking")) {
    personalizedMessages.push("Browsing kitchen treasures...");
  }
  if (lowerDesc.includes("read") || lowerDesc.includes("book")) {
    personalizedMessages.push("Searching for bookish delights...");
  }
  if (lowerDesc.includes("game") || lowerDesc.includes("gaming")) {
    personalizedMessages.push("Level up their gift game...");
  }
  if (lowerDesc.includes("music") || lowerDesc.includes("guitar") || lowerDesc.includes("piano")) {
    personalizedMessages.push("Finding something melodic...");
  }
  if (lowerDesc.includes("travel") || lowerDesc.includes("adventure")) {
    personalizedMessages.push("Planning an adventure-worthy gift...");
  }
  if (lowerDesc.includes("coffee") || lowerDesc.includes("tea")) {
    personalizedMessages.push("Brewing up some ideas...");
  }
  if (lowerDesc.includes("fitness") || lowerDesc.includes("gym") || lowerDesc.includes("workout")) {
    personalizedMessages.push("Working out the best options...");
  }
  if (lowerDesc.includes("art") || lowerDesc.includes("creative") || lowerDesc.includes("craft")) {
    personalizedMessages.push("Getting creative...");
  }
  if (lowerDesc.includes("tech") || lowerDesc.includes("gadget")) {
    personalizedMessages.push("Scanning for cool gadgets...");
  }
  if (lowerDesc.includes("plant") || lowerDesc.includes("garden")) {
    personalizedMessages.push("Growing some gift ideas...");
  }
  if (lowerDesc.includes("pet") || lowerDesc.includes("dog") || lowerDesc.includes("cat")) {
    personalizedMessages.push("Sniffing out paw-fect gifts...");
  }

  return personalizedMessages.length > 0 
    ? [...personalizedMessages, ...baseMessages]
    : baseMessages;
};

export const LoadingState = ({ description }: LoadingStateProps) => {
  const loadingMessages = useMemo(() => getLoadingMessages(description), [description]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % loadingMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-fade-in">
      {/* Animated gift icon */}
      <div className="relative">
        {/* Pulsing glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse" />
        
        {/* Gift box with bounce */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
          <Gift className="w-10 h-10 text-primary" />
        </div>
        
        {/* Floating sparkles */}
        <Sparkles 
          className="absolute -top-2 -right-2 w-5 h-5 text-primary/60 animate-pulse" 
          style={{ animationDelay: '0.5s' }}
        />
        <Sparkles 
          className="absolute -bottom-1 -left-2 w-4 h-4 text-primary/40 animate-pulse" 
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Simple message */}
      <p 
        key={currentIndex}
        className="text-muted-foreground text-center animate-fade-in"
      >
        {loadingMessages[currentIndex]}
      </p>
    </div>
  );
};
