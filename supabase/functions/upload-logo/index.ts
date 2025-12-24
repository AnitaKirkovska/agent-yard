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

    // Fetch the Vellum logo from a reliable external source
    // Using the Vellum website's logo
    const imageUrl = "https://images.squarespace-cdn.com/content/v1/642a6b6a78f5be0a6752eb68/7a55e143-efa1-4f0b-a4c2-20b9cda4edbc/vellum-dark.png";
    
    console.log("Fetching Vellum logo from:", imageUrl);
    
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!imageResponse.ok) {
      console.error("Failed to fetch from primary source, trying fallback...");
      // Fallback: Create a simple text-based SVG logo
      const svgLogo = `<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="100" fill="white"/>
        <text x="200" y="65" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1a1a4e" text-anchor="middle">vellum</text>
      </svg>`;
      
      const { data, error } = await supabase.storage
        .from("assets")
        .upload("vellum-workflow-logo.svg", svgLogo, {
          contentType: "image/svg+xml",
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
        .getPublicUrl("vellum-workflow-logo.svg");

      console.log("SVG Logo uploaded successfully:", urlData.publicUrl);

      return new Response(
        JSON.stringify({ url: urlData.publicUrl, type: "svg" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const imageBlob = await imageResponse.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageUint8Array = new Uint8Array(imageArrayBuffer);

    console.log("Image fetched, size:", imageUint8Array.length, "bytes");

    const { data, error } = await supabase.storage
      .from("assets")
      .upload("vellum-workflow-logo.png", imageUint8Array, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("assets")
      .getPublicUrl("vellum-workflow-logo.png");

    console.log("Logo uploaded successfully:", urlData.publicUrl);

    return new Response(
      JSON.stringify({ url: urlData.publicUrl }),
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