import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const { amount, service, phone, country = "CM", currency = "XAF" } = body;

    // Validation
    if (!amount || amount < 500) {
      return new Response(JSON.stringify({ error: "Montant minimum de retrait : 500 XAF" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!["MTN", "ORANGE"].includes(service)) {
      return new Response(JSON.stringify({ error: "Service invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!phone || !/^[0-9]{9,15}$/.test(phone)) {
      return new Response(JSON.stringify({ error: "Numéro invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check wallet balance
    const { data: wallet } = await adminClient
      .from("wallets")
      .select("id, balance")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      return new Response(JSON.stringify({ error: "Portefeuille introuvable" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (wallet.balance < amount) {
      return new Response(JSON.stringify({ error: "Solde insuffisant" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const externalId = `WD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Debit wallet first
    await adminClient
      .from("wallets")
      .update({ balance: wallet.balance - amount })
      .eq("id", wallet.id);

    // Create withdrawal transaction
    const { data: txn } = await adminClient
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: "withdrawal",
        amount: -amount,
        currency,
        status: "pending",
        reference: externalId,
        payment_method: service,
        phone_number: phone,
        description: `Retrait vers ${service} ${phone}`,
      })
      .select()
      .single();

    // Call MeSomb deposit
    const applicationKey = Deno.env.get("MESOMB_APPLICATION_KEY")!;
    const accessKey = Deno.env.get("MESOMB_ACCESS_KEY")!;
    const secretKey = Deno.env.get("MESOMB_SECRET_KEY")!;

    const response = await fetch("https://mesomb.hachther.com/en/api/v1.1/payment/deposit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MeSomb-Application": applicationKey,
        "X-MeSomb-AccessKey": accessKey,
        "X-MeSomb-SecretKey": secretKey,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        service,
        receiver: phone,
        country,
        currency,
        nonce: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        trxID: externalId,
      }),
    });

    const result = await response.json();
    console.log("MeSomb deposit response:", JSON.stringify(result));

    if (response.ok && result?.success) {
      await adminClient
        .from("transactions")
        .update({
          status: "success",
          mesomb_transaction_id: result.transaction?.id || null,
        })
        .eq("id", txn!.id);

      return new Response(
        JSON.stringify({ success: true, message: "Retrait effectué avec succès" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Refund wallet on failure
      await adminClient
        .from("wallets")
        .update({ balance: wallet.balance })
        .eq("id", wallet.id);

      await adminClient
        .from("transactions")
        .update({ status: "failed" })
        .eq("id", txn!.id);

      return new Response(
        JSON.stringify({ success: false, error: result?.message || "Retrait échoué" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Deposit error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
