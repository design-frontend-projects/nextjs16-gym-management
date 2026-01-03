// supabase/functions/send-session-reminders/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("NEXT_PUBLICNEXT_PUBLIC_SUPABASE_URL") ?? "",
      Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? ""
    );

    // 1. Fetch sessions for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const { data: sessions, error: fetchError } = await supabase
      .from("sessions")
      .select("*, members(email, first_name), coaches(first_name)")
      .eq("session_date", dateStr)
      .eq("status", "scheduled");

    if (fetchError) throw fetchError;

    const logs = [];

    // 2. Mock sending emails
    for (const session of sessions || []) {
      const email = session.members.email;

      console.log(
        `Sending session reminder to ${email} for session tomorrow at ${session.session_time}`
      );

      // Mock email sending logic...

      logs.push({
        member_id: session.member_id,
        email_type: "session_reminder",
        sent_at: new Date().toISOString(),
        status: "sent",
        subject: "Upcoming Session Reminder",
        recipient: email,
      });
    }

    if (logs.length > 0) {
      const { error: logError } = await supabase
        .from("email_logs")
        .insert(logs);
      if (logError) throw logError;
    }

    return new Response(
      JSON.stringify({
        message: `Sent ${logs.length} session reminders`,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
