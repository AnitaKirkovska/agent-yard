import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowRequest {
  workflowDeploymentName: string;
  releaseTag?: string;
  inputs: Array<{ type: string; name: string; value: string }>;
}

interface SwagOrderRequest {
  recipientName: string;
  address1: string;
  city: string;
  stateCode: string;
  countryCode: string;
  zipCode: string;
  hobby: string;
  logoUrl?: string;
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

    const body = await req.json();
    
    // Check if this is a direct workflow request (has workflowDeploymentName and inputs array)
    // or a legacy swag order request
    let workflowName: string;
    let releaseTag: string;
    let inputs: Array<{ type: string; name: string; value: string }>;

    if (body.workflowDeploymentName && body.inputs) {
      // Direct workflow request format
      const workflowRequest = body as WorkflowRequest;
      workflowName = workflowRequest.workflowDeploymentName;
      releaseTag = workflowRequest.releaseTag || "LATEST";
      inputs = workflowRequest.inputs;
      console.log("Direct workflow request for:", workflowName);
    } else {
      // Legacy swag order format
      const swagOrder = body as SwagOrderRequest;
      workflowName = "printful-printing-agent";
      releaseTag = "LATEST";
      
      // Build inputs array with all required fields including logo
      const workflowInputs: Array<{ type: string; name: string; value: string | { src: string } }> = [
        { type: "STRING", name: "recipient_name", value: swagOrder.recipientName },
        { type: "STRING", name: "address1", value: swagOrder.address1 },
        { type: "STRING", name: "city", value: swagOrder.city },
        { type: "STRING", name: "state_code", value: swagOrder.stateCode || "" },
        { type: "STRING", name: "country_code", value: swagOrder.countryCode },
        { type: "STRING", name: "zip_code", value: swagOrder.zipCode },
        { type: "STRING", name: "hobby", value: swagOrder.hobby },
      ];
      
      // Add logo if provided, otherwise use default placeholder
      if (swagOrder.logoUrl) {
        workflowInputs.push({ type: "IMAGE", name: "logo", value: { src: swagOrder.logoUrl } });
      } else {
        // Use a default placeholder logo
        workflowInputs.push({ type: "IMAGE", name: "logo", value: { src: "https://bicorrclgguttsgwxksi.supabase.co/storage/v1/object/public/assets/cat-logo.png" } });
      }
      
      inputs = workflowInputs as Array<{ type: string; name: string; value: string }>;
      console.log("Legacy swag order for:", swagOrder.recipientName);
    }

    console.log("Calling Vellum workflow:", workflowName);
    console.log("Inputs:", JSON.stringify(inputs, null, 2));

    const response = await fetch("https://predict.vellum.ai/v1/execute-workflow", {
      method: "POST",
      headers: {
        "X-API-KEY": VELLUM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_deployment_name: workflowName,
        release_tag: releaseTag,
        inputs,
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
