import { useState, useEffect } from "react";
import { Calendar, Sparkles, Gift, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import santaFace from "@/assets/santa-face.png";

interface DayApp {
  day: number;
  date: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  available: boolean;
}

const apps: DayApp[] = [
  {
    day: 1,
    date: "Dec 23",
    title: "Secret Santa Gift Finder",
    description: "AI-powered gift recommendations based on your friend's personality",
    route: "/secret-santa-ai-gift-finder",
    icon: <img src={santaFace} alt="Santa" className="w-8 h-8 object-contain" />,
    available: true,
  },
  // Future days will be added here
  ...Array.from({ length: 29 }, (_, i) => ({
    day: i + 2,
    date: `Dec ${24 + i > 31 ? (24 + i - 31) : 24 + i}`,
    title: "Coming Soon",
    description: "A new AI agent app will be revealed",
    route: "#",
    icon: <Sparkles className="w-6 h-6 text-muted-foreground/50" />,
    available: false,
  })),
];

const VOTED_STORAGE_KEY = "ai-agents-30-days-votes";

const getVotedApps = (): number[] => {
  try {
    const stored = localStorage.getItem(VOTED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setVotedApp = (day: number) => {
  const voted = getVotedApps();
  if (!voted.includes(day)) {
    localStorage.setItem(VOTED_STORAGE_KEY, JSON.stringify([...voted, day]));
  }
};

const Index = () => {
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [votedApps, setVotedApps] = useState<number[]>([]);
  const [isVoting, setIsVoting] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setVotedApps(getVotedApps());
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    const { data, error } = await supabase
      .from("app_votes")
      .select("app_day, vote_count");
    
    if (!error && data) {
      const votesMap: Record<number, number> = {};
      data.forEach((row) => {
        votesMap[row.app_day] = row.vote_count;
      });
      setVotes(votesMap);
    }
  };

  const handleVote = async (day: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (votedApps.includes(day)) {
      toast({
        title: "Already voted!",
        description: "You've already liked this app.",
      });
      return;
    }

    setIsVoting(day);

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from("app_votes")
        .select("vote_count")
        .eq("app_day", day)
        .maybeSingle();

      if (existing) {
        // Update existing record
        await supabase
          .from("app_votes")
          .update({ vote_count: existing.vote_count + 1 })
          .eq("app_day", day);
      } else {
        // Insert new record
        await supabase
          .from("app_votes")
          .insert({ app_day: day, vote_count: 1 });
      }

      // Update local state
      setVotes((prev) => ({ ...prev, [day]: (prev[day] || 0) + 1 }));
      setVotedApp(day);
      setVotedApps((prev) => [...prev, day]);

      toast({
        title: "Thanks for the love! ❤️",
        description: "Your vote has been counted.",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "0s" }}
        />
        <div 
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "-5s" }}
        />
        <div 
          className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-orb-float"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-subtle mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 tracking-tight">
            30 Days of
            <span className="block text-gradient mt-2">AI Agents</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every day for the next 30 days, I'm building a new AI agent app. 
            Follow along and try each one as they launch!
          </p>

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Started December 23, 2024</span>
          </div>
        </header>

        {/* Calendar Grid */}
        <section className="animate-scale-in" style={{ animationDelay: "0.15s" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {apps.map((app) => (
              <AppCard 
                key={app.day} 
                app={app} 
                votes={votes[app.day] || 0}
                hasVoted={votedApps.includes(app.day)}
                isVoting={isVoting === app.day}
                onVote={handleVote}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p>Built with love using <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Lovable</a></p>
        </footer>
      </div>
    </div>
  );
};

interface AppCardProps {
  app: DayApp;
  votes: number;
  hasVoted: boolean;
  isVoting: boolean;
  onVote: (day: number, e: React.MouseEvent) => void;
}

const AppCard = ({ app, votes, hasVoted, isVoting, onVote }: AppCardProps) => {
  if (!app.available) {
    return (
      <div className="group relative p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm opacity-60">
        <div className="text-xs font-medium text-muted-foreground/60 mb-2">
          Day {app.day}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/30 mb-3">
          {app.icon}
        </div>
        <h3 className="text-sm font-medium text-muted-foreground/60 line-clamp-1">
          {app.title}
        </h3>
        <p className="text-xs text-muted-foreground/40 mt-1 line-clamp-2">
          {app.description}
        </p>
      </div>
    );
  }

  return (
    <Link
      to={app.route}
      className="group relative p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
    >
      <div className="absolute top-2 right-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
          Live
        </span>
      </div>
      
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Day {app.day} · {app.date}
      </div>
      
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-subtle mb-3 group-hover:scale-110 transition-transform duration-300">
        {app.icon}
      </div>
      
      <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {app.title}
      </h3>
      
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {app.description}
      </p>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Try it</span>
          <ArrowRight className="w-3 h-3" />
        </div>
        
        <button
          onClick={(e) => onVote(app.day, e)}
          disabled={isVoting}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            hasVoted
              ? "bg-primary/20 text-primary"
              : "bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <Heart className={`w-3 h-3 ${hasVoted ? "fill-primary" : ""} ${isVoting ? "animate-pulse" : ""}`} />
          <span>{votes}</span>
        </button>
      </div>
    </Link>
  );
};

export default Index;
