import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkflowStatsRequest {
  workflowDeploymentName: string;
  forceRefresh?: boolean;
}

const CACHE_DURATION_HOURS = 24;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VELLUM_API_KEY = Deno.env.get("VELLUM_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!VELLUM_API_KEY) {
      console.error("VELLUM_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "VELLUM_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase credentials not configured");
      return new Response(
        JSON.stringify({ error: "Supabase credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json() as WorkflowStatsRequest;
    const { workflowDeploymentName, forceRefresh = false } = body;

    if (!workflowDeploymentName) {
      return new Response(
        JSON.stringify({ error: "workflowDeploymentName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching stats for workflow:", workflowDeploymentName, "forceRefresh:", forceRefresh);

    // Check cache first (unless forceRefresh is true)
    if (!forceRefresh) {
      const { data: cached, error: cacheError } = await supabase
        .from("workflow_stats_cache")
        .select("execution_count, cached_at")
        .eq("workflow_name", workflowDeploymentName)
        .maybeSingle();

      if (cacheError) {
        console.error("Cache lookup error:", cacheError);
      } else if (cached) {
        const cachedAt = new Date(cached.cached_at);
        const now = new Date();
        const hoursSinceCached = (now.getTime() - cachedAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCached < CACHE_DURATION_HOURS) {
          console.log("Returning cached count:", cached.execution_count, "cached", hoursSinceCached.toFixed(1), "hours ago");
          return new Response(
            JSON.stringify({ count: cached.execution_count, cached: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        console.log("Cache expired, refreshing from Vellum API");
      }
    }

    // Fetch fresh data from Vellum API
    console.log("Fetching fresh stats from Vellum API for:", workflowDeploymentName);

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

    // Step 2: List executions using the UUID
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
    const count = result.count || 0;
    console.log("Fresh workflow stats:", { count });

    // Update cache
    const { error: upsertError } = await supabase
      .from("workflow_stats_cache")
      .upsert(
        {
          workflow_name: workflowDeploymentName,
          execution_count: count,
          cached_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workflow_name" }
      );

    if (upsertError) {
      console.error("Failed to update cache:", upsertError);
    } else {
      console.log("Cache updated successfully for:", workflowDeploymentName);
    }

    return new Response(
      JSON.stringify({ count, cached: false }),
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
