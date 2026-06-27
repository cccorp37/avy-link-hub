import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_RATE = 0.03; // 3% AVYLINK commission on each sale

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
    const body = await req.json();
    const { amount, service, phone, country = "CM", currency = "XAF", type, metadata } = body;

    // Auth check - required for subscription/wallet_topup, optional for order
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData } = await supabase.auth.getUser(token);
      userId = claimsData?.user?.id || null;
    }

    // For subscription and wallet_topup, user must be authenticated
    if (["subscription", "wallet_topup"].includes(type) && !userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // For orders, determine the seller and create the order
    let walletId: string | null = null;
    let txnUserId = userId;

    if (type === "order" && metadata?.seller_profile_id) {
      // Get seller's user_id for transaction tracking
      const { data: sellerProfile } = await adminClient
        .from("profiles")
        .select("user_id")
        .eq("id", metadata.seller_profile_id)
        .single();

      if (sellerProfile) {
        txnUserId = sellerProfile.user_id;
        const { data: sellerWallet } = await adminClient
          .from("wallets")
          .select("id")
          .eq("user_id", sellerProfile.user_id)
          .single();
        walletId = sellerWallet?.id || null;
      }
    } else if (userId) {
      const { data: wallet } = await adminClient
        .from("wallets")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!wallet) {
        await adminClient.from("wallets").insert({ user_id: userId });
        const { data: newWallet } = await adminClient
          .from("wallets")
          .select("id")
          .eq("user_id", userId)
          .single();
        walletId = newWallet?.id || null;
      } else {
        walletId = wallet.id;
      }
    }

    if (!walletId || !txnUserId) {
      return new Response(JSON.stringify({ error: "Impossible de traiter le paiement" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create transaction record
    const { data: txn, error: txnError } = await adminClient
      .from("transactions")
      .insert({
        wallet_id: walletId,
        user_id: txnUserId,
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

    // Create order record if type is order
    let orderId: string | null = null;
    if (type === "order" && metadata?.item_id && metadata?.seller_profile_id) {
      const { data: orderData } = await adminClient
        .from("orders")
        .insert({
          item_id: metadata.item_id,
          seller_profile_id: metadata.seller_profile_id,
          buyer_name: metadata.buyer_name || null,
          buyer_phone: phone,
          buyer_email: metadata.buyer_email || null,
          total_amount: Math.round(amount),
          currency,
          payment_method: service,
          payment_status: "pending",
          quantity: metadata.quantity || 1,
          transaction_id: externalId,
        })
        .select()
        .single();
      orderId = orderData?.id || null;
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
      if (type === "subscription" && metadata?.plan && metadata?.profile_id && userId) {
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

        await adminClient
          .from("profiles")
          .update({ plan: metadata.plan })
          .eq("id", metadata.profile_id);
      }

      // Handle order - credit seller wallet with 7% fee deducted
      if (type === "order" && metadata?.seller_profile_id) {
        if (orderId) {
          await adminClient
            .from("orders")
            .update({
              payment_status: "paid",
              mesomb_transaction_id: result.data.transaction?.id || null,
            })
            .eq("id", orderId);
        }

        const { data: sellerProfile } = await adminClient
          .from("profiles")
          .select("user_id")
          .eq("id", metadata.seller_profile_id)
          .single();

        if (sellerProfile) {
          // The amount collected includes 7% fee. Seller gets original price (amount / 1.07)
          const sellerAmount = Math.round(amount / (1 + PLATFORM_FEE_RATE));
          const { data: sellerWallet } = await adminClient
            .from("wallets")
            .select("id, balance")
            .eq("user_id", sellerProfile.user_id)
            .single();

          if (sellerWallet) {
            await adminClient
              .from("wallets")
              .update({ balance: sellerWallet.balance + sellerAmount })
              .eq("id", sellerWallet.id);

            await adminClient.from("transactions").insert({
              wallet_id: sellerWallet.id,
              user_id: sellerProfile.user_id,
              type: "sale_credit",
              amount: sellerAmount,
              currency,
              status: "success",
              description: `Vente - ${metadata.item_name || 'Article'} (commission AvyLink 3% déduite)`,
              reference: `SALE-${orderId || externalId}`,
            });
          }

          // Decrease stock if applicable
          if (metadata.item_id) {
            const { data: item } = await adminClient
              .from("store_items")
              .select("stock")
              .eq("id", metadata.item_id)
              .single();

            if (item && item.stock !== null && item.stock > 0) {
              await adminClient
                .from("store_items")
                .update({ stock: item.stock - (metadata.quantity || 1) })
                .eq("id", metadata.item_id);
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          transaction_id: txn.id,
          order_id: orderId,
          mesomb_id: result.data.transaction?.id || null,
          message: "Paiement effectué avec succès",
          redirect_url: metadata?.redirect_url || null,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Payment failed
      await adminClient
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", txn.id);

      if (orderId) {
        await adminClient
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", orderId);
      }

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
