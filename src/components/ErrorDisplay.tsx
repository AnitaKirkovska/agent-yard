import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div 
        className={cn(
          "p-6 rounded-xl border border-destructive/30 bg-destructive/5",
          "flex items-start gap-4"
        )}
      >
        <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold text-destructive">Something went wrong</h4>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>

      <Button
        onClick={onRetry}
        variant="outline"
        className="w-full h-12 border-destructive/30 hover:border-destructive hover:bg-destructive/5"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};
