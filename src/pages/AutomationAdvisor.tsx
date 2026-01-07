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
  "Cold calling",
  "Demo scheduling",
  "Contract negotiations",
  "Account research",
  "Competitive analysis",
  "Sales forecasting",
  // Marketing
  "Content creation",
  "Social media management",
  "Campaign analytics",
  "SEO optimization",
  "Email marketing",
  "Ad campaign management",
  "Landing page creation",
  "Influencer outreach",
  "Event planning",
  "Brand monitoring",
  "Lead nurturing",
  "Marketing reporting",
  // Operations
  "Process documentation",
  "Vendor management",
  "Data entry",
  "Scheduling",
  "Inventory management",
  "Quality assurance",
  "Compliance tracking",
  "Resource allocation",
  "Meeting coordination",
  "Travel booking",
  // Product
  "User research",
  "Writing PRDs",
  "Roadmap planning",
  "Stakeholder updates",
  "Feature prioritization",
  "Competitor tracking",
  "Beta testing coordination",
  "Release notes",
  "Customer feedback analysis",
  "A/B test planning",
  // Customer Support
  "Support ticket handling",
  "Customer onboarding",
  "QBR preparation",
  "Churn analysis",
  "Knowledge base updates",
  "Customer health scoring",
  "Escalation management",
  "CSAT surveys",
  "Bug reporting",
  "Feature request tracking",
  // Founders
  "Investor updates",
  "Board deck preparation",
  "Hiring and recruiting",
  "Strategic planning",
  "Partnership outreach",
  "Fundraising research",
  "KPI tracking",
  "Team 1:1s",
  "OKR management",
  "All-hands preparation",
  // Finance
  "Invoice processing",
  "Expense reporting",
  "Financial reporting",
  "Budget tracking",
  "Payroll processing",
  "Accounts receivable",
  "Accounts payable",
  "Tax preparation",
  "Audit preparation",
  "Cash flow forecasting",
];

const EXAMPLE_TOOLS = [
  // A
  "AccuLynx",
  "Active Campaign",
  "Affinity",
  "AgencyZoom",
  "Ahrefs",
  "Airtable",
  "Apollo",
  "Asana",
  "Atlassian",
  // B
  "Bitbucket",
  "Box",
  "Brevo",
  "Brex",
  "Browserbase Tool",
  // C
  "Cal",
  "Calendly",
  "Canva",
  "Canvas",
  "ClickUp",
  "Coda",
  "Coinbase",
  "Confluence",
  "Customer.io",
  // D
  "Discord",
  "DocuSign",
  "Dropbox",
  // E
  "ElevenLabs",
  "Eventbrite",
  "Exa",
  // F
  "Facebook",
  "Figma",
  "Firecrawl",
  "Fireflies",
  // G
  "Gamma",
  "GitHub",
  "GitLab",
  "Gmail",
  "Gong",
  "Google",
  "Google Ads",
  "Google Analytics",
  "Google Calendar",
  "Google Docs",
  "Google Drive",
  "Google Maps",
  "Google Photos",
  "Google Search Console",
  "Google Sheets",
  "Google Slides",
  "Google Tasks",
  // H
  "HeyGen",
  "HeyReach",
  "HubSpot",
  // I
  "Instagram",
  "Intercom",
  // J
  "Jira",
  "Jungle Scout",
  // K
  "Klaviyo",
  // L
  "Linear",
  "LinkedIn",
  "Linkup",
  "Listen Notes",
  "LMNT",
  // M
  "Mailchimp",
  "Mem0",
  "Microsoft Teams",
  "Miro",
  "Monday",
  // N
  "Neon",
  "Notion",
  // O
  "Outlook",
  // P
  "PagerDuty",
  "Parsera",
  "People Data Labs",
  "Perplexity",
  "PostHog",
  "Productboard",
  // R
  "Reddit",
  // S
  "Salesforce",
  "Segment",
  "Semantic Scholar",
  "Semrush",
  "SendGrid",
  "Serp Api",
  "SharePoint",
  "Shopify",
  "Shortcut",
  "Slack",
  "Spotify",
  "Stripe",
  "Supabase",
  // T
  "Tavily",
  "Telegram",
  "Todoist",
  "Trello",
  // W
  "Webflow",
  "WhatsApp",
  // Y
  "You Search",
  // Z
  "Zendesk",
  "ZenRows",
  "Zoom",
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
              {responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {responsibilities.map((resp) => (
                    <Badge 
                      key={resp} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-700 px-2 py-1 text-xs flex items-center gap-1.5 font-normal hover:bg-blue-600 hover:text-white transition-colors cursor-default"
                    >
                      {resp}
                      <button
                        type="button"
                        onClick={() => handleRemoveResponsibility(resp)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <Popover open={respOpen} onOpenChange={setRespOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between border-gray-200 font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-600"
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
            </section>

            {/* Tools */}
            <section className="space-y-3">
              <Label className="text-gray-600 text-sm">Tools that you use most</Label>
              {toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {toolsUsed.map((tool) => (
                    <Badge 
                      key={tool} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-700 px-2 py-1 text-xs flex items-center gap-1.5 font-normal hover:bg-blue-600 hover:text-white transition-colors cursor-default"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(tool)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-between border-gray-200 font-normal text-gray-500 hover:bg-gray-50 hover:text-gray-600"
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
