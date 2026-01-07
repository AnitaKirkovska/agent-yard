import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

          <form onSubmit={handleSubmit} className="space-y-8">
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
                    <SelectContent>
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
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Core Responsibilities</h2>
              <div className="flex flex-wrap gap-2">
                {responsibilities.map((resp) => (
                  <Badge 
                    key={resp} 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 text-sm flex items-center gap-2 font-normal"
                  >
                    {resp}
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(resp)}
                      className="hover:text-gray-900 transition-colors"
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
                  placeholder="Add responsibility..."
                  className="border-gray-200"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddResponsibility())}
                />
                <Button 
                  type="button" 
                  onClick={handleAddResponsibility}
                  variant="outline"
                  className="border-gray-200"
                >
                  Add
                </Button>
              </div>
            </section>

            {/* Tools */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Weekly Tools</h2>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleToggleTool(tool)}
                    className={`px-3 py-1.5 rounded-md border text-sm transition-all ${
                      toolsUsed.includes(tool)
                        ? "bg-gray-900 border-gray-900 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>

              {toolsUsed.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-gray-600 text-sm">Primary Tool</Label>
                  <Select value={primaryTool} onValueChange={setPrimaryTool}>
                    <SelectTrigger className="border-gray-200 max-w-xs">
                      <SelectValue placeholder="Select primary tool" />
                    </SelectTrigger>
                    <SelectContent>
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
              <div className="space-y-4">
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
