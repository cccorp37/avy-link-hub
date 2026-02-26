import { useState } from "react";
import { Crown, Search, Check, Loader2, Sparkles, Mail, Globe, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import SocialIcon from "@/components/SocialIcon";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
interface Props { profile: Profile | null; onUpdate?: (updates: Partial<Profile>) => Promise<void>; }

const CATEGORIES = [
  "Tous", "Carte de visite", "Créatif", "Boutique", "Animation", "Festival", "Minimaliste"
];

interface TemplateDef {
  id: string;
  name: string;
  category: string;
  isPro: boolean;
  theme: string;
  button_style: string;
  font_style: string;
  background_color: string;
  // Preview config
  preview: {
    coverBg: string;
    coverOverlay?: string;
    cardBg: string;
    textColor: string;
    subtitleColor: string;
    avatarBg: string;
    avatarEmoji: string;
    displayName: string;
    subtitle: string;
    badge?: string;
    socials?: string[];
    buttons: { label: string; bg: string; textColor: string; border?: string }[];
    accentColor: string;
  };
}

const TEMPLATES: TemplateDef[] = [
  {
    id: "biz-navy", name: "Business Navy", category: "Carte de visite", isPro: false,
    theme: "dark", button_style: "rounded", font_style: "inter", background_color: "#0f172a",
    preview: {
      coverBg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
      cardBg: "#ffffff", textColor: "#0f172a", subtitleColor: "#64748b",
      avatarBg: "linear-gradient(135deg, #0ea5e9, #2563eb)", avatarEmoji: "👨‍💼",
      displayName: "Marc Dupont", subtitle: "Senior Consultant", badge: "Consultant",
      socials: ["facebook", "instagram", "youtube", "tiktok"],
      buttons: [
        { label: "✉️  Send Email", bg: "#ffffff", textColor: "#0f172a", border: "1px solid #e2e8f0" },
        { label: "Add to Contacts", bg: "#0f172a", textColor: "#ffffff" },
      ],
      accentColor: "#0ea5e9",
    },
  },
  {
    id: "artist-purple", name: "Artiste Violet", category: "Créatif", isPro: false,
    theme: "dark", button_style: "pill", font_style: "dm", background_color: "#7c3aed",
    preview: {
      coverBg: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)",
      coverOverlay: "rgba(124, 58, 237, 0.3)",
      cardBg: "#f3e8ff", textColor: "#4c1d95", subtitleColor: "#7c3aed",
      avatarBg: "linear-gradient(135deg, #a855f7, #7c3aed)", avatarEmoji: "🎤",
      displayName: "Chris Cray", subtitle: "Recording Artist", badge: "Lead singer",
      socials: ["spotify", "instagram", "tiktok"],
      buttons: [
        { label: "🎵 Don't Blame Me", bg: "#1DB954", textColor: "#fff" },
        { label: "✉️  support@email.com", bg: "#f3e8ff", textColor: "#7c3aed", border: "1px solid #c4b5fd" },
      ],
      accentColor: "#a855f7",
    },
  },
  {
    id: "shop-red", name: "Boutique Rouge", category: "Boutique", isPro: false,
    theme: "dark", button_style: "rounded", font_style: "inter", background_color: "#dc2626",
    preview: {
      coverBg: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      cardBg: "#ffffff", textColor: "#1f2937", subtitleColor: "#6b7280",
      avatarBg: "linear-gradient(135deg, #f97316, #dc2626)", avatarEmoji: "🛒",
      displayName: "Shopping Store", subtitle: "Divers produits disponibles",
      socials: ["whatsapp", "instagram", "tiktok"],
      buttons: [
        { label: "Lazada", bg: "#ffffff", textColor: "#dc2626", border: "2px solid #fecaca" },
        { label: "Shopee", bg: "#ffffff", textColor: "#dc2626", border: "2px solid #fecaca" },
        { label: "WhatsApp", bg: "#ffffff", textColor: "#25D366", border: "2px solid #bbf7d0" },
      ],
      accentColor: "#dc2626",
    },
  },
  {
    id: "fashion-gradient", name: "Fashion Queen", category: "Animation", isPro: true,
    theme: "dark", button_style: "pill", font_style: "dm", background_color: "#6d28d9",
    preview: {
      coverBg: "linear-gradient(135deg, #7c3aed 0%, #c084fc 50%, #f0abfc 100%)",
      cardBg: "linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)", textColor: "#ffffff", subtitleColor: "#e9d5ff",
      avatarBg: "linear-gradient(135deg, #f0abfc, #c084fc)", avatarEmoji: "👑",
      displayName: "Fashion Queen", subtitle: "Record the wonderful moments",
      buttons: [
        { label: "▶️  Be the most beautiful", bg: "rgba(255,255,255,0.15)", textColor: "#fff" },
        { label: "Website", bg: "#ffffff", textColor: "#6d28d9" },
        { label: "Blog", bg: "#ffffff", textColor: "#6d28d9" },
      ],
      socials: ["facebook", "instagram", "tiktok"],
      accentColor: "#c084fc",
    },
  },
  {
    id: "pink-soft", name: "Sophia Rose", category: "Animation", isPro: true,
    theme: "rose", button_style: "pill", font_style: "dm", background_color: "#fce7f3",
    preview: {
      coverBg: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)",
      cardBg: "#ffffff", textColor: "#831843", subtitleColor: "#be185d",
      avatarBg: "linear-gradient(135deg, #f9a8d4, #ec4899)", avatarEmoji: "🌸",
      displayName: "Sophia William", subtitle: "Happy every day",
      buttons: [
        { label: "Album", bg: "#ffffff", textColor: "#be185d", border: "1px solid #fbcfe8" },
        { label: "Facebook", bg: "#ffffff", textColor: "#be185d", border: "1px solid #fbcfe8" },
      ],
      accentColor: "#ec4899",
    },
  },
  {
    id: "xmas-green", name: "Merry Christmas", category: "Festival", isPro: true,
    theme: "forest", button_style: "rounded", font_style: "inter", background_color: "#14532d",
    preview: {
      coverBg: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 50%, #dcfce7 100%)",
      cardBg: "#ffffff", textColor: "#14532d", subtitleColor: "#15803d",
      avatarBg: "linear-gradient(135deg, #22c55e, #15803d)", avatarEmoji: "🎄",
      displayName: "Merry Christmas", subtitle: "Holiday deals & exclusive offers!",
      socials: ["facebook", "twitter", "instagram", "youtube"],
      buttons: [
        { label: "🎵  Spotify", bg: "#1DB954", textColor: "#fff" },
        { label: "🎵  Apple Music", bg: "#ffffff", textColor: "#14532d", border: "2px solid #15803d" },
      ],
      accentColor: "#22c55e",
    },
  },
  {
    id: "halloween-orange", name: "Halloween", category: "Festival", isPro: true,
    theme: "sunset", button_style: "rounded", font_style: "mono", background_color: "#78350f",
    preview: {
      coverBg: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
      cardBg: "#fff7ed", textColor: "#78350f", subtitleColor: "#9a3412",
      avatarBg: "linear-gradient(135deg, #f97316, #ea580c)", avatarEmoji: "🎃",
      displayName: "Happy Halloween", subtitle: "Special offers just for you",
      socials: ["facebook", "instagram", "youtube", "tiktok"],
      buttons: [
        { label: "🛍️  Shop Now", bg: "#f97316", textColor: "#fff" },
        { label: "📧  Contact Us", bg: "#f97316", textColor: "#fff" },
      ],
      accentColor: "#f97316",
    },
  },
  {
    id: "ocean-blue", name: "Océan Classique", category: "Carte de visite", isPro: false,
    theme: "ocean", button_style: "pill", font_style: "inter", background_color: "#1e3a5f",
    preview: {
      coverBg: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)",
      cardBg: "#f0f9ff", textColor: "#0c4a6e", subtitleColor: "#0369a1",
      avatarBg: "linear-gradient(135deg, #38bdf8, #0ea5e9)", avatarEmoji: "🌊",
      displayName: "Vincent van Gogh", subtitle: "Creative & Visionary",
      socials: ["facebook", "instagram", "twitter"],
      buttons: [
        { label: "Online Store", bg: "#ffffff", textColor: "#0c4a6e", border: "1px solid #bae6fd" },
        { label: "Youtube", bg: "#ffffff", textColor: "#0c4a6e", border: "1px solid #bae6fd" },
        { label: "About Us", bg: "#ffffff", textColor: "#0c4a6e", border: "1px solid #bae6fd" },
      ],
      accentColor: "#0ea5e9",
    },
  },
  {
    id: "dev-dark", name: "Développeur", category: "Minimaliste", isPro: false,
    theme: "dark", button_style: "square", font_style: "mono", background_color: "#0f172a",
    preview: {
      coverBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      cardBg: "#0f172a", textColor: "#38bdf8", subtitleColor: "#94a3b8",
      avatarBg: "linear-gradient(135deg, #38bdf8, #0ea5e9)", avatarEmoji: "💻",
      displayName: "Dev Studio", subtitle: "Software Developer",
      socials: ["github", "linkedin", "twitter"],
      buttons: [
        { label: "🌐 GitHub", bg: "rgba(56,189,248,0.1)", textColor: "#38bdf8", border: "1px solid #38bdf8" },
        { label: "💼 LinkedIn", bg: "rgba(56,189,248,0.1)", textColor: "#38bdf8", border: "1px solid #38bdf8" },
      ],
      accentColor: "#38bdf8",
    },
  },
  {
    id: "vm-store", name: "V&M Store", category: "Boutique", isPro: true,
    theme: "ocean", button_style: "rounded", font_style: "dm", background_color: "#0891b2",
    preview: {
      coverBg: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)",
      cardBg: "#ecfeff", textColor: "#164e63", subtitleColor: "#0891b2",
      avatarBg: "linear-gradient(135deg, #22d3ee, #06b6d4)", avatarEmoji: "👗",
      displayName: "V&M Store", subtitle: "Life as it should be",
      buttons: [
        { label: "Online Store", bg: "#0891b2", textColor: "#fff" },
        { label: "Contact Us", bg: "#0891b2", textColor: "#fff" },
      ],
      accentColor: "#06b6d4",
    },
  },
  {
    id: "creative-pink", name: "Inspiration Lab", category: "Créatif", isPro: false,
    theme: "rose", button_style: "pill", font_style: "dm", background_color: "#be185d",
    preview: {
      coverBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
      cardBg: "#ffffff", textColor: "#9d174d", subtitleColor: "#be185d",
      avatarBg: "linear-gradient(135deg, #f472b6, #ec4899)", avatarEmoji: "✨",
      displayName: "Inspiration Lab", subtitle: "Creativity & inspiration",
      buttons: [
        { label: "Online store", bg: "#ffffff", textColor: "#ec4899", border: "1px solid #fbcfe8" },
        { label: "About us", bg: "#ffffff", textColor: "#ec4899", border: "1px solid #fbcfe8" },
      ],
      accentColor: "#ec4899",
    },
  },
  {
    id: "golden-shop", name: "Golden Leaf", category: "Boutique", isPro: true,
    theme: "sunset", button_style: "rounded", font_style: "inter", background_color: "#ec4899",
    preview: {
      coverBg: "linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)",
      cardBg: "linear-gradient(180deg, #ec4899 0%, #db2777 100%)", textColor: "#ffffff", subtitleColor: "#fce7f3",
      avatarBg: "linear-gradient(135deg, #fbbf24, #f59e0b)", avatarEmoji: "💄",
      displayName: "Golden Leaf Shop", subtitle: "Mineral based beauty products",
      socials: ["facebook", "instagram", "twitter"],
      buttons: [
        { label: "Online store", bg: "rgba(255,255,255,0.2)", textColor: "#fff" },
        { label: "Contact us", bg: "rgba(255,255,255,0.2)", textColor: "#fff" },
      ],
      accentColor: "#ec4899",
    },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }),
};

function TemplateCard({ tpl, onUse, applying, index }: { tpl: TemplateDef; onUse: () => void; applying: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  const p = tpl.preview;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      layout
      className="relative rounded-2xl overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer group"
      style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Pro badge */}
      {tpl.isPro && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}
        >
          <Crown className="w-3.5 h-3.5 text-amber-900" />
        </motion.div>
      )}

      {/* Mini profile preview */}
      <div className="relative" style={{ background: p.cardBg }}>
        {/* Cover */}
        <div className="h-20 relative overflow-hidden" style={{ background: p.coverBg }}>
          {p.coverOverlay && <div className="absolute inset-0" style={{ background: p.coverOverlay }} />}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        {/* Avatar overlapping cover */}
        <div className="flex justify-center -mt-7 relative z-10">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-[3px] shadow-md"
            style={{ background: p.avatarBg, borderColor: typeof p.cardBg === "string" && p.cardBg.startsWith("linear") ? "#fff" : p.cardBg }}
          >
            {p.avatarEmoji}
          </div>
        </div>

        {/* Profile info */}
        <div className="px-3 pt-2 pb-3 text-center">
          <p className="font-bold text-sm truncate" style={{ color: p.textColor }}>{p.displayName}</p>
          <p className="text-[10px] mt-0.5 truncate" style={{ color: p.subtitleColor }}>{p.subtitle}</p>

          {p.badge && (
            <span
              className="inline-block mt-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${p.accentColor}15`, color: p.accentColor, border: `1px solid ${p.accentColor}30` }}
            >
              {p.badge}
            </span>
          )}

          {/* Social icons row */}
          {p.socials && p.socials.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              {p.socials.map(s => (
                <div key={s} className="opacity-80">
                  <SocialIcon platform={s} size={14} />
                </div>
              ))}
            </div>
          )}

          {/* Button previews */}
          <div className="mt-2.5 space-y-1.5">
            {p.buttons.slice(0, 2).map((btn, i) => (
              <div
                key={i}
                className="w-full py-1.5 px-2 text-[10px] font-medium text-center truncate"
                style={{
                  background: btn.bg,
                  color: btn.textColor,
                  border: btn.border || "none",
                  borderRadius: tpl.button_style === "pill" ? "9999px" : tpl.button_style === "sharp" ? "0" : tpl.button_style === "square" ? "4px" : "8px",
                }}
              >
                {btn.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-border/30 bg-card/90">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-xs text-foreground truncate">{tpl.name}</p>
            <p className="text-[10px] text-muted-foreground">{tpl.category}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
            tpl.isPro ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
          }`}>
            {tpl.isPro ? "Pro" : "Gratuit"}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-foreground/60 backdrop-blur-[3px] flex items-center justify-center"
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={onUse}
              disabled={applying}
              className="px-5 py-2.5 bg-background text-foreground rounded-xl font-semibold text-sm shadow-xl hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
            >
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {applying ? "Application..." : "Utiliser"}
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

  const handleUseTemplate = async (tpl: TemplateDef) => {
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
        background_color: tpl.background_color,
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
