import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const AgentReadsLearnings = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors py-3"
      >
        <Lightbulb className="w-4 h-4" />
        <span className="text-sm font-medium">What I Learned Building This</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mt-2">
          {/* Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">The Challenge</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Build an AI agent that recommends books based on life situations—using real APIs to find recent, 
              well-reviewed books with covers, reviews, and purchase links. The initial approach worked but 
              took <span className="text-amber-400 font-medium">~130 seconds</span> to complete. Through 
              parallelization, we reduced it to <span className="text-emerald-400 font-medium">~20 seconds</span>.
            </p>
          </div>

          {/* Before/After Diagrams */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-white">Before: Sequential</span>
                <span className="text-xs text-red-400 ml-auto">~130s</span>
              </div>
              <div className="font-mono text-xs text-white/60 space-y-1">
                <div className="text-center py-2 bg-white/5 rounded">BookAgent</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Search Book 1</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Search Book 2</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Search Book 3</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Fetch Review 1</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Fetch Review 2</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-white/5 rounded">Fetch Review 3</div>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Each step waited for the previous one to complete
              </p>
            </div>

            {/* After */}
            <div className="bg-white/5 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">After: Parallel</span>
                <span className="text-xs text-emerald-400 ml-auto">~20s</span>
              </div>
              <div className="font-mono text-xs text-white/60 space-y-1">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Self-help</div>
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Biography</div>
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Business</div>
                </div>
                <div className="text-center text-white/40">↓ parallel</div>
                <div className="text-center py-2 bg-white/5 rounded">CombineBooks</div>
                <div className="text-center text-white/40">↓</div>
                <div className="text-center py-2 bg-amber-500/10 rounded text-amber-300">BookAgent (Haiku)</div>
                <div className="text-center text-white/40">↓</div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Review 1</div>
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Review 2</div>
                  <div className="text-center py-2 bg-emerald-500/10 rounded text-emerald-300">Review 3</div>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Map nodes run searches & reviews in parallel
              </p>
            </div>
          </div>

          {/* Key Learnings */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-white">Key Optimizations</h3>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span><strong className="text-white">Map Nodes</strong> — Run book searches and review fetches in parallel (3x speedup)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span><strong className="text-white">Faster Model</strong> — Switched to Claude Haiku for curation (agent just picks, doesn't search)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span><strong className="text-white">Pre-search Strategy</strong> — Search 3 categories upfront, let agent curate from ~30 results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
