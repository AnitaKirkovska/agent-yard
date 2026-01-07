import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      job_title, 
      seniority_level, 
      core_responsibilities, 
      tools_used_weekly,
      requires_approval,
      involves_customer_data
    } = await req.json();

    const VELLUM_API_KEY = Deno.env.get("VELLUM_API_KEY");
    if (!VELLUM_API_KEY) {
      throw new Error("VELLUM_API_KEY is not configured");
    }

    console.log("Calling Vellum workflow with:", { 
      job_title, 
      seniority_level, 
      core_responsibilities, 
      tools_used_weekly 
    });

    const response = await fetch("https://predict.vellum.ai/v1/execute-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": VELLUM_API_KEY,
      },
      body: JSON.stringify({
        workflow_deployment_name: "personal-automation-advisor",
        release_tag: "LATEST",
        inputs: [
          {
            type: "STRING",
            name: "job_title",
            value: job_title,
          },
          {
            type: "STRING",
            name: "seniority_level",
            value: seniority_level,
          },
          {
            type: "JSON",
            name: "core_responsibilities",
            value: core_responsibilities,
          },
          {
            type: "JSON",
            name: "tools_used_weekly",
            value: tools_used_weekly,
          },
          {
            type: "STRING",
            name: "primary_tool",
            value: tools_used_weekly[0] || "",
          },
          {
            type: "JSON",
            name: "requires_approval",
            value: { value: requires_approval },
          },
          {
            type: "JSON",
            name: "involves_customer_data",
            value: { value: involves_customer_data },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vellum API error:", response.status, errorText);
      throw new Error(`Vellum API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Vellum response:", JSON.stringify(data, null, 2));

    // Extract the ideas from the workflow output
    let ideas = [];
    if (data.data?.outputs && Array.isArray(data.data.outputs)) {
      for (const output of data.data.outputs) {
        if (output.name === "recommendations" && output.type === "JSON") {
          ideas = output.value?.ideas || [];
          break;
        }
      }
    }

    return new Response(JSON.stringify({ ideas }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in automation-advisor:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
