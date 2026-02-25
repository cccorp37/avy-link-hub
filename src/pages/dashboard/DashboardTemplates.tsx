import { useState } from "react";
import { Crown, Search, Check, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
interface Props { profile: Profile | null; onUpdate?: (updates: Partial<Profile>) => Promise<void>; }

const CATEGORIES = [
  "Tous", "Carte de visite", "Animation", "Boutique", "Alimentation", "Créatif", "Festival", "Autre"
];

const TEMPLATES = [
  {
    id: "biz-card-1", name: "Professionnel Bleu", category: "Carte de visite", isPro: false,
    colors: ["#1a1a2e", "#16213e", "#0f3460"], accent: "#0EAAF0",
    theme: "dark", button_style: "rounded", font_style: "inter",
    desc: "Senior Consultant",
    preview: { bg: "linear-gradient(135deg,#1a1a2e,#0f3460)", textColor: "#fff", buttons: ["Send Email", "Add to Contacts"] }
  },
  {
    id: "music-1", name: "Artiste Violet", category: "Animation", isPro: true,
    colors: ["#6b21a8", "#7c3aed", "#8b5cf6"], accent: "#a855f7",
    theme: "dark", button_style: "pill", font_style: "dm",
    desc: "Lead Singer",
    preview: { bg: "linear-gradient(135deg,#6b21a8,#8b5cf6)", textColor: "#fff", buttons: ["🎵 Écouter", "✉️ Contact"] }
  },
  {
    id: "shop-1", name: "Boutique Rouge", category: "Boutique", isPro: false,
    colors: ["#dc2626", "#b91c1c", "#7f1d1d"], accent: "#f87171",
    theme: "dark", button_style: "rounded", font_style: "inter",
    desc: "Online Store",
    preview: { bg: "linear-gradient(135deg,#dc2626,#7f1d1d)", textColor: "#fff", buttons: ["🛍️ Boutique", "📱 WhatsApp"] }
  },
  {
    id: "xmas-1", name: "Noël", category: "Festival", isPro: true,
    colors: ["#15803d", "#166534", "#14532d"], accent: "#ef4444",
    theme: "forest", button_style: "rounded", font_style: "inter",
    desc: "Merry Christmas",
    preview: { bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", textColor: "#166534", buttons: ["🎁 Shop", "🎅 Contact"] }
  },
  {
    id: "blue-1", name: "Océan Bleu", category: "Carte de visite", isPro: false,
    colors: ["#1e3a5f", "#1e40af", "#2563eb"], accent: "#60a5fa",
    theme: "ocean", button_style: "pill", font_style: "inter",
    desc: "Business Manager",
    preview: { bg: "linear-gradient(135deg,#1e3a5f,#2563eb)", textColor: "#fff", buttons: ["🌐 Website", "📧 Email"] }
  },
  {
    id: "fashion-1", name: "Fashion Queen", category: "Animation", isPro: true,
    colors: ["#7c3aed", "#6d28d9", "#5b21b6"], accent: "#c4b5fd",
    theme: "dark", button_style: "pill", font_style: "dm",
    desc: "Influenceuse Mode",
    preview: { bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", textColor: "#fff", buttons: ["🌐 Website", "📝 Blog"] }
  },
  {
    id: "food-1", name: "Restaurant", category: "Alimentation", isPro: false,
    colors: ["#92400e", "#78350f", "#451a03"], accent: "#f59e0b",
    theme: "sunset", button_style: "rounded", font_style: "inter",
    desc: "Chef & Restaurant",
    preview: { bg: "linear-gradient(135deg,#92400e,#451a03)", textColor: "#fff", buttons: ["📋 Menu", "📞 Réserver"] }
  },
  {
    id: "halloween-1", name: "Halloween", category: "Festival", isPro: true,
    colors: ["#78350f", "#92400e", "#b45309"], accent: "#f97316",
    theme: "dark", button_style: "sharp", font_style: "mono",
    desc: "Happy Halloween",
    preview: { bg: "linear-gradient(135deg,#1c1917,#292524)", textColor: "#f97316", buttons: ["🛍️ Shop", "📧 Contact"] }
  },
  {
    id: "creative-1", name: "Créatif Rose", category: "Créatif", isPro: false,
    colors: ["#be185d", "#9d174d", "#831843"], accent: "#f472b6",
    theme: "rose", button_style: "pill", font_style: "dm",
    desc: "Creative Studio",
    preview: { bg: "linear-gradient(135deg,#fdf2f8,#fce7f3)", textColor: "#be185d", buttons: ["🖼️ Portfolio", "💬 Contact"] }
  },
  {
    id: "dev-1", name: "Développeur Sombre", category: "Carte de visite", isPro: false,
    colors: ["#0f172a", "#1e293b", "#334155"], accent: "#38bdf8",
    theme: "dark", button_style: "square", font_style: "mono",
    desc: "Software Developer",
    preview: { bg: "linear-gradient(135deg,#0f172a,#334155)", textColor: "#38bdf8", buttons: ["🌐 GitHub", "💼 LinkedIn"] }
  },
  {
    id: "music-2", name: "Christmas Party", category: "Festival", isPro: true,
    colors: ["#14532d", "#166534", "#15803d"], accent: "#ef4444",
    theme: "forest", button_style: "rounded", font_style: "inter",
    desc: "Christmas Event",
    preview: { bg: "linear-gradient(135deg,#fef2f2,#fee2e2)", textColor: "#14532d", buttons: ["🎵 Spotify", "🎵 Apple Music"] }
  },
  {
    id: "boutique-2", name: "V&M Store", category: "Boutique", isPro: true,
    colors: ["#0c4a6e", "#075985", "#0369a1"], accent: "#38bdf8",
    theme: "ocean", button_style: "pill", font_style: "dm",
    desc: "Clothing Store",
    preview: { bg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", textColor: "#0c4a6e", buttons: ["🛍️ Online Store", "📞 Contact"] }
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }),
};

function TemplateCard({ tpl, onUse, applying, index }: { tpl: typeof TEMPLATES[0]; onUse: () => void; applying: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      layout
      className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group transition-shadow hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.25)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {tpl.isPro && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg"
        >
          <Crown className="w-3.5 h-3.5 text-amber-900" />
        </motion.div>
      )}

      <div className="h-48 p-4 flex flex-col items-center justify-start gap-2 relative overflow-hidden" style={{ background: tpl.preview.bg }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]" />
        <div className="mt-2 w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/30 text-2xl backdrop-blur-sm relative z-10" style={{ background: "rgba(255,255,255,0.15)" }}>
          👤
        </div>
        <p className="font-bold text-sm text-center drop-shadow relative z-10" style={{ color: tpl.preview.textColor }}>{tpl.name}</p>
        <p className="text-xs text-center opacity-70 relative z-10" style={{ color: tpl.preview.textColor }}>{tpl.desc}</p>
        <div className="w-full space-y-1.5 mt-1 relative z-10">
          {tpl.preview.buttons.slice(0, 2).map((btn, i) => (
            <div key={i} className="w-full py-1.5 px-3 rounded-lg text-xs text-center backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.2)", color: tpl.preview.textColor }}>
              {btn}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-dm font-semibold text-sm text-foreground">{tpl.name}</p>
            <p className="text-xs text-muted-foreground">{tpl.category}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tpl.isPro ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
            {tpl.isPro ? "Pro" : "Gratuit"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-[2px] flex items-center justify-center"
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={onUse}
              disabled={applying}
              className="px-6 py-2.5 bg-background text-foreground rounded-xl font-semibold text-sm shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {applying ? "Application..." : "Utiliser ce modèle"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DashboardTemplates({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === "Tous" || t.category === activeCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUseTemplate = async (tpl: typeof TEMPLATES[0]) => {
    if (!profile) return;
    if (tpl.isPro && profile.plan === "free") {
      toast({ title: "Modèle Premium 👑", description: "Passe au plan Premium pour utiliser ce modèle.", variant: "destructive" });
      return;
    }
    setApplyingId(tpl.id);
    try {
      const updates: Partial<Profile> = {
        theme: tpl.theme as Profile["theme"],
        button_style: tpl.button_style,
        font_style: tpl.font_style,
      };
      if (onUpdate) {
        await onUpdate(updates);
      } else {
        await supabase.from("profiles").update(updates).eq("id", profile.id);
      }
      toast({ title: `✅ Modèle "${tpl.name}" appliqué !`, description: "Va dans Apparence pour personnaliser davantage." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'appliquer le modèle.", variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
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
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-dm font-bold text-lg text-foreground">Modèles de page</h2>
            <p className="text-sm text-muted-foreground">Choisis un template et applique-le en un clic</p>
          </div>
        </div>
        <div className="relative z-10">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un modèle..."
            className="pl-9 rounded-xl bg-background/60 backdrop-blur-sm border-border/50"
          />
        </div>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {CATEGORIES.map(cat => (
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
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16 bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50"
          >
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium text-foreground">Aucun modèle trouvé</p>
            <p className="text-sm text-muted-foreground mt-1">Essaie une autre catégorie</p>
          </motion.div>
        ) : (
          <motion.div key={activeCategory} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tpl, i) => (
              <TemplateCard
                key={tpl.id}
                tpl={tpl}
                index={i}
                applying={applyingId === tpl.id}
                onUse={() => handleUseTemplate(tpl)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pro CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative rounded-2xl border border-amber-200/50 p-6 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(40_100%_50%/0.1),transparent_60%)]" />
        <div className="relative z-10">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          </motion.div>
          <h3 className="font-dm font-bold text-base text-foreground mb-1">Accède à tous les modèles Pro</h3>
          <p className="text-sm text-muted-foreground mb-4">Débloque les modèles animés, boutiques et festivals avec le plan Premium</p>
          <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
            Passer à Premium 👑
          </button>
        </div>
      </motion.div>
    </div>
  );
}
