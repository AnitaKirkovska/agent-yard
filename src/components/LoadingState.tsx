import { Gift, Loader2, Sparkles, Search, Brain, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const stages = [
  { message: "Analyzing preferences...", subtext: "Consulting with the elves 🎄", icon: Brain, duration: 2500 },
  { message: "Searching the internet...", subtext: "Looking through millions of options", icon: Search, duration: 3000 },
  { message: "Hmm, that's not quite right...", subtext: "Let me dig deeper", icon: Search, duration: 1500 },
  { message: "Oh wait, this is cool!", subtext: "Found some interesting picks ✨", icon: Sparkles, duration: 2000 },
  { message: "Curating the best options...", subtext: "Quality over quantity", icon: Gift, duration: 2500 },
  { message: "Almost there...", subtext: "Wrapping up the perfect suggestions 🎁", icon: Heart, duration: 3000 },
];

const finalMessages = [
  "I think your friend will absolutely love these!",
  "These gifts are going to be a hit!",
  "Found some gems that match perfectly!",
  "Your gift game is about to level up!",
  "These picks are chef's kiss 👌",
];

export const LoadingState = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  
  const randomFinalMessage = useMemo(() => 
    finalMessages[Math.floor(Math.random() * finalMessages.length)], 
  []);

  useEffect(() => {
    let elapsed = 0;
    const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);
    
    const progressInterval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 85, 85);
      setProgress(newProgress);
    }, 50);

    let currentStage = 0;
    const advanceStage = () => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setStageIndex(currentStage);
        setTimeout(advanceStage, stages[currentStage].duration);
      } else {
        setTimeout(() => setShowFinal(true), 1500);
      }
    };
    
    setTimeout(advanceStage, stages[0].duration);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const currentStage = stages[stageIndex];
  const IconComponent = currentStage.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Main loader */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse" />
        
        {/* Icon container */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <IconComponent className="w-8 h-8 text-primary-foreground animate-bounce-gentle" />
        </div>
        
        {/* Spinner ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-28 h-28 text-primary/20 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2 min-h-[80px]">
        <h3 
          key={`title-${stageIndex}`}
          className="text-xl font-display font-semibold text-foreground animate-fade-in"
        >
          {showFinal ? "Ready!" : currentStage.message}
        </h3>
        <p 
          key={`sub-${stageIndex}-${showFinal}`}
          className="text-muted-foreground text-sm animate-fade-in"
        >
          {showFinal ? randomFinalMessage : currentStage.subtext}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 space-y-2">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${showFinal ? 100 : progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground/60 text-center">
          Stage {stageIndex + 1} of {stages.length}
        </p>
      </div>
    </div>
  );
};