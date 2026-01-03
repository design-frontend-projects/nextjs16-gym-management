// supabase/functions/send-renewal-reminders/index.ts
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
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Fetch memberships expiring soon (e.g., in 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const dateStr = threeDaysFromNow.toISOString().split("T")[0];

    const { data: expiringSubscriptions, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*, members(email, first_name)")
      .eq("end_date", dateStr)
      .eq("status", "active");

    if (fetchError) throw fetchError;

    const logs = [];

    // 2. Mock sending emails
    for (const sub of expiringSubscriptions || []) {
      const email = sub.members.email;
      const name = sub.members.first_name;

      console.log(
        `Sending renewal reminder to ${email} for plan ${sub.plan_id}`
      );

      // Mock email sending logic here...
      // await sendEmail(...)

      // 3. Log to email_logs
      logs.push({
        member_id: sub.member_id,
        email_type: "renewal_reminder",
        sent_at: new Date().toISOString(),
        status: "sent",
        subject: "Membership Renewal Reminder",
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
        message: `Sent ${logs.length} renewal reminders`,
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
