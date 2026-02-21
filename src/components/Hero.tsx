import { ArrowRight, Sparkles, Star, Users, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "10K+", label: "Créateurs actifs", icon: Users },
  { value: "98%", label: "Satisfaction", icon: Star },
  { value: "5M+", label: "Clics générés", icon: TrendingUp },
  { value: "50+", label: "Pays couverts", icon: Zap },
];

const Hero = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(204,94%,52%,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,hsl(338,85%,65%,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_0%_50%,hsl(204,100%,97%,0.8),transparent)]" />
        
        {/* Geometric grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(204,94%,52%) 1px, transparent 1px), linear-gradient(90deg, hsl(204,94%,52%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Floating orbs */}
        <div className="absolute top-32 right-[15%] w-3 h-3 rounded-full bg-primary/40 animate-float" />
        <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[hsl(338,85%,65%)]/30 animate-float-delayed" />
        <div className="absolute bottom-32 right-[30%] w-4 h-4 rounded-full bg-primary/20 animate-float" />

        <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge with shimmer */}
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 px-5 py-2.5 rounded-full text-sm font-semibold text-primary backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              🌍 Fait pour l'Afrique, ouvert au Monde
            </div>

            {/* Title with more dynamic styling */}
            <div className="space-y-4">
              <h1 className="font-dm font-extrabold text-5xl lg:text-7xl text-foreground leading-[1.05] tracking-tight">
                Ton univers
                <br />
                en <span className="relative">
                  <span className="text-gradient">un seul lien</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C47 2.5 153 2.5 199 5.5" stroke="hsl(204,94%,52%)" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Crée ta page de liens personnalisée en quelques minutes.
                Centralise tes réseaux sociaux, tes produits et ton contenu.
                <strong className="text-foreground font-semibold"> Monétise ta présence en ligne.</strong>
              </p>
            </div>

            {/* CTA Buttons — redesigned */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="gradient-cta text-primary-foreground shadow-blue hover:shadow-blue-lg transition-all rounded-2xl font-bold text-base px-10 py-6 group"
              >
                Créer ma page gratuitement
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-2xl text-foreground hover:bg-primary/5 font-semibold text-base px-8 py-6"
              >
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                </span>
                Voir la démo
              </Button>
            </div>

            {/* Social proof — redesigned */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {["🧑🏿", "👩🏽", "👨🏾", "👩🏿", "🧑🏾"].map((emoji, i) => (
                  <div key={i} className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm border-[3px] border-background shadow-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                  <span className="text-sm font-bold text-foreground ml-1">4.9</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">+10 000</strong> créateurs
                </span>
              </div>
            </div>
          </div>

          {/* Right: Hero visual — redesigned with stacked cards */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main image with gradient border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-[hsl(338,85%,65%)]/10 z-10 pointer-events-none" />
                <img
                  src={heroBg}
                  alt="AVYLINK - Portfolio personnalisable"
                  className="w-full max-w-lg rounded-3xl object-cover"
                />
              </div>
              
              {/* Floating stat cards — glassmorphism redesign */}
              <div className="absolute -left-10 top-1/4 backdrop-blur-xl bg-background/80 rounded-2xl px-5 py-4 shadow-lg border border-border/50 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Clics aujourd'hui</div>
                    <div className="font-dm font-bold text-lg text-foreground leading-tight">+2 847</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-8 bottom-1/4 backdrop-blur-xl bg-background/80 rounded-2xl px-5 py-4 shadow-lg border border-border/50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(207,89%,42%)] flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Nouveaux abonnés</div>
                    <div className="font-dm font-bold text-lg text-foreground leading-tight">+142</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar — redesigned as floating glass bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4">
          <div className="backdrop-blur-xl bg-background/70 rounded-2xl border border-border/50 shadow-lg px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-dm font-bold text-xl text-foreground leading-tight">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showAuth && <AuthModal defaultMode="signup" onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Hero;
