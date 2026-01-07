import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bot, Sparkles, Zap, ArrowRight, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolHeader } from "@/components/ToolHeader";

const SENIORITY_LEVELS = [
  "Entry Level",
  "Mid Level", 
  "Senior",
  "Lead",
  "Manager",
  "Director",
  "VP",
  "C-Level"
];

const DEFAULT_RESPONSIBILITIES = [
  "Prospecting and outreach",
  "Running discovery calls",
  "Managing pipeline in CRM",
  "Following up with leads",
  "Preparing proposals"
];

const DEFAULT_TOOLS = [
  "Slack",
  "Gmail",
  "Salesforce",
  "Google Calendar",
  "LinkedIn",
  "Zoom",
  "HubSpot",
  "Notion",
  "Asana",
  "Microsoft Teams"
];

const AutomationAdvisor = () => {
  const [jobTitle, setJobTitle] = useState("Sales Development Representative");
  const [seniorityLevel, setSeniorityLevel] = useState("Mid Level");
  const [responsibilities, setResponsibilities] = useState<string[]>(DEFAULT_RESPONSIBILITIES);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [toolsUsed, setToolsUsed] = useState<string[]>(DEFAULT_TOOLS.slice(0, 5));
  const [primaryTool, setPrimaryTool] = useState("Salesforce");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [involvesCustomerData, setInvolvesCustomerData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddResponsibility = () => {
    if (newResponsibility.trim() && !responsibilities.includes(newResponsibility.trim())) {
      setResponsibilities([...responsibilities, newResponsibility.trim()]);
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (resp: string) => {
    setResponsibilities(responsibilities.filter(r => r !== resp));
  };

  const handleToggleTool = (tool: string) => {
    if (toolsUsed.includes(tool)) {
      setToolsUsed(toolsUsed.filter(t => t !== tool));
      if (primaryTool === tool) {
        setPrimaryTool("");
      }
    } else {
      setToolsUsed([...toolsUsed, tool]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const isFormValid = jobTitle && seniorityLevel && responsibilities.length > 0 && toolsUsed.length > 0 && primaryTool;

  return (
    <>
      <Helmet>
        <title>AI Automation Advisor | AgentYard</title>
        <meta name="description" content="Get personalized AI agent recommendations based on your role and workflows" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ToolHeader workflowName="automation-advisor-agent" />
        
        {/* Hero Section */}
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-500/20 mb-4">
            <Bot className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">AI Automation Advisor</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Tell us about your role and we'll suggest 3 AI agents to supercharge your productivity</p>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Job Title & Seniority */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  About Your Role
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Help us understand your position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-slate-200">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Sales Development Representative"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seniority" className="text-slate-200">Seniority Level</Label>
                    <Select value={seniorityLevel} onValueChange={setSeniorityLevel}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {SENIORITY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level} className="text-white hover:bg-slate-700">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Responsibilities */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Core Responsibilities
                </CardTitle>
                <CardDescription className="text-slate-400">
                  What do you spend most of your time doing?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {responsibilities.map((resp) => (
                    <Badge 
                      key={resp} 
                      variant="secondary" 
                      className="bg-purple-600/30 text-purple-200 border border-purple-500/30 px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      {resp}
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(resp)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="Add a responsibility..."
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddResponsibility}
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tools Used Weekly */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Tools Used Weekly
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Select all the tools you use on a weekly basis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TOOLS.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => handleToggleTool(tool)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        toolsUsed.includes(tool)
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-slate-900/50 border-slate-600 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>

                {toolsUsed.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <Label className="text-slate-200">Primary Tool</Label>
                    <Select value={primaryTool} onValueChange={setPrimaryTool}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white max-w-xs">
                        <SelectValue placeholder="Select your primary tool" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {toolsUsed.map((tool) => (
                          <SelectItem key={tool} value={tool} className="text-white hover:bg-slate-700">
                            {tool}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance & Data */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🔒 Compliance & Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Help us recommend agents that fit your requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Requires Approval Workflows</Label>
                    <p className="text-sm text-slate-400">Do your tasks require manager or stakeholder approval?</p>
                  </div>
                  <Switch
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-slate-200">Involves Customer Data</Label>
                    <p className="text-sm text-slate-400">Does your work involve sensitive customer information?</p>
                  </div>
                  <Switch
                    checked={involvesCustomerData}
                    onCheckedChange={setInvolvesCustomerData}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing your workflow...
                </>
              ) : (
                <>
                  Get My Agent Recommendations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AutomationAdvisor;
