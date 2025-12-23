import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Sparkles, DollarSign, UserCircle } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Friend Description */}
      <div className="space-y-3">
        <Label 
          htmlFor="friend-description" 
          className="flex items-center gap-2 text-base font-medium text-foreground"
        >
          <UserCircle className="w-5 h-5 text-primary" />
          Describe Your Friend
        </Label>
        <Textarea
          id="friend-description"
          placeholder="Hobbies, interests, personality..."
          value={friendDescription}
          onChange={(e) => setFriendDescription(e.target.value)}
          className={cn(
            "min-h-[120px] resize-none transition-all duration-300",
            "bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/60"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label 
          htmlFor="budget" 
          className="flex items-center gap-2 text-base font-medium text-foreground"
        >
          <DollarSign className="w-5 h-5 text-accent" />
          Gift Budget
        </Label>
        <Input
          id="budget"
          type="text"
          placeholder="e.g., $25, $50-75"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={cn(
            "transition-all duration-300",
            "bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/60"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className={cn(
          "w-full h-14 text-lg font-semibold transition-all duration-300",
          "bg-gradient-festive hover:opacity-90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isValid && !isLoading && "animate-pulse-glow"
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
            <Gift className="w-5 h-5" />
          </span>
        )}
      </Button>
    </form>
  );
};
