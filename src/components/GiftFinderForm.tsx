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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Friend Description */}
      <div className="space-y-3">
        <Label 
          htmlFor="friend-description" 
          className="flex items-center gap-2 text-sm font-medium text-foreground tracking-wide"
        >
          <UserCircle className="w-4 h-4 text-primary" />
          About Your Recipient
        </Label>
        <Textarea
          id="friend-description"
          placeholder="What are their hobbies, interests, and favorite things? The more details you share, the better we can match..."
          value={friendDescription}
          onChange={(e) => setFriendDescription(e.target.value)}
          className={cn(
            "min-h-[140px] resize-none transition-all duration-200",
            "bg-muted/30 border-border rounded-2xl",
            "focus:border-primary focus:ring-2 focus:ring-primary/10",
            "placeholder:text-muted-foreground/50 text-foreground"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Budget */}
      <div className="space-y-3">
        <Label 
          htmlFor="budget" 
          className="flex items-center gap-2 text-sm font-medium text-foreground tracking-wide"
        >
          <DollarSign className="w-4 h-4 text-accent" />
          Budget Range
        </Label>
        <Input
          id="budget"
          type="text"
          placeholder="e.g., $50, $25-75, under $100"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={cn(
            "h-12 transition-all duration-200 rounded-xl",
            "bg-muted/30 border-border",
            "focus:border-primary focus:ring-2 focus:ring-primary/10",
            "placeholder:text-muted-foreground/50 text-foreground"
          )}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className={cn(
          "w-full h-14 text-base font-medium transition-all duration-200 rounded-2xl",
          "bg-gradient-primary text-primary-foreground",
          "hover:opacity-90 hover:shadow-glow",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <Gift className="w-5 h-5 animate-spin" />
            Finding Gifts...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            Find Perfect Gifts
          </span>
        )}
      </Button>
    </form>
  );
};
