import {
  Link2, Palette, BarChart3, ShoppingBag, Globe, Zap,
  Youtube, Instagram, Music, Lock, Smartphone, Share2
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Liens Illimités",
    description: "Ajoutez tous vos liens : réseaux sociaux, boutiques, portfolios, musique... sans limite.",
    color: "bg-primary/10 text-primary",
    badge: null,
  },
  {
    icon: Palette,
    title: "50+ Thèmes Visuels",
    description: "Personnalisez entièrement votre page avec des thèmes pro, vos couleurs et vos polices.",
    color: "bg-purple-100 text-purple-600",
    badge: "✨ Populaire",
  },
  {
    icon: BarChart3,
    title: "Analytics Avancés",
    description: "Suivez vos clics, sources de trafic, géolocalisation et l'évolution de votre audience.",
    color: "bg-emerald-100 text-emerald-600",
    badge: null,
  },
  {
    icon: ShoppingBag,
    title: "Boutique Intégrée",
    description: "Vendez vos produits directement depuis votre page. Catalogue, paiement, livraison.",
    color: "bg-orange-100 text-orange-600",
    badge: "🔥 Business",
  },
  {
    icon: Youtube,
    title: "Miniatures Vidéo",
    description: "Intégrez vos vidéos YouTube avec miniatures HD, titres et vues automatiques.",
    color: "bg-red-100 text-red-500",
    badge: null,
  },
  {
    icon: Globe,
    title: "Domaine Personnalisé",
    description: "Utilisez votre propre domaine (votresite.com) pour une image ultra-professionnelle.",
    color: "bg-blue-100 text-blue-600",
    badge: null,
  },
  {
    icon: Zap,
    title: "Chargement Ultra-Rapide",
    description: "Pages optimisées pour le mobile-first, même avec une connexion 3G lente.",
    color: "bg-yellow-100 text-yellow-600",
    badge: "⚡ Afrique",
  },
  {
    icon: Music,
    title: "Plateformes Musicales",
    description: "Spotify, Deezer, SoundCloud, Apple Music — intégrez votre musique en un clic.",
    color: "bg-green-100 text-green-600",
    badge: null,
  },
  {
    icon: Lock,
    title: "Liens Protégés",
    description: "Accès par mot de passe, liens premium réservés à vos abonnés payants.",
    color: "bg-primary/10 text-primary",
    badge: "🔐 Premium",
  },
];

const Features = () => {
  return (
    <section id="fonctionnalites" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 glass-pink px-4 py-2 rounded-full text-sm font-medium text-primary">
            <Zap className="w-4 h-4" />
            Fonctionnalités puissantes
          </div>
          <h2 className="font-dm font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            Tout ce dont tu as besoin,
            <br />
            <span className="text-gradient">sans complexité</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            AVYLINK combine puissance et simplicité pour que chaque créateur 
            puisse briller en ligne, dès le premier jour.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border/50 overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 gradient-soft opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              
              <div className="relative z-10">
                {/* Badge */}
                {feat.badge && (
                  <span className="absolute top-0 right-0 glass-pink text-primary text-xs font-semibold px-2.5 py-1 rounded-bl-xl rounded-tr-xl">
                    {feat.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>

                <h3 className="font-dm font-bold text-lg text-foreground mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile showcase */}
        <div className="mt-20 glass-pink rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
              <Smartphone className="w-4 h-4" />
              Mobile-First
            </div>
            <h3 className="font-dm font-bold text-3xl text-foreground">
              Conçu pour l'Afrique 🌍
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Pages ultra-légères optimisées pour les connexions 3G/4G. 
              Interface traduite en Français, Anglais, Wolof, Swahili et plus encore.
              Prix accessibles à tous les créateurs africains.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["🇨🇮 Côte d'Ivoire", "🇸🇳 Sénégal", "🇨🇲 Cameroun", "🇳🇬 Nigeria", "🇬🇭 Ghana", "🇰🇪 Kenya"].map((country) => (
                <span key={country} className="glass px-3 py-1 rounded-full text-sm text-foreground font-medium">
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
                <div key={item.label} className="bg-card rounded-2xl p-4 shadow-card text-center">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="font-dm font-bold text-sm text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
