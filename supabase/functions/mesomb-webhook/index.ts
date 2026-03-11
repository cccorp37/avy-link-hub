import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-mesomb-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const webhookData = JSON.parse(body);

    console.log("MeSomb webhook received:", body);

    // Validate signature
    const signature = req.headers.get("x-mesomb-signature");
    const secretKey = Deno.env.get("MESOMB_SECRET_KEY");

    if (signature && secretKey) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secretKey),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
      const expected = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (signature !== expected) {
        console.warn("Invalid webhook signature");
        // Still return 200 to avoid retries
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find transaction by reference
    const reference = webhookData.external_id || webhookData.trxID;
    if (reference) {
      const { data: txn } = await adminClient
        .from("transactions")
        .select("*")
        .eq("reference", reference)
        .single();

      if (txn) {
        const newStatus = webhookData.status === "SUCCESS" ? "success" : 
                         webhookData.status === "FAILED" ? "failed" : txn.status;

        await adminClient
          .from("transactions")
          .update({
            status: newStatus,
            mesomb_transaction_id: webhookData.transaction_id || txn.mesomb_transaction_id,
          })
          .eq("id", txn.id);

        // If withdrawal failed, refund wallet
        if (newStatus === "failed" && txn.type === "withdrawal") {
          const { data: wallet } = await adminClient
            .from("wallets")
            .select("id, balance")
            .eq("id", txn.wallet_id)
            .single();

          if (wallet) {
            await adminClient
              .from("wallets")
              .update({ balance: wallet.balance + Math.abs(txn.amount) })
              .eq("id", wallet.id);
          }
        }
      }
    }

    // Always respond 200 quickly
    return new Response(JSON.stringify({ received: true, success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always 200 for webhooks
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
