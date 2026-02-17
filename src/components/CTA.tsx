import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Aïsha Diallo",
    role: "Influenceuse Mode",
    country: "🇸🇳 Dakar, Sénégal",
    avatar: "👩🏾",
    text: "Depuis que j'utilise AvyLink, mes ventes de mode ont triplé. Ma page est si belle que mes abonnés pensent que j'ai une agence derrière moi !",
    plan: "Premium",
  },
  {
    name: "Kwame Mensah",
    role: "Photographe Pro",
    country: "🇬🇭 Accra, Ghana",
    avatar: "👨🏿",
    text: "AvyLink m'a permis de centraliser mon portfolio, mon Instagram et ma boutique. Je gagne 2x plus de clients depuis 3 mois.",
    plan: "Business",
  },
  {
    name: "Marie-Claire Koffi",
    role: "Coach Bien-être",
    country: "🇨🇮 Abidjan, Côte d'Ivoire",
    avatar: "👩🏽",
    text: "Super facile à utiliser ! J'ai créé ma page en 10 minutes et mes clients trouvent tout mes services en un clic. Le support en français est parfait.",
    plan: "Starter",
  },
];

const CTA = () => {
  return (
    <>
      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-dm font-bold text-3xl md:text-4xl text-foreground mb-3">
              Ils nous font <span className="text-gradient">confiance</span> 🌟
            </h2>
            <p className="text-muted-foreground">Des créateurs africains qui réussissent avec AvyLink</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-card-hover transition-all hover:-translate-y-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-dm font-bold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                    <div className="text-xs text-muted-foreground">{t.country}</div>
                  </div>
                  <span className="ml-auto glass-pink text-primary text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                    {t.plan}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="mt-3 flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-cta opacity-95" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Rejoins +10 000 créateurs africains
          </div>
          <h2 className="font-dm font-bold text-4xl md:text-6xl text-white mb-6 tracking-tight">
            Ton univers mérite
            <br />
            une belle vitrine 🌸
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
            Crée ta page AVYLINK gratuitement en 5 minutes. 
            Aucune carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg rounded-xl font-bold text-base px-10"
            >
              Créer ma page maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 rounded-xl font-semibold text-base px-10"
            >
              Voir les tarifs
            </Button>
          </div>
          <p className="text-white/60 text-sm mt-6">
            Gratuit pour toujours · Pas de carte requise · Support en français 🇫🇷
          </p>
        </div>
      </section>
    </>
  );
};

export default CTA;
