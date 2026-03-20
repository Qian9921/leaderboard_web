import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { resolveDeleteSubmissionFunctionConfig } from "../../../lib/delete-submission-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const config = resolveDeleteSubmissionFunctionConfig((name) =>
      Deno.env.get(name)
    );

    if (!config) {
      return new Response(
        JSON.stringify({ error: "Server not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { leaderboard_type, group_name, delete_key } = body ?? {};

    if (!leaderboard_type || !group_name || !delete_key) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (delete_key !== config.deleteKey) {
      return new Response(
        JSON.stringify({ error: "Invalid delete key." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(config.supabaseUrl, config.serviceRoleKey);

    const { table, datasetKey } = resolveTable(leaderboard_type);
    let query = supabase.from(table).delete().eq("group_name", group_name);
    if (datasetKey) {
      query = query.eq("dataset_key", datasetKey);
    }
    const { error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function resolveTable(leaderboardType: string): {
  table: string;
  datasetKey?: string;
} {
  if (leaderboardType === "unet") {
    return { table: "unet_submissions" };
  }

  if (leaderboardType === "orbslam3") {
    return { table: "orbslam3_submissions", datasetKey: "AMtown02" };
  }

  if (leaderboardType.startsWith("orbslam3:")) {
    return {
      table: "orbslam3_submissions",
      datasetKey: leaderboardType.slice("orbslam3:".length),
    };
  }

  throw new Error(`Unknown leaderboard type: ${leaderboardType}`);
}
