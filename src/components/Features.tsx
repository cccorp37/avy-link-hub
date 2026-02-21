import {
  Link2, Palette, BarChart3, ShoppingBag, Globe, Zap,
  Youtube, Music, Lock, Smartphone, Share2, ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Liens Illimités",
    description: "Ajoutez tous vos liens : réseaux sociaux, boutiques, portfolios, musique... sans limite.",
    gradient: "from-primary to-[hsl(199,89%,73%)]",
    badge: null,
  },
  {
    icon: Palette,
    title: "50+ Thèmes Visuels",
    description: "Personnalisez entièrement votre page avec des thèmes pro, vos couleurs et vos polices.",
    gradient: "from-violet-500 to-purple-600",
    badge: "✨ Populaire",
  },
  {
    icon: BarChart3,
    title: "Analytics Avancés",
    description: "Suivez vos clics, sources de trafic, géolocalisation et l'évolution de votre audience.",
    gradient: "from-emerald-400 to-emerald-600",
    badge: null,
  },
  {
    icon: ShoppingBag,
    title: "Boutique Intégrée",
    description: "Vendez vos produits directement depuis votre page. Catalogue, paiement, livraison.",
    gradient: "from-orange-400 to-orange-600",
    badge: "🔥 Business",
  },
  {
    icon: Youtube,
    title: "Miniatures Vidéo",
    description: "Intégrez vos vidéos YouTube avec miniatures HD, titres et vues automatiques.",
    gradient: "from-red-400 to-red-600",
    badge: null,
  },
  {
    icon: Globe,
    title: "Domaine Personnalisé",
    description: "Utilisez votre propre domaine (votresite.com) pour une image ultra-professionnelle.",
    gradient: "from-primary to-[hsl(207,89%,42%)]",
    badge: null,
  },
  {
    icon: Zap,
    title: "Chargement Ultra-Rapide",
    description: "Pages optimisées pour le mobile-first, même avec une connexion 3G lente.",
    gradient: "from-amber-400 to-yellow-500",
    badge: "⚡ Afrique",
  },
  {
    icon: Music,
    title: "Plateformes Musicales",
    description: "Spotify, Deezer, SoundCloud, Apple Music — intégrez votre musique en un clic.",
    gradient: "from-green-400 to-emerald-500",
    badge: null,
  },
  {
    icon: Lock,
    title: "Liens Protégés",
    description: "Accès par mot de passe, liens premium réservés à vos abonnés payants.",
    gradient: "from-primary to-[hsl(338,85%,65%)]",
    badge: "🔐 Premium",
  },
];

const Features = () => {
  return (
    <section id="fonctionnalites" className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,hsl(204,94%,52%,0.04),transparent)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,hsl(338,85%,65%,0.03),transparent)] pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 space-y-5">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 px-5 py-2.5 rounded-full text-sm font-semibold text-primary">
            <Zap className="w-4 h-4" />
            Fonctionnalités puissantes
          </div>
          <h2 className="font-dm font-extrabold text-4xl md:text-6xl text-foreground tracking-tight leading-tight">
            Tout ce dont tu as besoin,
            <br />
            <span className="text-gradient">sans complexité</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            AVYLINK combine puissance et simplicité pour que chaque créateur
            puisse briller en ligne, dès le premier jour.
          </p>
        </div>

        {/* Grid — asymmetric bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isLarge = idx === 0 || idx === 3;
            
            return (
              <div
                key={feat.title}
                className={`group relative rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1 border border-border/40 bg-card overflow-hidden ${
                  isLarge ? "lg:col-span-1" : ""
                }`}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-3xl`} />
                
                {/* Badge */}
                {feat.badge && (
                  <span className="absolute top-5 right-5 bg-primary/5 border border-primary/15 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {feat.badge}
                  </span>
                )}

                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-dm font-bold text-xl text-foreground mb-2 flex items-center gap-2">
                    {feat.title}
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile showcase — redesigned as a highlight banner */}
        <div className="mt-24 relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(207,89%,42%)] to-primary" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
          
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-semibold text-sm px-4 py-2 rounded-full">
                <Smartphone className="w-4 h-4" />
                Mobile-First
              </div>
              <h3 className="font-dm font-extrabold text-4xl text-white leading-tight">
                Conçu pour
                <br />
                l'Afrique 🌍
              </h3>
              <p className="text-white/80 leading-relaxed max-w-md">
                Pages ultra-légères optimisées pour les connexions 3G/4G.
                Interface traduite en Français, Anglais, Wolof, Swahili et plus encore.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["🇨🇮 Côte d'Ivoire", "🇸🇳 Sénégal", "🇨🇲 Cameroun", "🇳🇬 Nigeria", "🇬🇭 Ghana"].map((country) => (
                  <span key={country} className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-sm text-white font-medium">
                    {country}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Share2, label: "Partage facile", value: "1 lien = tout" },
                  { icon: BarChart3, label: "Analytics", value: "Temps réel" },
                  { icon: Zap, label: "Vitesse", value: "< 1 seconde" },
                  { icon: Globe, label: "Langues", value: "Multi-langues" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-dm font-bold text-sm text-white">{item.value}</div>
                    <div className="text-xs text-white/60 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
