import { Calendar, Sparkles, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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

const Index = () => {
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
              <AppCard key={app.day} app={app} />
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

const AppCard = ({ app }: { app: DayApp }) => {
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
      
      <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Try it</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
};

export default Index;
