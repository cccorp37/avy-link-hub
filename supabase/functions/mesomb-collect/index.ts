import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateNonce() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function mesombCollect(params: {
  amount: number;
  service: string;
  payer: string;
  country: string;
  currency: string;
  nonce: string;
  trxID: string;
}) {
  const applicationKey = Deno.env.get("MESOMB_APPLICATION_KEY")!;
  const accessKey = Deno.env.get("MESOMB_ACCESS_KEY")!;
  const secretKey = Deno.env.get("MESOMB_SECRET_KEY")!;

  const url = "https://mesomb.hachther.com/en/api/v1.1/payment/collect/";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MeSomb-Application": applicationKey,
      "X-MeSomb-AccessKey": accessKey,
      "X-MeSomb-SecretKey": secretKey,
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.user.id;

    const body = await req.json();
    const { amount, service, phone, country = "CM", currency = "XAF", type, metadata } = body;

    // Validation
    if (!amount || amount <= 0 || amount > 5000000) {
      return new Response(JSON.stringify({ error: "Montant invalide (1 - 5 000 000)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["MTN", "ORANGE"].includes(service)) {
      return new Response(JSON.stringify({ error: "Service invalide (MTN ou ORANGE)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!phone || !/^[0-9]{9,15}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Numéro de téléphone invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["subscription", "order", "wallet_topup"].includes(type)) {
      return new Response(JSON.stringify({ error: "Type de transaction invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const externalId = `AVY-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Use service role for wallet/transaction operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Ensure wallet exists
    const { data: wallet } = await adminClient
      .from("wallets")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      await adminClient.from("wallets").insert({ user_id: userId });
    }

    const { data: walletData } = await adminClient
      .from("wallets")
      .select("id")
      .eq("user_id", userId)
      .single();

    // Create transaction record
    const { data: txn, error: txnError } = await adminClient
      .from("transactions")
      .insert({
        wallet_id: walletData!.id,
        user_id: userId,
        type,
        amount: Math.round(amount),
        currency,
        status: "pending",
        reference: externalId,
        payment_method: service,
        phone_number: phone,
        description: metadata?.description || `Paiement ${type}`,
      })
      .select()
      .single();

    if (txnError) {
      console.error("Transaction insert error:", txnError);
      return new Response(JSON.stringify({ error: "Erreur lors de la création de la transaction" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call MeSomb
    const nonce = generateNonce();
    const result = await mesombCollect({
      amount: Math.round(amount),
      service,
      payer: phone,
      country,
      currency,
      nonce,
      trxID: externalId,
    });

    console.log("MeSomb response:", JSON.stringify(result));

    if (result.ok && result.data?.success) {
      // Update transaction as successful
      await adminClient
        .from("transactions")
        .update({
          status: "success",
          mesomb_transaction_id: result.data.transaction?.id || result.data.transaction?.pk || null,
        })
        .eq("id", txn.id);

      // Handle subscription
      if (type === "subscription" && metadata?.plan && metadata?.profile_id) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (metadata.billing_cycle === "yearly" ? 12 : 1));

        await adminClient.from("subscriptions").insert({
          user_id: userId,
          profile_id: metadata.profile_id,
          plan: metadata.plan,
          status: "active",
          amount: Math.round(amount),
          currency,
          payment_method: service,
          transaction_id: txn.id,
          expires_at: expiresAt.toISOString(),
        });

        // Update profile plan
        await adminClient
          .from("profiles")
          .update({ plan: metadata.plan })
          .eq("id", metadata.profile_id);
      }

      // Handle order
      if (type === "order" && metadata?.order_id) {
        await adminClient
          .from("orders")
          .update({
            payment_status: "paid",
            mesomb_transaction_id: result.data.transaction?.id || null,
          })
          .eq("id", metadata.order_id);

        // Credit seller wallet
        const { data: order } = await adminClient
          .from("orders")
          .select("seller_profile_id, total_amount")
          .eq("id", metadata.order_id)
          .single();

        if (order) {
          const { data: sellerProfile } = await adminClient
            .from("profiles")
            .select("user_id")
            .eq("id", order.seller_profile_id)
            .single();

          if (sellerProfile) {
            // Platform fee: 5%
            const netAmount = Math.round(order.total_amount * 0.95);
            const { data: sellerWallet } = await adminClient
              .from("wallets")
              .select("id, balance")
              .eq("user_id", sellerProfile.user_id)
              .single();

            if (sellerWallet) {
              await adminClient
                .from("wallets")
                .update({ balance: sellerWallet.balance + netAmount })
                .eq("id", sellerWallet.id);

              await adminClient.from("transactions").insert({
                wallet_id: sellerWallet.id,
                user_id: sellerProfile.user_id,
                type: "sale_credit",
                amount: netAmount,
                currency,
                status: "success",
                description: `Vente article - Commission 5% déduite`,
                reference: `SALE-${metadata.order_id}`,
              });
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: txn.id,
          mesomb_id: result.data.transaction?.id || null,
          message: "Paiement effectué avec succès",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Payment failed
      await adminClient
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", txn.id);

      return new Response(
        JSON.stringify({
          success: false,
          error: result.data?.message || result.data?.detail || "Le paiement a échoué",
          code: result.data?.code || "PAYMENT_FAILED",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
