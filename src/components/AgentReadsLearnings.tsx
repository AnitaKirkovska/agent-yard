import { Clock, Zap } from "lucide-react";

export const AgentReadsLearnings = () => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">The Challenge</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Build an AI agent that recommends books based on life situations—using real APIs to find recent, 
          well-reviewed books with covers, reviews, and purchase links. The initial approach worked but 
          took <span className="text-red-500 font-medium">~130 seconds</span> to complete. Through 
          parallelization, we reduced it to <span className="text-emerald-500 font-medium">~20 seconds</span>.
        </p>
      </div>

      {/* Before/After Diagrams */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-foreground">Before: Sequential</span>
            <span className="text-xs text-red-500 ml-auto">~130s</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <div className="text-center py-1.5 bg-background rounded">BookAgent</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Search Book 1</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Search Book 2</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Search Book 3</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Fetch Review 1</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Fetch Review 2</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-background rounded">Fetch Review 3</div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Each step waited for the previous one to complete
          </p>
        </div>

        {/* After */}
        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-foreground">After: Parallel</span>
            <span className="text-xs text-emerald-500 ml-auto">~20s</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <div className="grid grid-cols-3 gap-1">
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Self-help</div>
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Biography</div>
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Business</div>
            </div>
            <div className="text-center text-muted-foreground/50">↓ parallel</div>
            <div className="text-center py-1.5 bg-background rounded">CombineBooks</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="text-center py-1.5 bg-amber-500/10 rounded text-amber-600 dark:text-amber-400">BookAgent (Haiku)</div>
            <div className="text-center text-muted-foreground/50">↓</div>
            <div className="grid grid-cols-3 gap-1">
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Review 1</div>
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Review 2</div>
              <div className="text-center py-1.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400">Review 3</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Map nodes run searches & reviews in parallel
          </p>
        </div>
      </div>

      {/* Key Learnings */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Key Optimizations</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span><strong className="text-foreground">Map Nodes</strong> — Run book searches and review fetches in parallel (3x speedup)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span><strong className="text-foreground">Faster Model</strong> — Switched to Claude Haiku for curation (agent just picks, doesn't search)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">•</span>
            <span><strong className="text-foreground">Pre-search Strategy</strong> — Search 3 categories upfront, let agent curate from ~30 results</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
