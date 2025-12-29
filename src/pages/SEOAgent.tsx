import { Helmet } from "react-helmet-async";
import { ArrowLeft, FileText, Search, Clock, Zap, FileEdit, MessageSquare, Database, HardDrive, FileSpreadsheet, Hash, MessageCircle, Flame, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

import serpApiLogo from "@/assets/serp-api-logo.png";
import firecrawlLogo from "@/assets/firecrawl-logo.png";
import vellumLogo from "@/assets/vellum-logo.png";

const tools = [
  { name: "Google Drive", icon: HardDrive, color: "text-yellow-400" },
  { name: "Google Docs", icon: FileText, color: "text-blue-400" },
  { name: "Google Sheets", icon: FileSpreadsheet, color: "text-green-400" },
  { name: "SERP API", logo: serpApiLogo },
  { name: "Slack", icon: Hash, color: "text-purple-400" },
  { name: "Firecrawl", logo: firecrawlLogo },
  { name: "Vellum", logo: vellumLogo },
];

const SEOAgent = () => {
  return (
    <>
      <Helmet>
        <title>SEO Agent | 30 Days of AI Agents</title>
        <meta name="description" content="Automated SEO content creation agent that analyzes top-ranking content and generates optimized articles daily." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to all apps</span>
              </Link>
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                Day 4
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">SEO Agent</h1>
            </div>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Automated content creation powered by AI. Analyzes top-ranking content and generates optimized articles daily.
            </p>
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

          {/* Tools Used */}
          <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 text-center">Tools Used</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {tools.map((tool) => (
                <div 
                  key={tool.name}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
                >
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="w-5 h-5 object-contain" />
                  ) : tool.icon ? (
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                  ) : null}
                  <span className="text-white/70 text-sm">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Workflow */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4 text-center">Workflow Preview</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <iframe
                src="https://app.vellum.ai/public/workflow-deployments/781c2781-7158-42d4-ad0b-de3a05855fb2?releaseTag=LATEST&condensedNodeView=1&showOpenInVellum=1"
                className="w-full h-[600px] md:h-[700px]"
                title="SEO Agent Workflow"
                allow="clipboard-write"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEOAgent;
