import { Check, X, Star, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    icon: Star,
    price: { usd: 0, fcfa: 0 },
    priceAnnual: { usd: 0, fcfa: 0 },
    description: "Pour découvrir AvyLink",
    color: "border-border",
    popular: false,
    cta: "Commencer Gratuitement",
    ctaVariant: "outline" as const,
    features: [
      { label: "10 liens maximum", included: true },
      { label: "5 thèmes basiques", included: true },
      { label: "3 miniatures vidéo", included: true },
      { label: "100 MB de stockage", included: true },
      { label: "Analytics 7 jours", included: true },
      { label: "URL : avylink.com/nom", included: true },
      { label: "Logo AvyLink visible", included: false },
      { label: "Domaine personnalisé", included: false },
      { label: "Support prioritaire", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    price: { usd: 2.99, fcfa: 1750 },
    priceAnnual: { usd: 2.24, fcfa: 1313 },
    description: "Pour créateurs débutants",
    color: "border-primary/30",
    popular: false,
    cta: "Choisir Starter",
    ctaVariant: "outline" as const,
    features: [
      { label: "25 liens maximum", included: true },
      { label: "15 thèmes", included: true },
      { label: "10 miniatures vidéo", included: true },
      { label: "1 GB de stockage", included: true },
      { label: "Analytics 30 jours", included: true },
      { label: "1 formulaire personnalisé", included: true },
      { label: "Logo AvyLink supprimé", included: true },
      { label: "Domaine personnalisé", included: false },
      { label: "Support prioritaire", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    price: { usd: 4.99, fcfa: 2900 },
    priceAnnual: { usd: 3.74, fcfa: 2175 },
    description: "Pour créateurs sérieux",
    color: "border-primary",
    popular: true,
    cta: "Passer à Premium 🔥",
    ctaVariant: "default" as const,
    features: [
      { label: "Liens illimités ∞", included: true },
      { label: "50+ thèmes pro", included: true },
      { label: "Vidéos illimitées", included: true },
      { label: "5 GB de stockage", included: true },
      { label: "Analytics 12 mois + Export", included: true },
      { label: "5 formulaires + Pop-ups ∞", included: true },
      { label: "Domaine personnalisé", included: true },
      { label: "Badge Certified ✓", included: true },
      { label: "Support prioritaire 12h", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    icon: Building2,
    price: { usd: 9.99, fcfa: 5850 },
    priceAnnual: { usd: 7.49, fcfa: 4388 },
    description: "Pour entreprises",
    color: "border-border",
    popular: false,
    cta: "Choisir Business",
    ctaVariant: "outline" as const,
    features: [
      { label: "Tout Premium inclus", included: true },
      { label: "Boutique e-commerce ∞", included: true },
      { label: "Commission 2% seulement", included: true },
      { label: "Stockage illimité", included: true },
      { label: "Heatmap + A/B Testing", included: true },
      { label: "API Access + Webhooks", included: true },
      { label: "Tous les Pixels (TikTok...)", included: true },
      { label: "Support 24h email", included: true },
      { label: "Multi-utilisateurs", included: true },
    ],
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrency] = useState<"usd" | "fcfa">("fcfa");

  return (
    <section id="tarifs" className="py-24 gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 glass-blue px-4 py-2 rounded-full text-sm font-medium text-primary">
            🌍 Prix accessibles à tous
          </div>
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            Commencez <span className="text-gradient">gratuitement</span>,
            <br />évoluez à votre rythme
          </h2>
          <p className="text-muted-foreground text-lg">
            Des prix pensés pour l'Afrique 🌍 — Même les étudiants peuvent se l'offrir !
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {/* Billing toggle */}
          <div className="glass rounded-2xl p-1 flex items-center gap-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                !annual ? "gradient-cta text-primary-foreground shadow-blue" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                annual ? "gradient-cta text-primary-foreground shadow-blue" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annuel
              <span className="bg-warning/20 text-warning text-xs font-bold px-1.5 py-0.5 rounded-full">-25% 🎉</span>
            </button>
          </div>

          {/* Currency toggle */}
          <div className="glass rounded-2xl p-1 flex items-center gap-1">
            {(["fcfa", "usd"] as const).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currency === cur ? "gradient-primary text-primary-foreground shadow-blue" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cur === "fcfa" ? "🇨🇮 FCFA" : "💵 USD"}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const price = annual ? plan.priceAnnual : plan.price;
            const displayPrice = currency === "fcfa" ? price.fcfa : price.usd;
            const suffix = currency === "fcfa" ? "FCFA" : "$";
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative bg-card rounded-3xl p-6 shadow-card border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover flex flex-col ${plan.color} ${
                  plan.popular ? "shadow-blue lg:scale-105 z-10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-cta text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-blue">
                    ⭐ LE PLUS POPULAIRE
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    plan.popular ? "gradient-cta" : "bg-primary/10"
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <h3 className="font-dm font-bold text-xl text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {displayPrice === 0 ? (
                    <div className="font-dm font-bold text-4xl text-foreground">
                      Gratuit
                      <span className="text-sm font-normal text-muted-foreground ml-2">pour toujours</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-dm font-bold text-4xl text-foreground">
                          {currency === "fcfa" ? displayPrice.toLocaleString() : displayPrice}
                        </span>
                        <span className="text-muted-foreground font-medium">{suffix}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">par mois{annual ? " (facturé annuellement)" : ""}</div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full rounded-xl font-semibold mb-6 ${
                    plan.popular
                      ? "gradient-cta text-primary-foreground shadow-blue hover:shadow-blue-lg"
                      : "border-primary/30 text-primary hover:bg-primary/5"
                  }`}
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat.label} className="flex items-start gap-2.5">
                      {feat.included ? (
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feat.included ? "text-foreground" : "text-muted-foreground/60 line-through"}`}>
                        {feat.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm">
            ✅ Pas de carte bancaire requise pour le plan gratuit · Annulez à tout moment · Support en français
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
