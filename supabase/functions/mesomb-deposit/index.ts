import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WITHDRAWAL_FEE_RATE = 0.065; // 6.5% AVYLINK withdrawal fee

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
    const { amount, service, phone, country = "CM", currency = "XAF", recipient_name } = body;

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
    if (!recipient_name || recipient_name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Nom du destinataire requis" }), {
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

    // Calculate fees
    const feeAmount = Math.round(amount * WITHDRAWAL_FEE_RATE);
    const netAmount = amount - feeAmount;

    const externalId = `WD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Debit wallet (full amount including fees)
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
        description: `Retrait ${amount.toLocaleString()} ${currency} vers ${service} ${phone} (frais 6,5%: ${feeAmount} ${currency}, net: ${netAmount} ${currency})`,
      })
      .select()
      .single();

    // Get user profile info for notifications
    const { data: userProfile } = await adminClient
      .from("profiles")
      .select("username, display_name")
      .eq("user_id", userId)
      .single();

    // Call MeSomb deposit - send NET amount (after fee deduction) to user
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
        amount: netAmount,
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

    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    if (response.ok && result?.success) {
      await adminClient
        .from("transactions")
        .update({
          status: "success",
          mesomb_transaction_id: result.transaction?.id || null,
        })
        .eq("id", txn!.id);

      // Create admin withdrawal notification
      await adminClient.from("withdrawal_notifications").insert({
        user_id: userId,
        username: userProfile?.username || "N/A",
        display_name: userProfile?.display_name || "N/A",
        amount,
        fee_amount: feeAmount,
        net_amount: netAmount,
        currency,
        recipient_name: recipient_name,
        recipient_phone: phone,
        recipient_service: service,
        status: "success",
      });

      // Send email notification to admin
      try {
        const emailBody = `
          <h2>🔔 Notification de Retrait AVYLINK</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;font-family:sans-serif;">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Utilisateur</td><td style="padding:8px;border:1px solid #ddd;">${userProfile?.display_name || 'N/A'} (@${userProfile?.username || 'N/A'})</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Montant retrait</td><td style="padding:8px;border:1px solid #ddd;">${amount.toLocaleString()} ${currency}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Frais AVYLINK (6,5%)</td><td style="padding:8px;border:1px solid #ddd;">${feeAmount.toLocaleString()} ${currency}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Montant reçu</td><td style="padding:8px;border:1px solid #ddd;color:green;font-weight:bold;">${netAmount.toLocaleString()} ${currency}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Destinataire</td><td style="padding:8px;border:1px solid #ddd;">${recipient_name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Réseau</td><td style="padding:8px;border:1px solid #ddd;">${service}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Numéro</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #ddd;">${dateStr} à ${timeStr}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Statut</td><td style="padding:8px;border:1px solid #ddd;color:green;">✅ Réussi</td></tr>
          </table>
        `;

        // Use Lovable AI gateway to send email via edge function
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        await fetch(`${supabaseUrl}/functions/v1/send-withdrawal-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            to: "avydigitalbusiness@gmail.com",
            subject: `[AVYLINK] Retrait de ${amount.toLocaleString()} ${currency} par @${userProfile?.username || 'N/A'}`,
            html: emailBody,
          }),
        }).catch(err => console.error("Email send error:", err));
      } catch (emailErr) {
        console.error("Email notification error:", emailErr);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Retrait effectué ! ${netAmount.toLocaleString()} ${currency} envoyés (frais: ${feeAmount.toLocaleString()} ${currency})`,
          net_amount: netAmount,
          fee_amount: feeAmount,
        }),
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

      // Log failed withdrawal notification
      await adminClient.from("withdrawal_notifications").insert({
        user_id: userId,
        username: userProfile?.username || "N/A",
        display_name: userProfile?.display_name || "N/A",
        amount,
        fee_amount: feeAmount,
        net_amount: netAmount,
        currency,
        recipient_name: recipient_name,
        recipient_phone: phone,
        recipient_service: service,
        status: "failed",
      });

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
