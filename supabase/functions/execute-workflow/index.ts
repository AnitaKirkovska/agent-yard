import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowInput {
  type: string;
  name: string;
  value: string;
}

interface ExecuteWorkflowRequest {
  workflowDeploymentName: string;
  releaseTag?: string;
  inputs: WorkflowInput[];
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

    const body: ExecuteWorkflowRequest = await req.json();
    console.log("Executing workflow:", body.workflowDeploymentName);
    console.log("Inputs:", JSON.stringify(body.inputs, null, 2));

    const response = await fetch("https://predict.vellum.ai/v1/execute-workflow", {
      method: "POST",
      headers: {
        "X-API-KEY": VELLUM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_deployment_name: body.workflowDeploymentName,
        release_tag: body.releaseTag || "LATEST",
        inputs: body.inputs,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vellum API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Vellum API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    console.log("Workflow result state:", result.data?.state);
    console.log("Workflow outputs:", JSON.stringify(result.data?.outputs, null, 2));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error executing workflow:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
