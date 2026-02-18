import { ArrowRight, Sparkles, Star, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "10K+", label: "Créateurs actifs" },
  { value: "98%", label: "Satisfaction client" },
  { value: "5M+", label: "Clics générés" },
  { value: "50+", label: "Pays couverts" },
];

const Hero = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-16">
        {/* Decorative blobs — blue tones dominant */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-primary-light/15 rounded-full blur-2xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-blue px-4 py-2 rounded-full text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              <span>🌍 Fait pour l'Afrique, ouvert au Monde</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="font-dm font-bold text-5xl lg:text-6xl text-foreground leading-tight tracking-tight">
                Ton univers en
                <br />
                <span className="text-gradient">un seul lien</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Crée ta page de liens personnalisée en quelques minutes.
                Centralise tes réseaux sociaux, tes produits et ton contenu.
                <strong className="text-foreground"> Monétise ta présence en ligne.</strong>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="gradient-cta text-primary-foreground shadow-blue hover:shadow-blue-lg transition-all rounded-xl font-semibold text-base px-8 animate-pulse-blue"
              >
                Créer ma page gratuitement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 font-semibold text-base px-8"
              >
                Voir la démo
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🧑🏿", "👩🏽", "👨🏾", "👩🏿"].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm border-2 border-white shadow-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">+10 000</strong> créateurs nous font confiance
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-dm font-bold text-2xl text-gradient">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative animate-float">
              <img
                src={heroBg}
                alt="AVYLINK - Portfolio personnalisable"
                className="w-full max-w-lg rounded-3xl shadow-blue-lg object-cover"
              />
              {/* Floating cards */}
              <div className="absolute -left-8 top-1/4 glass rounded-2xl px-4 py-3 shadow-card animate-float-delayed flex items-center gap-3">
                <div className="w-8 h-8 bg-success/15 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Clics aujourd'hui</div>
                  <div className="font-dm font-bold text-sm text-foreground">+2 847 🔥</div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/3 glass rounded-2xl px-4 py-3 shadow-card flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nouveaux abonnés</div>
                  <div className="font-dm font-bold text-sm text-foreground">+142 ce mois 🚀</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 720 0 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {showAuth && <AuthModal defaultMode="signup" onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Hero;
