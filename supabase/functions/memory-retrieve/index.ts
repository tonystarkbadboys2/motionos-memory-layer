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

    // Parse query params
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");
    const tag = url.searchParams.get("tag");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("memories")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Failed to retrieve memories" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate current strength for each memory
    const memoriesWithStrength = data?.map(memory => {
      const ageHours = (Date.now() - new Date(memory.created_at).getTime()) / (1000 * 60 * 60);
      const currentStrength = Math.max(0, memory.strength - (memory.decay_rate * ageHours));
      return {
        memory_id: memory.id,
        content: memory.content,
        session_id: memory.session_id,
        tags: memory.tags,
        source: memory.source,
        metadata: memory.metadata,
        strength: Math.round(currentStrength * 100) / 100,
        created_at: memory.created_at,
        expires_at: memory.expires_at,
      };
    }) || [];

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      endpoint: "/memory/retrieve",
      method: "GET",
      status_code: 200,
      response_time_ms: 0,
    });

    return new Response(JSON.stringify({
      status: "success",
      data: memoriesWithStrength,
      pagination: {
        total: count,
        limit,
        offset,
        has_more: (offset + limit) < (count || 0),
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Memory retrieve error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
