// MeSomb webhook — idempotent processing of payment / failure / refund events.
// All write side-effects go through webhook_events (unique provider+event_id)
// so the same notification can be safely retried without double-crediting,
// double-refunding, or double-debiting a wallet.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-mesomb-signature",
};

const PROVIDER = "mesomb";

function ok(body: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ received: true, ...body }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySignature(rawBody: string, signature: string | null) {
  const secretKey = Deno.env.get("MESOMB_SECRET_KEY");
  if (!signature || !secretKey) return true; // skip when not configured
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return signature === expected;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const raw = await req.text();
    const data = JSON.parse(raw || "{}");
    console.log("MeSomb webhook payload:", raw);

    const validSig = await verifySignature(raw, req.headers.get("x-mesomb-signature"));
    if (!validSig) {
      console.warn("Invalid webhook signature — ignoring");
      return ok({ ignored: "invalid_signature" });
    }

    // Normalize fields across MeSomb payload variants
    const reference: string | null =
      data.external_id || data.trxID || data.reference || null;
    const mesombTxnId: string | null =
      data.transaction_id || data.transaction?.id || data.transaction?.pk || null;
    const rawStatus: string = (data.status || data.transaction?.status || "").toUpperCase();
    const eventType: string =
      (data.event || data.type || (
        rawStatus === "SUCCESS" ? "payment.succeeded" :
        rawStatus === "FAILED"  ? "payment.failed"    :
        rawStatus === "REFUNDED" ? "payment.refunded" :
        "payment.unknown"
      )).toLowerCase();

    // Idempotency key — fall back to a deterministic hash when provider gives nothing
    const eventId: string =
      data.event_id || data.id || mesombTxnId || (reference ? `${reference}:${eventType}` : null);

    if (!eventId) {
      console.warn("Webhook missing event id — dropping");
      return ok({ ignored: "no_event_id" });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Atomic dedup: insert returns conflict if we have already processed this event
    const { error: dedupError } = await admin
      .from("webhook_events")
      .insert({
        provider: PROVIDER,
        event_id: eventId,
        event_type: eventType,
        reference,
        payload: data,
      });

    if (dedupError) {
      const msg = String(dedupError.message || "");
      if (msg.includes("duplicate") || msg.includes("unique") || dedupError.code === "23505") {
        console.log(`Event ${eventId} already processed — skipping`);
        return ok({ duplicate: true });
      }
      console.error("webhook_events insert error:", dedupError);
      return ok({ error: "log_failed" });
    }

    if (!reference) {
      await admin.from("webhook_events").update({ result: "no_reference" })
        .eq("provider", PROVIDER).eq("event_id", eventId);
      return ok({ ignored: "no_reference" });
    }

    // Find the originating transaction
    const { data: txn } = await admin
      .from("transactions")
      .select("*")
      .eq("reference", reference)
      .maybeSingle();

    if (!txn) {
      await admin.from("webhook_events").update({ result: "txn_not_found" })
        .eq("provider", PROVIDER).eq("event_id", eventId);
      return ok({ ignored: "txn_not_found" });
    }

    // Guard: ignore if the transaction is already in a final state matching this event
    const isSuccess = eventType.includes("succeed") || rawStatus === "SUCCESS";
    const isFailed  = eventType.includes("fail")    || rawStatus === "FAILED";
    const isRefund  = eventType.includes("refund")  || rawStatus === "REFUNDED";

    let resultTag = "noop";

    if (isSuccess && txn.status !== "success") {
      await admin.from("transactions").update({
        status: "success",
        mesomb_transaction_id: mesombTxnId ?? txn.mesomb_transaction_id,
        processed_at: new Date().toISOString(),
        provider_event_id: eventId,
      }).eq("id", txn.id);

      // Mark related order paid (if any)
      await admin.from("orders").update({
        payment_status: "paid",
        mesomb_transaction_id: mesombTxnId,
      }).eq("transaction_id", reference);

      resultTag = "marked_success";
    } else if (isFailed && txn.status !== "failed") {
      await admin.from("transactions").update({
        status: "failed",
        failure_reason: data.message || data.detail || rawStatus,
        processed_at: new Date().toISOString(),
        provider_event_id: eventId,
      }).eq("id", txn.id);

      // Refund the wallet on failed withdrawal (transactions store negative amount)
      if (txn.type === "withdrawal" && txn.amount < 0) {
        const { data: wallet } = await admin
          .from("wallets").select("id, balance").eq("id", txn.wallet_id).maybeSingle();
        if (wallet) {
          await admin.from("wallets")
            .update({ balance: wallet.balance + Math.abs(txn.amount) })
            .eq("id", wallet.id);
        }
      }

      await admin.from("orders").update({
        payment_status: "failed",
        failure_reason: data.message || data.detail || rawStatus,
      }).eq("transaction_id", reference);

      resultTag = "marked_failed";
    } else if (isRefund && txn.status !== "refunded") {
      // Reverse a previously successful payment
      await admin.from("transactions").update({
        status: "refunded",
        processed_at: new Date().toISOString(),
        provider_event_id: eventId,
      }).eq("id", txn.id);

      if (txn.type === "sale_credit" && txn.amount > 0) {
        const { data: wallet } = await admin
          .from("wallets").select("id, balance").eq("id", txn.wallet_id).maybeSingle();
        if (wallet) {
          await admin.from("wallets")
            .update({ balance: Math.max(0, wallet.balance - txn.amount) })
            .eq("id", wallet.id);
        }
      }

      await admin.from("orders").update({
        payment_status: "refunded",
        refund_status: "completed",
        refunded_at: new Date().toISOString(),
      }).eq("transaction_id", reference);

      resultTag = "marked_refunded";
    }

    await admin.from("webhook_events")
      .update({ result: resultTag })
      .eq("provider", PROVIDER).eq("event_id", eventId);

    return ok({ result: resultTag });
  } catch (err) {
    console.error("Webhook error:", err);
    // Always 200 — never trigger retries we can't dedup safely
    return ok({ error: "internal" });
  }
});
