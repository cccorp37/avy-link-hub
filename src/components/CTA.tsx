import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Aïsha Diallo",
    role: "Influenceuse Mode",
    country: "🇸🇳 Dakar",
    avatar: "👩🏾",
    text: "Depuis que j'utilise AvyLink, mes ventes de mode ont triplé. Ma page est si belle que mes abonnés pensent que j'ai une agence derrière moi !",
    plan: "Premium",
  },
  {
    name: "Kwame Mensah",
    role: "Photographe Pro",
    country: "🇬🇭 Accra",
    avatar: "👨🏿",
    text: "AvyLink m'a permis de centraliser mon portfolio, mon Instagram et ma boutique. Je gagne 2x plus de clients depuis 3 mois.",
    plan: "Business",
  },
  {
    name: "Marie-Claire Koffi",
    role: "Coach Bien-être",
    country: "🇨🇮 Abidjan",
    avatar: "👩🏽",
    text: "Super facile à utiliser ! J'ai créé ma page en 10 minutes et mes clients trouvent tout mes services en un clic.",
    plan: "Starter",
  },
];

const CTA = () => {
  return (
    <>
      {/* Testimonials — redesigned as a marquee-inspired layout */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,hsl(204,94%,52%,0.04),transparent)] pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 px-5 py-2.5 rounded-full text-sm font-semibold text-primary">
              <Star className="w-4 h-4 fill-primary" />
              Témoignages vérifiés
            </div>
            <h2 className="font-dm font-extrabold text-4xl md:text-5xl text-foreground tracking-tight">
              Ils nous font <span className="text-gradient">confiance</span>
            </h2>
            <p className="text-muted-foreground text-lg">Des créateurs africains qui réussissent avec AvyLink</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className={`relative bg-card rounded-3xl p-7 border border-border/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  idx === 1 ? "md:-translate-y-4" : ""
                }`}
              >
                {/* Decorative quote */}
                <div className="absolute top-6 right-6 text-6xl font-serif text-primary/[0.06] leading-none select-none">"</div>
                
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6">"{t.text}"</p>
                  
                  <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[hsl(207,89%,42%)] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-dm font-bold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role} · {t.country}</div>
                    </div>
                    <span className="bg-primary/5 border border-primary/15 text-primary text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                      {t.plan}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — redesigned with a bold split layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-[hsl(220,25%,16%)] to-foreground" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(204,94%,52%,0.15),transparent)]" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />

        <div className="container mx-auto px-4 py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/10">
            <Sparkles className="w-4 h-4" />
            Rejoins +10 000 créateurs africains
          </div>
          <h2 className="font-dm font-extrabold text-5xl md:text-7xl text-white mb-6 tracking-tight leading-[1.1]">
            Ton univers mérite
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(199,89%,73%)] bg-clip-text text-transparent">
              une belle vitrine
            </span>
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Crée ta page AVYLINK gratuitement en 5 minutes.
            Aucune carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 shadow-xl rounded-2xl font-bold text-base px-12 py-6 group"
            >
              Créer ma page maintenant
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border border-white/20 text-white hover:bg-white/10 rounded-2xl font-semibold text-base px-10 py-6"
            >
              Voir les tarifs
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-8">
            Gratuit pour toujours · Pas de carte requise · Support en français 🇫🇷
          </p>
        </div>
      </section>
    </>
  );
};

export default CTA;
