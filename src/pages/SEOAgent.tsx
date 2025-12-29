import { Helmet } from "react-helmet-async";
import { FileText, Search, Clock, Zap, FileEdit, MessageSquare, Database, ExternalLink } from "lucide-react";
import { ToolHeader } from "@/components/ToolHeader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import googleDriveLogo from "@/assets/google-drive-logo.png";
import serpApiLogo from "@/assets/serp-api-logo.png";
import slackLogo from "@/assets/slack-logo.png";
import firecrawlLogo from "@/assets/firecrawl-logo.png";
import vellumLogo from "@/assets/vellum-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import seoAgentPreview from "@/assets/seo-agent-preview.png";

const tools = [
  { name: "Google Drive", logo: googleDriveLogo, url: "https://drive.google.com" },
  { name: "SERP API", logo: serpApiLogo, url: "https://serpapi.com" },
  { name: "Slack", logo: slackLogo, url: "https://slack.com" },
  { name: "Firecrawl", logo: firecrawlLogo, url: "https://firecrawl.dev" },
  { name: "Vellum", logo: vellumLogo, url: "https://vellum.ai" },
];

const SEOAgent = () => {
  return (
    <>
      <Helmet>
        <title>SEO Agent | 30 Days of AI Agents</title>
        <meta name="description" content="Automated SEO content creation agent that analyzes top-ranking content and generates optimized articles daily." />
      </Helmet>

      <div className="min-h-screen relative overflow-x-hidden">
        {/* Gradient background */}
        <div 
          className="fixed inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 25%, #2c5364 50%, #203a43 75%, #0f2027 100%)'
          }}
        />
        
        {/* Subtle overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Header */}
        <ToolHeader
          workflowName="seo-content-agent"
          forkAgentUrl="https://app.vellum.ai/public/workflow-deployments/781c2781-7158-42d4-ad0b-de3a05855fb2?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
        />

        {/* Main Content */}
        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Title Section */}
          <header className="text-center mb-8 animate-fade-in">
            {/* Built with logos */}
            <TooltipProvider>
              <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                <span className="text-white/70 text-sm font-medium">Built with</span>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://vellum.ai?utm_medium=tool&utm_content=anita&utm_source=tool&utm_campaign=seo_agent" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={vellumLogo} alt="Vellum" className="w-8 h-8 object-contain" />
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
                      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer"
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
                      href="https://firecrawl.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={firecrawlLogo} alt="Firecrawl" className="w-8 h-8 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">firecrawl.dev</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://serpapi.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <img src={serpApiLogo} alt="SerpAPI" className="w-full h-full object-cover" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">serpapi.com</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://drive.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={googleDriveLogo} alt="Google Drive" className="w-8 h-8 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">Google Drive</p>
                  </TooltipContent>
                </Tooltip>


                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href="https://slack.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl overflow-hidden shadow-lg hover:scale-110 transition-transform cursor-pointer bg-white flex items-center justify-center"
                    >
                      <img src={slackLogo} alt="Slack" className="w-8 h-8 object-contain" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card text-foreground border-border">
                    <p className="font-medium">Slack</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 tracking-tight drop-shadow-lg">
              SEO <span className="text-emerald-400">Agent</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto drop-shadow">
              Automated content creation powered by AI. Analyzes top-ranking content and generates optimized articles daily.
            </p>
          </header>

          {/* Workflow Preview */}
          <div className="mb-8">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <img 
                src={seoAgentPreview} 
                alt="SEO Agent Workflow Preview" 
                className="w-full h-[400px] md:h-[500px] object-cover object-top"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center">
                <a
                  href="https://app.vellum.ai/public/workflow-deployments/781c2781-7158-42d4-ad0b-de3a05855fb2?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium transition-all hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  Preview Agent
                </a>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                How it works
              </h2>
              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p><span className="text-white font-medium">Runs daily at 9am</span> — Automatically picks up new keywords from a Google Sheet</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <p><span className="text-white font-medium">Analyzes competition</span> — Scrapes and analyzes top-ranking content using SERP API and Firecrawl</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Database className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p><span className="text-white font-medium">Parallel research</span> — Gathers additional data points to enrich the article content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileEdit className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <p><span className="text-white font-medium">Generates content</span> — Creates a comprehensive outline and writes the full article</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <p><span className="text-white font-medium">Delivers & notifies</span> — Saves to Google Docs and pings Slack when ready for review</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SEOAgent;
