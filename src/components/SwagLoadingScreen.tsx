import { useState, useEffect } from "react";
import { Gift, Sparkles, Package, Search, Wand2 } from "lucide-react";

const loadingMessages = [
  { text: "Analyzing your unique style...", icon: Search },
  { text: "Searching for the perfect swag match...", icon: Sparkles },
  { text: "Our AI is getting creative...", icon: Wand2 },
  { text: "Designing something just for you...", icon: Package },
  { text: "Adding the finishing touches...", icon: Gift },
  { text: "Almost there, this is going to be good...", icon: Sparkles },
];

const SwagLoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  const CurrentIcon = loadingMessages[messageIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {/* Animated gift box */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center animate-pulse shadow-2xl shadow-fuchsia-500/30">
          <Gift className="w-12 h-12 text-white" />
        </div>
        
        {/* Floating sparkles */}
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute -bottom-1 -left-2 animate-bounce" style={{ animationDelay: "0.5s" }}>
          <Sparkles className="w-5 h-5 text-fuchsia-400" />
        </div>
        <div className="absolute top-1/2 -right-4 animate-bounce" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-4 h-4 text-violet-400" />
        </div>
      </div>

      {/* Loading message with icon */}
      <div className="flex items-center gap-3 mb-4">
        <CurrentIcon className="w-5 h-5 text-fuchsia-400 animate-pulse" />
        <p className="text-xl font-medium text-white transition-all duration-500">
          {loadingMessages[messageIndex].text}
        </p>
      </div>

      {/* Animated dots */}
      <p className="text-fuchsia-300/80 text-lg font-mono min-w-[40px]">
        {dots || "\u00A0"}
      </p>
    </div>
  );
};

export default SwagLoadingScreen;
