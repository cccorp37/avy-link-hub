import { useState } from "react";
import { Crown, ExternalLink, Check, Plug, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
interface Props { profile: Profile | null; }

const INTEGRATIONS = [
  { id: "stripe", name: "Stripe", category: "Paiement", desc: "Acceptez des paiements directement sur votre page AvyLink", icon: "💳", color: "bg-violet-100 text-violet-700", bgColor: "bg-gradient-to-br from-violet-500 to-purple-600", isPro: true, connected: false, href: "#" },
  { id: "music_search", name: "Recherche de musique", category: "Musique", desc: "Trouvez et partagez votre musique sur toutes les plateformes", icon: "🎵", color: "bg-purple-100 text-purple-700", bgColor: "bg-gradient-to-br from-purple-400 to-violet-500", isPro: false, connected: false, href: "#" },
  { id: "tiktok", name: "TikTok", category: "Réseaux sociaux", desc: "Affichez vos dernières vidéos TikTok directement sur votre page", icon: "🎤", color: "bg-gray-100 text-gray-700", bgColor: "bg-gradient-to-br from-gray-900 to-gray-700", isPro: false, connected: false, href: "#" },
  { id: "form_builder", name: "Formulaire", category: "Leads", desc: "Collectez des leads avec un formulaire de contact personnalisé", icon: "📋", color: "bg-teal-100 text-teal-700", bgColor: "bg-gradient-to-br from-teal-500 to-cyan-500", isPro: false, connected: false, href: "#" },
  { id: "youtube", name: "YouTube", category: "Vidéo", desc: "Intégrez votre chaîne YouTube et vos dernières vidéos", icon: "📺", color: "bg-red-100 text-red-700", bgColor: "bg-gradient-to-br from-red-500 to-red-600", isPro: false, connected: false, href: "#" },
  { id: "spotify", name: "Spotify", category: "Musique", desc: "Partagez vos playlists Spotify et votre musique préférée", icon: "🎧", color: "bg-green-100 text-green-700", bgColor: "bg-gradient-to-br from-green-500 to-green-600", isPro: false, connected: false, href: "#" },
  { id: "instagram", name: "Instagram", category: "Réseaux sociaux", desc: "Affichez votre grille de photos Instagram en temps réel", icon: "📸", color: "bg-pink-100 text-pink-700", bgColor: "bg-gradient-to-br from-pink-500 to-rose-500", isPro: true, connected: false, href: "#" },
  { id: "whatsapp", name: "WhatsApp Business", category: "Communication", desc: "Ajoutez un bouton de contact WhatsApp direct", icon: "💬", color: "bg-green-100 text-green-700", bgColor: "bg-gradient-to-br from-green-500 to-emerald-600", isPro: false, connected: false, href: "#" },
  { id: "paypal", name: "PayPal", category: "Paiement", desc: "Recevez des dons ou paiements via PayPal", icon: "🏦", color: "bg-blue-100 text-blue-700", bgColor: "bg-gradient-to-br from-blue-600 to-blue-700", isPro: true, connected: false, href: "#" },
  { id: "podcast", name: "Podcast", category: "Audio", desc: "Intégrez votre dernier épisode de podcast", icon: "🎙️", color: "bg-rose-100 text-rose-700", bgColor: "bg-gradient-to-br from-rose-500 to-pink-600", isPro: false, connected: false, href: "#" },
];

const CATEGORIES_INT = ["Tous", "Paiement", "Musique", "Réseaux sociaux", "Vidéo", "Communication", "Audio", "Leads"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }),
};

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
    const wasConnected = connected.has(integration.id);
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(integration.id)) next.delete(integration.id);
      else next.add(integration.id);
      return next;
    });
    toast({ title: wasConnected ? "Intégration désactivée" : `✅ ${integration.name} connecté !` });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Plug className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-dm font-bold text-lg text-foreground">Intégrations</h2>
            <p className="text-sm text-muted-foreground">Connecte tes outils et plateformes préférés</p>
          </div>
          <div className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {connected.size} actif{connected.size > 1 ? "s" : ""}
          </div>
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {CATEGORIES_INT.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat
                ? "bg-foreground text-background shadow-md"
                : "bg-card/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration, i) => {
            const isConnected = connected.has(integration.id);
            return (
              <motion.div
                key={integration.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                layout
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.2)] transition-shadow"
              >
                {/* Visual header */}
                <div className={`h-24 ${integration.bgColor} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)]" />
                  <motion.span
                    className="text-4xl relative z-10"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {integration.icon}
                  </motion.span>
                  {integration.isPro && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg"
                    >
                      <Crown className="w-3 h-3 text-amber-900" />
                    </motion.div>
                  )}
                  <AnimatePresence>
                    {isConnected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-3 left-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleConnect(integration)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                        isConnected
                          ? "bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          : integration.isPro && profile?.plan === "free"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                      }`}
                    >
                      {isConnected ? "✅ Connecté" : integration.isPro && profile?.plan === "free" ? "👑 Passer Pro" : "Connecter"}
                    </motion.button>
                    <a
                      href={integration.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border/50 hover:bg-secondary text-muted-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Tips banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative rounded-2xl border border-primary/20 p-5 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-xl" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-dm font-semibold text-sm text-foreground mb-1">Astuce Intégrations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Les intégrations permettent d'afficher du contenu riche directement sur ta page.
              Commence par connecter tes réseaux sociaux pour donner vie à ton profil !
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
