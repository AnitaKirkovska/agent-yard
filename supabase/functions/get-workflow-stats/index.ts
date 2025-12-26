import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowStatsRequest {
  workflowDeploymentName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VELLUM_API_KEY = Deno.env.get("VELLUM_API_KEY");
    if (!VELLUM_API_KEY) {
      console.error("VELLUM_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "VELLUM_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json() as WorkflowStatsRequest;
    const { workflowDeploymentName } = body;

    if (!workflowDeploymentName) {
      return new Response(
        JSON.stringify({ error: "workflowDeploymentName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching stats for workflow:", workflowDeploymentName);

    // Call Vellum API to list workflow executions - we just need the count
    const response = await fetch(
      `https://api.vellum.ai/v1/workflow-deployments/${workflowDeploymentName}/executions?limit=1`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": VELLUM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vellum API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Vellum API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    console.log("Workflow stats result:", { count: result.count });

    return new Response(
      JSON.stringify({ count: result.count || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching workflow stats:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
