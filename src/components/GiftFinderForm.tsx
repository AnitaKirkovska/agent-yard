import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Sparkles, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GiftFinderFormProps {
  onSubmit: (inputs: { friendDescription: string; budget: string }) => void;
  isLoading: boolean;
}

export const GiftFinderForm = ({ onSubmit, isLoading }: GiftFinderFormProps) => {
  const [friendDescription, setFriendDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendDescription.trim() && budget.trim()) {
      onSubmit({ friendDescription, budget });
    }
  };

  const isValid = friendDescription.trim() && budget.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Friend Description */}
      <div className="space-y-3">
        <Label 
          htmlFor="friend-description" 
          className="flex items-center gap-2.5 text-sm font-medium text-foreground"
        >
          <div className="p-1.5 rounded-lg bg-primary/10">
            <User className="w-4 h-4 text-primary" />
          </div>
          Describe your friend
        </Label>
        <Textarea
          id="friend-description"
          placeholder="Their hobbies, interests, personality traits..."
          value={friendDescription}
          onChange={(e) => setFriendDescription(e.target.value)}
          className={cn(
            "min-h-[140px] resize-none transition-all duration-300",
            "bg-muted/50 border-border/50 rounded-2xl",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:bg-card",
            "placeholder:text-muted-foreground/50 text-base"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label 
          htmlFor="budget" 
          className="flex items-center gap-2.5 text-sm font-medium text-foreground"
        >
          <div className="p-1.5 rounded-lg bg-accent/10">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          Gift budget
        </Label>
        <Input
          id="budget"
          type="text"
          placeholder="e.g., $25, $50-75, under $100"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={cn(
            "h-12 transition-all duration-300",
            "bg-muted/50 border-border/50 rounded-2xl",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:bg-card",
            "placeholder:text-muted-foreground/50 text-base"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className={cn(
          "w-full h-14 text-base font-semibold transition-all duration-300 rounded-2xl",
          "bg-gradient-primary hover:opacity-90 hover:shadow-glow",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <Gift className="w-5 h-5 animate-spin-slow" />
            Finding Perfect Gifts...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Find Gift Ideas
          </span>
        )}
      </Button>
    </form>
  );
};