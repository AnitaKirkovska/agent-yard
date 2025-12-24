import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try multiple sources for the Vellum logo
    const imageSources = [
      "https://cdn.prod.website-files.com/642a6b6a78f5be0a6752eb68/642a6b6a78f5be0a6752eb7d_vellum-logo.svg",
      "https://vellum.ai/images/vellum-logo.png",
      "https://avatars.githubusercontent.com/u/115021304?s=200&v=4", // Vellum GitHub avatar
    ];

    let imageData: Uint8Array | null = null;
    let contentType = "image/png";

    for (const url of imageSources) {
      try {
        console.log("Trying to fetch logo from:", url);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          imageData = new Uint8Array(arrayBuffer);
          contentType = response.headers.get("content-type") || "image/png";
          console.log("Successfully fetched from:", url, "Size:", imageData.length, "bytes");
          break;
        }
      } catch (e) {
        console.log("Failed to fetch from:", url, e);
        continue;
      }
    }

    if (!imageData) {
      // Create a simple placeholder PNG if all sources fail
      // This is a minimal valid PNG (1x1 pixel, navy blue)
      console.log("All sources failed, creating placeholder...");
      const placeholder = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
        0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x18, 0x05, 0xA3, 0x60,
        0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00,
        0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ]);
      imageData = placeholder;
    }

    const { data, error } = await supabase.storage
      .from("assets")
      .upload("vellum-workflow-logo.png", imageData, {
        contentType: contentType.includes("svg") ? "image/png" : contentType,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: urlData } = supabase.storage
      .from("assets")
      .getPublicUrl("vellum-workflow-logo.png");

    console.log("Logo uploaded successfully:", urlData.publicUrl);

    return new Response(
      JSON.stringify({ url: urlData.publicUrl, size: imageData.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});