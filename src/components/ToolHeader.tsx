import { ArrowLeft, Lightbulb, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ExecutionCounter } from "@/components/ExecutionCounter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ToolHeaderProps {
  workflowName: string;
  whatILearned?: {
    title?: string;
    content: ReactNode;
  };
  forkAgentUrl?: string;
  className?: string;
}

export const ToolHeader = ({
  workflowName,
  whatILearned,
  forkAgentUrl,
  className = "",
}: ToolHeaderProps) => {
  return (
    <div className={`relative z-10 px-4 pt-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all apps
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ExecutionCounter workflowName={workflowName} />
        
        {whatILearned && (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground text-xs font-medium transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                What I Learned
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-display flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  {whatILearned.title || "What I Learned Building This"}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {whatILearned.content}
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {forkAgentUrl && (
          <a 
            href={forkAgentUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Fork this Agent
          </a>
        )}
      </div>
    </div>
  );
};
