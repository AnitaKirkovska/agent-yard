import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import santaFace from "@/assets/santa-face.png";

const loadingMessages = [
  "Analyzing preferences... consulting with the elves 🎄",
  "Searching the internet for the perfect gifts...",
  "Hmm, not quite right... your friend deserves better",
  "Oh wait, this is cool! Found something interesting ✨",
  "Comparing options... only the best-rated items",
  "Curating the perfect list... almost there!",
  "Found some gems! These are going to be good 🏆",
];

export const LoadingState = () => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [messageKey, setMessageKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set([0]));

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
      setCurrentMessage(loadingMessages[newIndex]);
      setMessageKey(prev => prev + 1);
      
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
        
        {/* Santa container */}
        <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-lg border border-primary/10">
          <img src={santaFace} alt="Santa" className="w-20 h-20 object-contain" />
        </div>
        
        {/* Spinner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-40 h-40 text-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2 min-h-[60px]">
        <p 
          key={`msg-${messageKey}`}
          className="text-muted-foreground animate-fade-in max-w-md"
        >
          {currentMessage}
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