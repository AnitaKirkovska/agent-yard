import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Loader2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToolHeader } from "@/components/ToolHeader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import automationGenie from "@/assets/automation-genie.png";

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

const EXAMPLE_RESPONSIBILITIES = [
  // Sales
  "Prospecting and outreach",
  "Managing pipeline in CRM",
  "Following up with leads",
  "Preparing proposals",
  // Marketing
  "Content creation",
  "Social media management",
  "Campaign analytics",
  "SEO optimization",
  // Engineering
  "Code reviews",
  "Writing documentation",
  "Bug triage",
  "Sprint planning",
  // Product
  "User research",
  "Writing PRDs",
  "Roadmap planning",
  "Stakeholder updates",
  // Operations
  "Process documentation",
  "Vendor management",
  "Data entry",
  "Scheduling",
  // Customer Success
  "Customer onboarding",
  "Support ticket handling",
  "QBR preparation",
  "Churn analysis",
  // HR
  "Resume screening",
  "Interview scheduling",
  "Employee onboarding",
  // Finance
  "Invoice processing",
  "Expense reporting",
  "Financial reporting",
];

const EXAMPLE_TOOLS = [
  // Communication
  "Slack",
  "Microsoft Teams",
  "Gmail",
  "Outlook",
  "Zoom",
  // Project Management
  "Asana",
  "Jira",
  "Linear",
  "Notion",
  "Monday.com",
  "Trello",
  // CRM & Sales
  "Salesforce",
  "HubSpot",
  "Pipedrive",
  "LinkedIn",
  // Marketing
  "Google Analytics",
  "Mailchimp",
  "Figma",
  "Canva",
  // Productivity
  "Google Calendar",
  "Google Docs",
  "Google Sheets",
  "Airtable",
  // Engineering
  "GitHub",
  "VS Code",
  "Confluence",
  // Finance & HR
  "QuickBooks",
  "Workday",
  "BambooHR",
];

const AutomationAdvisor = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [seniorityLevel, setSeniorityLevel] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [toolsUsed, setToolsUsed] = useState<string[]>([]);
  const [primaryTool, setPrimaryTool] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [involvesCustomerData, setInvolvesCustomerData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [respOpen, setRespOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [customResp, setCustomResp] = useState("");
  const [customTool, setCustomTool] = useState("");

  const handleAddResponsibility = (resp: string) => {
    if (resp.trim() && !responsibilities.includes(resp.trim())) {
      setResponsibilities([...responsibilities, resp.trim()]);
    }
  };

  const handleAddTool = (tool: string) => {
    if (tool.trim() && !toolsUsed.includes(tool.trim())) {
      setToolsUsed([...toolsUsed, tool.trim()]);
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

  const isFormValid = jobTitle && seniorityLevel && responsibilities.length > 0 && toolsUsed.length > 0;

  const availableResponsibilities = EXAMPLE_RESPONSIBILITIES
    .filter(r => !responsibilities.includes(r))
    .filter(r => customResp ? r.toLowerCase().includes(customResp.toLowerCase()) : true);
  const availableTools = EXAMPLE_TOOLS
    .filter(t => !toolsUsed.includes(t))
    .filter(t => customTool ? t.toLowerCase().includes(customTool.toLowerCase()) : true);

  return (
    <>
      <Helmet>
        <title>Automation Advisor | AgentYard</title>
        <meta name="description" content="Get personalized AI agent recommendations based on your role" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <ToolHeader workflowName="automation-advisor-agent" />
        
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="mb-10 text-center">
            <img src={automationGenie} alt="Automation Genie" className="w-28 h-28 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Automation Advisor</h1>
            <p className="text-gray-500">Add your details and get 3 AI agent recs that you can build today</p>
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
                    type="button"
                    className="w-full justify-between border-gray-200 font-normal text-gray-500"
                  >
                    Add responsibilities...
                    <Plus className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-50" align="start">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        value={customResp}
                        onChange={(e) => setCustomResp(e.target.value)}
                        placeholder="Search or add custom..."
                        className="border-gray-200 text-sm h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddResponsibility(customResp);
                            setCustomResp("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => {
                          handleAddResponsibility(customResp);
                          setCustomResp("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-auto">
                    <div className="px-2 py-1.5 text-xs text-gray-400 uppercase tracking-wide">Examples</div>
                    {availableResponsibilities.map((resp) => (
                      <button
                        key={resp}
                        type="button"
                        onClick={() => handleAddResponsibility(resp)}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {resp}
                      </button>
                    ))}
                    {availableResponsibilities.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">All examples added</div>
                    )}
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
              <Label className="text-gray-600 text-sm">Tools that you use most</Label>
              <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between border-gray-200 font-normal text-gray-500"
                  >
                    Add tools...
                    <Plus className="w-4 h-4 ml-2 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white z-50" align="start">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        value={customTool}
                        onChange={(e) => setCustomTool(e.target.value)}
                        placeholder="Search or add custom..."
                        className="border-gray-200 text-sm h-8"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTool(customTool);
                            setCustomTool("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => {
                          handleAddTool(customTool);
                          setCustomTool("");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-auto">
                    <div className="px-2 py-1.5 text-xs text-gray-400 uppercase tracking-wide">Examples</div>
                    {availableTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleAddTool(tool)}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {tool}
                      </button>
                    ))}
                    {availableTools.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">All examples added</div>
                    )}
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
            </section>

            {/* Compliance */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Constraints</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600 text-sm">I want to approve LLM outputs</Label>
                  <Switch
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-600 text-sm">My processes involve customer data</Label>
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
