import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Zap, BarChart3, Lightbulb, Presentation, ExternalLink, X, Loader2 } from "lucide-react";
import { ToolHeader } from "@/components/ToolHeader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import googleCalendarLogo from "@/assets/google-calendar-logo.png";
import googleDocsLogo from "@/assets/google-docs-logo.png";
import vellumLogo from "@/assets/vellum-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import gammaLogo from "@/assets/gamma-logo.png";

const ProductivityWrapped = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const handleOpenPreview = () => {
    setIsIframeLoading(true);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>2025 Calendar Roast | 30 Days of AI Agents</title>
        <meta name="description" content="AI agent that roasts how you spent your time in 2025 based on your Google Calendar and creates a brutally honest Gamma presentation." />
      </Helmet>

      <div className="min-h-screen relative overflow-x-hidden">
        {/* Gradient background - warm purple/orange tones */}
        <div 
          className="fixed inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #1a1025 0%, #2d1f3d 25%, #3d2952 50%, #2d1f3d 75%, #1a1025 100%)'
          }}
        />
        
        {/* Subtle overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Header */}
        <ToolHeader
          workflowName="productivity-wrapped-agent"
          forkAgentUrl="https://app.vellum.ai/public/workflow-deployments/YOUR_WORKFLOW_ID?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
        />

        {/* Main Content */}
        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Title Section */}
          <header className="text-center mb-8 animate-fade-in">
            {/* Built with logos */}
            <TooltipProvider>
              <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <span className="text-white/60 text-xs font-medium">Built with</span>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://vellum.ai?utm_medium=tool&utm_content=anita&utm_source=tool&utm_campaign=productivity_wrapped" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-md overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={vellumLogo} alt="Vellum" className="w-6 h-6 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">vellum.ai</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://lovable.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg overflow-hidden shadow-md hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={lovableLogo} alt="Lovable" className="w-full h-full object-cover" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">lovable.dev</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://calendar.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg overflow-hidden shadow-md hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={googleCalendarLogo} alt="Google Calendar" className="w-6 h-6 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">Google Calendar</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://docs.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg overflow-hidden shadow-md hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={googleDocsLogo} alt="Google Docs" className="w-6 h-6 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">Google Docs</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://gamma.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg overflow-hidden shadow-md hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={gammaLogo} alt="Gamma" className="w-6 h-6 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">gamma.app</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 tracking-tight drop-shadow-lg">
              2025 Calendar <span className="text-purple-400">Roast</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto drop-shadow">
              Give the AI your calendar and it will roast how you spent your time in 2025. Get a brutally honest Gamma presentation with your productivity sins exposed.
            </p>
          </header>

          {/* Workflow Preview */}
          <div className="mb-8">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              {/* Placeholder for workflow preview image */}
              <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-pink-900/50 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Presentation className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Workflow preview coming soon</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center">
                <a
                  href="https://app.vellum.ai/public/workflow-deployments/0b66e3ab-4655-4029-8ac4-9b23e0cc3949?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-400 rounded-xl text-white font-semibold text-lg shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  Fork this Agent
                </a>
              </div>
            </div>
          </div>

          {/* Fullscreen Workflow Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 bg-slate-900 border-white/10 flex flex-col">
              {/* Header bar with close button */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-800/50 flex-shrink-0">
                <span className="text-white/70 text-sm font-medium">2025 Calendar Roast Workflow</span>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative flex-1 min-h-0">
                {/* Loading State */}
                {isIframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 rounded-lg z-40">
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
                    <p className="text-white/70 text-sm mb-4">Loading workflow...</p>
                    <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
                
                <iframe
                  src="https://app.vellum.ai/public/workflow-deployments/0b66e3ab-4655-4029-8ac4-9b23e0cc3949?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
                  className="w-full h-full"
                  title="2025 Calendar Roast Workflow"
                  allow="clipboard-write"
                  onLoad={() => setIsIframeLoading(false)}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* How it works */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                How it works
              </h2>
              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p><span className="text-white font-medium">Ingests your calendar</span> — Pulls all your 2025 Google Calendar events and sees where your time really went</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <p><span className="text-white font-medium">Analyzes the damage</span> — Calculates hours in meetings, context switches, and productivity sins</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <p><span className="text-white font-medium">Roasts you mercilessly</span> — AI generates brutally honest observations about your time management</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Presentation className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <p><span className="text-white font-medium">Creates Gamma presentation</span> — Delivers a shareable "Wrapped" style presentation with all your stats and roasts</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProductivityWrapped;
