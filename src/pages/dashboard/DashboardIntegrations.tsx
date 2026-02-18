import { useState } from "react";
import { Crown, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
interface Props { profile: Profile | null; }

const INTEGRATIONS = [
  {
    id: "stripe",
    name: "Stripe",
    category: "Paiement",
    desc: "Acceptez des paiements directement sur votre page AvyLink",
    icon: "💳",
    color: "bg-violet-100 text-violet-700",
    bgColor: "bg-gradient-to-br from-violet-500 to-purple-600",
    isPro: true,
    connected: false,
    href: "#",
  },
  {
    id: "music_search",
    name: "Recherche de musique",
    category: "Musique",
    desc: "Trouvez et partagez votre musique sur toutes les plateformes en un seul lien",
    icon: "🎵",
    color: "bg-purple-100 text-purple-700",
    bgColor: "bg-gradient-to-br from-purple-400 to-violet-500",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Réseaux sociaux",
    desc: "Affichez vos dernières vidéos TikTok directement sur votre page",
    icon: "🎤",
    color: "bg-gray-100 text-gray-700",
    bgColor: "bg-gradient-to-br from-gray-900 to-gray-700",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "form_builder",
    name: "Formulaire",
    category: "Leads",
    desc: "Collectez des leads avec un formulaire de contact personnalisé",
    icon: "📋",
    color: "bg-teal-100 text-teal-700",
    bgColor: "bg-gradient-to-br from-teal-500 to-cyan-500",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "youtube",
    name: "YouTube",
    category: "Vidéo",
    desc: "Intégrez votre chaîne YouTube et vos dernières vidéos sur votre page",
    icon: "📺",
    color: "bg-red-100 text-red-700",
    bgColor: "bg-gradient-to-br from-red-500 to-red-600",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Musique",
    desc: "Partagez vos playlists Spotify et votre musique préférée",
    icon: "🎧",
    color: "bg-green-100 text-green-700",
    bgColor: "bg-gradient-to-br from-green-500 to-green-600",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "instagram",
    name: "Instagram",
    category: "Réseaux sociaux",
    desc: "Affichez votre grille de photos Instagram en temps réel",
    icon: "📸",
    color: "bg-pink-100 text-pink-700",
    bgColor: "bg-gradient-to-br from-pink-500 to-rose-500",
    isPro: true,
    connected: false,
    href: "#",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Communication",
    desc: "Ajoutez un bouton de contact WhatsApp direct sur votre page",
    icon: "💬",
    color: "bg-green-100 text-green-700",
    bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
    isPro: false,
    connected: false,
    href: "#",
  },
  {
    id: "paypal",
    name: "PayPal",
    category: "Paiement",
    desc: "Recevez des dons ou paiements via PayPal",
    icon: "🏦",
    color: "bg-blue-100 text-blue-700",
    bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
    isPro: true,
    connected: false,
    href: "#",
  },
  {
    id: "podcast",
    name: "Podcast",
    category: "Audio",
    desc: "Intégrez votre dernier épisode de podcast directement sur votre page",
    icon: "🎙️",
    color: "bg-rose-100 text-rose-700",
    bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
    isPro: false,
    connected: false,
    href: "#",
  },
];

const CATEGORIES_INT = ["Tous", "Paiement", "Musique", "Réseaux sociaux", "Vidéo", "Communication", "Audio", "Leads"];

export default function DashboardIntegrations({ profile }: Props) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const filtered = INTEGRATIONS.filter(i =>
    activeCategory === "Tous" || i.category === activeCategory
  );

  const handleConnect = (integration: typeof INTEGRATIONS[0]) => {
    if (integration.isPro && profile?.plan === "free") {
      toast({ title: "Fonctionnalité Premium 👑", description: "Passez au plan Premium pour activer cette intégration.", variant: "destructive" });
      return;
    }
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(integration.id)) next.delete(integration.id);
      else next.add(integration.id);
      return next;
    });
    toast({ title: connected.has(integration.id) ? "Intégration désactivée" : `✅ ${integration.name} connecté !` });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔌</span>
          <div>
            <h2 className="font-dm font-bold text-lg text-foreground">Intégrations</h2>
            <p className="text-sm text-muted-foreground">Connecte tes outils et plateformes préférés à ta page AvyLink</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES_INT.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat
                ? "bg-foreground text-background shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(integration => {
          const isConnected = connected.has(integration.id);
          return (
            <div key={integration.id} className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden hover:shadow-blue transition-all">
              {/* Visual header */}
              <div className={`h-24 ${integration.bgColor} flex items-center justify-center relative`}>
                <span className="text-4xl">{integration.icon}</span>
                {integration.isPro && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                    <Crown className="w-3 h-3 text-amber-900" />
                  </div>
                )}
                {isConnected && (
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-dm font-bold text-sm text-foreground">{integration.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${integration.color}`}>
                    {integration.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{integration.desc}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConnect(integration)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      isConnected
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : integration.isPro && profile?.plan === "free"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "gradient-cta text-primary-foreground shadow-sm"
                    }`}
                  >
                    {isConnected ? "✅ Connecté (désactiver)" : integration.isPro && profile?.plan === "free" ? "👑 Passer Pro" : "Connecter"}
                  </button>
                  <a
                    href={integration.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-border hover:bg-secondary text-muted-foreground transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature tips banner */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-5">
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-dm font-semibold text-sm text-foreground mb-1">Astuce Intégrations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Les intégrations permettent d'afficher du contenu riche directement sur ta page. 
              Commence par connecter tes réseaux sociaux pour donner vie à ton profil !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
