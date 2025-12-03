import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Database not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { content, sessionId, tags, source, metadata, expiresIn } = await req.json();

    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate expiration if provided (in hours)
    let expiresAt = null;
    if (expiresIn && typeof expiresIn === "number") {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString();
    }

    // Store the memory
    const { data, error } = await supabase
      .from("memories")
      .insert({
        user_id: user.id,
        content: content.trim(),
        session_id: sessionId || null,
        tags: Array.isArray(tags) ? tags : [],
        source: source || "api",
        metadata: metadata || {},
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Failed to store memory" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      endpoint: "/memory/store",
      method: "POST",
      status_code: 200,
      response_time_ms: 0,
    });

    console.log("Memory stored:", data.id);

    return new Response(JSON.stringify({
      status: "success",
      data: {
        memory_id: data.id,
        content: data.content,
        session_id: data.session_id,
        tags: data.tags,
        source: data.source,
        created_at: data.created_at,
        expires_at: data.expires_at,
      }
    }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Memory store error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
