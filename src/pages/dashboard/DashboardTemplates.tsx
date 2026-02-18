import { useState } from "react";
import { Crown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
interface Props { profile: Profile | null; }

const CATEGORIES = [
  "Tous", "Carte de visite", "Animation", "Boutique", "Alimentation", "Créatif", "Festival", "Autre"
];

const TEMPLATES = [
  {
    id: "biz-card-1", name: "Professionnel Bleu", category: "Carte de visite", isPro: false,
    colors: ["#1a1a2e", "#16213e", "#0f3460"], accent: "#0EAAF0",
    desc: "Senior Consultant", preview: { bg: "linear-gradient(135deg,#1a1a2e,#0f3460)", avatar: "👔", buttons: ["✉️ Send Email", "Add to Contacts"] }
  },
  {
    id: "music-1", name: "Artiste Violet", category: "Animation", isPro: true,
    colors: ["#6b21a8", "#7c3aed", "#8b5cf6"], accent: "#a855f7",
    desc: "Lead Singer", preview: { bg: "linear-gradient(135deg,#6b21a8,#8b5cf6)", avatar: "🎤", buttons: ["🎵 Écouter", "✉️ Contact"] }
  },
  {
    id: "shop-1", name: "Boutique Rouge", category: "Boutique", isPro: false,
    colors: ["#dc2626", "#b91c1c", "#7f1d1d"], accent: "#f87171",
    desc: "Online Store", preview: { bg: "linear-gradient(135deg,#dc2626,#7f1d1d)", avatar: "🛒", buttons: ["🛍️ Boutique", "📱 WhatsApp"] }
  },
  {
    id: "xmas-1", name: "Noël", category: "Festival", isPro: true,
    colors: ["#15803d", "#166534", "#14532d"], accent: "#ef4444",
    desc: "Merry Christmas", preview: { bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", avatar: "🎄", buttons: ["🎁 Shop", "🎅 Contact"] }
  },
  {
    id: "blue-1", name: "Océan Bleu", category: "Carte de visite", isPro: false,
    colors: ["#1e3a5f", "#1e40af", "#2563eb"], accent: "#60a5fa",
    desc: "Business Manager", preview: { bg: "linear-gradient(135deg,#1e3a5f,#2563eb)", avatar: "💼", buttons: ["🌐 Website", "📧 Email"] }
  },
  {
    id: "fashion-1", name: "Fashion Queen", category: "Animation", isPro: true,
    colors: ["#7c3aed", "#6d28d9", "#5b21b6"], accent: "#c4b5fd",
    desc: "Influenceuse Mode", preview: { bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", avatar: "👑", buttons: ["🌐 Website", "📝 Blog"] }
  },
  {
    id: "food-1", name: "Restaurant", category: "Alimentation", isPro: false,
    colors: ["#92400e", "#78350f", "#451a03"], accent: "#f59e0b",
    desc: "Chef & Restaurant", preview: { bg: "linear-gradient(135deg,#92400e,#451a03)", avatar: "🍽️", buttons: ["📋 Menu", "📞 Réserver"] }
  },
  {
    id: "halloween-1", name: "Halloween", category: "Festival", isPro: true,
    colors: ["#78350f", "#92400e", "#b45309"], accent: "#f97316",
    desc: "Happy Halloween", preview: { bg: "linear-gradient(135deg,#1c1917,#292524)", avatar: "🎃", buttons: ["🛍️ Shop", "📧 Contact"] }
  },
  {
    id: "creative-1", name: "Créatif Rose", category: "Créatif", isPro: false,
    colors: ["#be185d", "#9d174d", "#831843"], accent: "#f472b6",
    desc: "Creative Studio", preview: { bg: "linear-gradient(135deg,#fdf2f8,#fce7f3)", avatar: "🎨", buttons: ["🖼️ Portfolio", "💬 Contact"] }
  },
  {
    id: "dev-1", name: "Développeur Sombre", category: "Carte de visite", isPro: false,
    colors: ["#0f172a", "#1e293b", "#334155"], accent: "#38bdf8",
    desc: "Software Developer", preview: { bg: "linear-gradient(135deg,#0f172a,#334155)", avatar: "💻", buttons: ["🌐 GitHub", "💼 LinkedIn"] }
  },
  {
    id: "music-2", name: "Cristmas Party", category: "Festival", isPro: true,
    colors: ["#14532d", "#166534", "#15803d"], accent: "#ef4444",
    desc: "Christmas Event", preview: { bg: "linear-gradient(135deg,#fef2f2,#fee2e2)", avatar: "🎄", buttons: ["🎵 Spotify", "🎵 Apple Music"] }
  },
  {
    id: "boutique-2", name: "V&M Store", category: "Boutique", isPro: true,
    colors: ["#0c4a6e", "#075985", "#0369a1"], accent: "#38bdf8",
    desc: "Clothing Store", preview: { bg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)", avatar: "👗", buttons: ["🛍️ Online Store", "📞 Contact"] }
  },
];

function TemplateCard({ tpl, onUse }: { tpl: typeof TEMPLATES[0]; onUse: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border/50 shadow-card cursor-pointer group transition-all hover:shadow-blue hover:scale-[1.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Premium badge */}
      {tpl.isPro && (
        <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
          <Crown className="w-3.5 h-3.5 text-amber-900" />
        </div>
      )}

      {/* Preview */}
      <div className="h-48 p-4 flex flex-col items-center justify-start gap-2" style={{ background: tpl.preview.bg }}>
        <div className="mt-2 text-3xl">{tpl.preview.avatar}</div>
        <p className="text-white font-bold text-sm text-center drop-shadow">{tpl.name}</p>
        <p className="text-white/70 text-xs text-center">{tpl.desc}</p>
        <div className="w-full space-y-1.5 mt-1">
          {tpl.preview.buttons.slice(0, 2).map((btn, i) => (
            <div key={i} className="w-full py-1.5 px-3 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs text-center">
              {btn}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-card">
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

      {/* Hover overlay */}
      {hovered && (
        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center transition-all">
          <button
            onClick={onUse}
            className="px-6 py-2.5 bg-white text-foreground rounded-xl font-semibold text-sm shadow-lg hover:bg-primary hover:text-white transition-colors"
          >
            Utiliser ce modèle
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardTemplates({ profile }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === "Tous" || t.category === activeCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🎨</span>
          <div>
            <h2 className="font-dm font-bold text-lg text-foreground">Modèles de page</h2>
            <p className="text-sm text-muted-foreground">Choisis un template et personalise-le en quelques secondes</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un modèle..."
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
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
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-foreground">Aucun modèle trouvé</p>
          <p className="text-sm text-muted-foreground mt-1">Essaie une autre catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tpl => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              onUse={() => {
                // Template application would require profile update
                alert(`Le modèle "${tpl.name}" sera bientôt applicable en un clic !`);
              }}
            />
          ))}
        </div>
      )}

      {/* Pro CTA */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 text-center">
        <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="font-dm font-bold text-base text-foreground mb-1">Accède à tous les modèles Pro</h3>
        <p className="text-sm text-muted-foreground mb-4">Débloque les modèles animés, boutiques et festivals avec le plan Premium</p>
        <button className="px-6 py-2.5 gradient-cta text-primary-foreground rounded-xl font-semibold text-sm shadow-blue">
          Passer à Premium 👑
        </button>
      </div>
    </div>
  );
}
