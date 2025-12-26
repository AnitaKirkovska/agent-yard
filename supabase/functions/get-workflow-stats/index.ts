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

    // Step 1: Get the workflow deployment details to retrieve its UUID
    const deploymentResponse = await fetch(
      `https://api.vellum.ai/v1/workflow-deployments/${workflowDeploymentName}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": VELLUM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!deploymentResponse.ok) {
      const errorText = await deploymentResponse.text();
      console.error("Vellum deployment lookup error:", deploymentResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Vellum API error: ${deploymentResponse.status}`, details: errorText }),
        { status: deploymentResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deployment = await deploymentResponse.json();
    const deploymentId = deployment.id;
    console.log("Found deployment ID:", deploymentId);

    // Step 2: List executions using the UUID - endpoint is execution-events, not executions
    const executionsResponse = await fetch(
      `https://api.vellum.ai/v1/workflow-deployments/${deploymentId}/execution-events?limit=1`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": VELLUM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!executionsResponse.ok) {
      const errorText = await executionsResponse.text();
      console.error("Vellum executions API error:", executionsResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Vellum API error: ${executionsResponse.status}`, details: errorText }),
        { status: executionsResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await executionsResponse.json();
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
