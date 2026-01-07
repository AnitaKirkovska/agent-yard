import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Loader2, X, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToolHeader } from "@/components/ToolHeader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const ALL_RESPONSIBILITIES = [
  "Prospecting and outreach",
  "Running discovery calls",
  "Managing pipeline in CRM",
  "Following up with leads",
  "Preparing proposals",
  "Client presentations",
  "Contract negotiations",
  "Account management",
  "Market research",
  "Reporting and analytics"
];

const ALL_TOOLS = [
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
  const [responsibilities, setResponsibilities] = useState<string[]>(ALL_RESPONSIBILITIES.slice(0, 5));
  const [toolsUsed, setToolsUsed] = useState<string[]>(ALL_TOOLS.slice(0, 5));
  const [primaryTool, setPrimaryTool] = useState("Salesforce");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [involvesCustomerData, setInvolvesCustomerData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [respOpen, setRespOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const handleToggleResponsibility = (resp: string) => {
    if (responsibilities.includes(resp)) {
      setResponsibilities(responsibilities.filter(r => r !== resp));
    } else {
      setResponsibilities([...responsibilities, resp]);
    }
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

  const handleRemoveResponsibility = (resp: string) => {
    setResponsibilities(responsibilities.filter(r => r !== resp));
  };

  const handleRemoveTool = (tool: string) => {
    setToolsUsed(toolsUsed.filter(t => t !== tool));
    if (primaryTool === tool) {
      setPrimaryTool("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const isFormValid = jobTitle && seniorityLevel && responsibilities.length > 0 && toolsUsed.length > 0 && primaryTool;

  return (
    <>
      <Helmet>
        <title>Automation Advisor | AgentYard</title>
        <meta name="description" content="Get personalized AI agent recommendations based on your role" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <ToolHeader workflowName="automation-advisor-agent" />
        
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Automation Advisor</h1>
            <p className="text-gray-500">We'll suggest 3 AI agents for your workflow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Your Role</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle" className="text-gray-600 text-sm">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Sales Development Representative"
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seniority" className="text-gray-600 text-sm">Level</Label>
                  <Select value={seniorityLevel} onValueChange={setSeniorityLevel}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {SENIORITY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Responsibilities */}
            <section className="space-y-3">
              <Label className="text-gray-600 text-sm">Core Responsibilities</Label>
              <Popover open={respOpen} onOpenChange={setRespOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-gray-200 font-normal text-gray-700"
                  >
                    {responsibilities.length > 0 
                      ? `${responsibilities.length} selected`
                      : "Select responsibilities"}
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-50" align="start">
                  <div className="max-h-64 overflow-auto">
                    {ALL_RESPONSIBILITIES.map((resp) => (
                      <button
                        key={resp}
                        type="button"
                        onClick={() => handleToggleResponsibility(resp)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          responsibilities.includes(resp) ? "bg-gray-900 border-gray-900" : "border-gray-300"
                        }`}>
                          {responsibilities.includes(resp) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {resp}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {responsibilities.map((resp) => (
                    <Badge 
                      key={resp} 
                      variant="secondary" 
                      className="bg-gray-100 text-gray-700 px-2 py-1 text-xs flex items-center gap-1.5 font-normal"
                    >
                      {resp}
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(resp)}
                        className="hover:text-gray-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </section>

            {/* Tools */}
            <section className="space-y-3">
              <Label className="text-gray-600 text-sm">Weekly Tools</Label>
              <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-gray-200 font-normal text-gray-700"
                  >
                    {toolsUsed.length > 0 
                      ? `${toolsUsed.length} selected`
                      : "Select tools"}
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-50" align="start">
                  <div className="max-h-64 overflow-auto">
                    {ALL_TOOLS.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleToggleTool(tool)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          toolsUsed.includes(tool) ? "bg-gray-900 border-gray-900" : "border-gray-300"
                        }`}>
                          {toolsUsed.includes(tool) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {tool}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {toolsUsed.map((tool) => (
                    <Badge 
                      key={tool} 
                      variant="secondary" 
                      className="bg-gray-100 text-gray-700 px-2 py-1 text-xs flex items-center gap-1.5 font-normal"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(tool)}
                        className="hover:text-gray-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {toolsUsed.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-gray-600 text-sm">Primary Tool</Label>
                  <Select value={primaryTool} onValueChange={setPrimaryTool}>
                    <SelectTrigger className="border-gray-200 max-w-xs">
                      <SelectValue placeholder="Select primary tool" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {toolsUsed.map((tool) => (
                        <SelectItem key={tool} value={tool}>
                          {tool}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </section>

            {/* Compliance */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Constraints</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600 text-sm">Requires approval workflows</Label>
                  <Switch
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600 text-sm">Involves customer data</Label>
                  <Switch
                    checked={involvesCustomerData}
                    onCheckedChange={setInvolvesCustomerData}
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
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
