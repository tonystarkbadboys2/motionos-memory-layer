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

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const { sessionId, memoryId } = body;

    let deletedCount = 0;

    if (memoryId) {
      // Delete specific memory
      const { error } = await supabase
        .from("memories")
        .delete()
        .eq("id", memoryId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete memory" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      deletedCount = 1;
    } else if (sessionId) {
      // Delete all memories for session
      const { data, error } = await supabase
        .from("memories")
        .delete()
        .eq("session_id", sessionId)
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: "Failed to clear session memories" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      deletedCount = data?.length || 0;
    } else {
      // Delete ALL user memories
      const { data, error } = await supabase
        .from("memories")
        .delete()
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: "Failed to clear memories" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      deletedCount = data?.length || 0;
    }

    // Log usage
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      endpoint: "/memory/clear",
      method: "DELETE",
      status_code: 200,
      response_time_ms: 0,
    });

    console.log("Cleared memories:", deletedCount);

    return new Response(JSON.stringify({
      status: "success",
      data: {
        deleted_count: deletedCount,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Memory clear error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
