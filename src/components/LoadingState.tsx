import { Loader2, Brain, Search, Frown, Sparkles, Scale, ListChecks, Trophy, LucideIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface LoadingMessage {
  text: string;
  icon: LucideIcon;
}

interface LoadingStateProps {
  description?: string;
}

const getLoadingMessages = (description?: string): LoadingMessage[] => {
  const baseMessages: LoadingMessage[] = [
    { text: "Hmm, let me think about what they'd actually love...", icon: Brain },
    { text: "Ooh, searching for something special...", icon: Search },
    { text: "Nah, that's not quite right for them...", icon: Frown },
    { text: "Oh wait, this might be fun! ✨", icon: Sparkles },
    { text: "Actually, let me compare a few more options...", icon: Scale },
    { text: "Oh no, that's probably not a good choice...", icon: Frown },
    { text: "Getting closer! These are looking good...", icon: ListChecks },
    { text: "Ooh yes, I think they'd really like this one! 🏆", icon: Trophy },
  ];

  if (!description) return baseMessages;

  // Extract keywords from description for personalized messages
  const lowerDesc = description.toLowerCase();
  const personalizedMessages: LoadingMessage[] = [];

  if (lowerDesc.includes("cook") || lowerDesc.includes("kitchen") || lowerDesc.includes("baking")) {
    personalizedMessages.push({ text: "Ooh, a foodie! Maybe a fancy kitchen gadget? 🍳", icon: Sparkles });
  }
  if (lowerDesc.includes("read") || lowerDesc.includes("book")) {
    personalizedMessages.push({ text: "A book lover! Let me find something literary... 📚", icon: Search });
  }
  if (lowerDesc.includes("game") || lowerDesc.includes("gaming") || lowerDesc.includes("video game")) {
    personalizedMessages.push({ text: "A gamer, nice! Checking out some cool options... 🎮", icon: Brain });
  }
  if (lowerDesc.includes("music") || lowerDesc.includes("guitar") || lowerDesc.includes("piano")) {
    personalizedMessages.push({ text: "Music lover detected! This could be fun... 🎵", icon: Sparkles });
  }
  if (lowerDesc.includes("travel") || lowerDesc.includes("adventure")) {
    personalizedMessages.push({ text: "An adventurer! Maybe something for their travels... ✈️", icon: Search });
  }
  if (lowerDesc.includes("coffee") || lowerDesc.includes("tea")) {
    personalizedMessages.push({ text: "A caffeine enthusiast! I know just the thing... ☕", icon: Sparkles });
  }
  if (lowerDesc.includes("fitness") || lowerDesc.includes("gym") || lowerDesc.includes("workout") || lowerDesc.includes("yoga")) {
    personalizedMessages.push({ text: "Fitness focused! Searching for workout-worthy gifts... 💪", icon: Search });
  }
  if (lowerDesc.includes("art") || lowerDesc.includes("creative") || lowerDesc.includes("craft")) {
    personalizedMessages.push({ text: "A creative soul! Let me find something artistic... 🎨", icon: Brain });
  }
  if (lowerDesc.includes("tech") || lowerDesc.includes("gadget")) {
    personalizedMessages.push({ text: "A tech person! Browsing the cool gadgets... 📱", icon: Search });
  }
  if (lowerDesc.includes("plant") || lowerDesc.includes("garden")) {
    personalizedMessages.push({ text: "A plant parent! Looking for something green... 🌱", icon: Sparkles });
  }
  if (lowerDesc.includes("pet") || lowerDesc.includes("dog") || lowerDesc.includes("cat")) {
    personalizedMessages.push({ text: "A pet lover! Maybe something for their furry friend... 🐾", icon: Sparkles });
  }
  if (lowerDesc.includes("wine") || lowerDesc.includes("beer") || lowerDesc.includes("cocktail")) {
    personalizedMessages.push({ text: "Someone who appreciates a good drink! 🍷", icon: Search });
  }

  // Mix personalized messages with base messages
  return [...personalizedMessages, ...baseMessages];
};

export const LoadingState = ({ description }: LoadingStateProps) => {
  const loadingMessages = useMemo(() => getLoadingMessages(description), [description]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messageKey, setMessageKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set([0]));

  const currentMessage = loadingMessages[currentIndex];
  const IconComponent = currentMessage.icon;

  useEffect(() => {
    // Progress bar - fills to ~90% over 50 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        return prev + (Math.random() * 1.5 + 0.5);
      });
    }, 1000);

    // Message rotation - every 5-8 seconds randomly
    const rotateMessage = () => {
      setUsedIndices(prev => {
        if (prev.size >= loadingMessages.length - 2) {
          return new Set();
        }
        return prev;
      });
      
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * loadingMessages.length);
      } while (usedIndices.has(newIndex));
      
      setUsedIndices(prev => new Set([...prev, newIndex]));
      setCurrentIndex(newIndex);
      setMessageKey(prev => prev + 1);
      
      const nextInterval = 5000 + Math.random() * 3000;
      setTimeout(rotateMessage, nextInterval);
    };

    const firstTimeout = setTimeout(rotateMessage, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(firstTimeout);
    };
  }, [loadingMessages]);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Main loader */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse" />
        
        {/* Icon container */}
        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-lg border border-primary/10">
          <IconComponent 
            key={messageKey} 
            className="w-12 h-12 text-primary animate-fade-in" 
          />
        </div>
        
        {/* Spinner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-36 h-36 text-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2 min-h-[60px]">
        <p 
          key={`msg-${messageKey}`}
          className="text-muted-foreground animate-fade-in max-w-md"
        >
          {currentMessage.text}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};