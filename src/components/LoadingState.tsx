import { Gift, Loader2, Sparkles, Search, Brain, Heart, Zap, Star, Coffee, Rocket } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const loadingMessages = [
  { message: "Analyzing preferences...", subtext: "Consulting with the elves 🎄" },
  { message: "Searching the internet...", subtext: "Browsing top retailers for you" },
  { message: "Hmm, not quite right...", subtext: "Your friend deserves better" },
  { message: "Oh wait, this is cool!", subtext: "Found something interesting ✨" },
  { message: "Comparing options...", subtext: "Only the best-rated items" },
  { message: "Curating the perfect list...", subtext: "Almost there!" },
  { message: "Found some gems!", subtext: "These are going to be good 🏆" },
];

const finalMessages = [
  "I think your friend will absolutely love these!",
  "These gifts are going to be a hit!",
  "Found some gems that match perfectly!",
  "Your gift game is about to level up!",
  "These picks are chef's kiss 👌",
  "Nailed it! Check these out!",
];

const icons = [Gift, Sparkles, Search, Brain, Heart, Zap, Star, Coffee, Rocket];

export const LoadingState = () => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [messageKey, setMessageKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set([0]));
  
  const getRandomIcon = useCallback(() => {
    return icons[Math.floor(Math.random() * icons.length)];
  }, []);
  
  const [IconComponent, setIconComponent] = useState(() => getRandomIcon());

  useEffect(() => {
    // Progress bar - fills to ~90% over 50 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90;
        // Slow, variable progress
        return prev + (Math.random() * 1.5 + 0.5);
      });
    }, 1000);

    // Message rotation - every 2-4 seconds randomly
    const rotateMessage = () => {
      setUsedIndices(prev => {
        // Reset if we've used most messages
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
      setCurrentMessage(loadingMessages[newIndex]);
      setIconComponent(() => getRandomIcon());
      setMessageKey(prev => prev + 1);
      
      // Schedule next rotation with random interval (5-8s)
      const nextInterval = 5000 + Math.random() * 3000;
      setTimeout(rotateMessage, nextInterval);
    };

    const firstTimeout = setTimeout(rotateMessage, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(firstTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Main loader */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse" />
        
        {/* Icon container */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <IconComponent key={messageKey} className="w-8 h-8 text-primary-foreground animate-bounce-gentle" />
        </div>
        
        {/* Spinner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-28 h-28 text-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2 min-h-[80px]">
        <h3 
          key={`title-${messageKey}`}
          className="text-xl font-display font-semibold text-foreground animate-fade-in"
        >
          {currentMessage.message}
        </h3>
        <p 
          key={`sub-${messageKey}`}
          className="text-muted-foreground text-sm animate-fade-in"
        >
          {currentMessage.subtext}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 space-y-2">
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