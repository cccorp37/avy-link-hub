import { useState, useMemo } from "react";
import { Download, Copy, Check, Search, FileCode, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// ─── All source files are listed here with their paths ───
// The actual content is embedded at build-time as raw strings

const FILE_CONTENTS: Record<string, string> = {};

// We use import.meta.glob to load all source files
// Since we can't do that easily, we'll list the file structure and provide a download mechanism

const FILE_TREE = [
  "index.html",
  "vite.config.ts",
  "tailwind.config.ts",
  "src/main.tsx",
  "src/App.tsx",
  "src/App.css",
  "src/index.css",
  "src/lib/utils.ts",
  "src/lib/supabase-auth.ts",
  "src/lib/metadata.ts",
  "src/hooks/useAuth.tsx",
  "src/hooks/useAdmin.tsx",
  "src/hooks/use-mobile.tsx",
  "src/hooks/use-toast.ts",
  "src/integrations/lovable/index.ts",
  "src/integrations/supabase/client.ts",
  "src/integrations/supabase/types.ts",
  "src/components/Navbar.tsx",
  "src/components/Hero.tsx",
  "src/components/Features.tsx",
  "src/components/ProfileDemo.tsx",
  "src/components/Pricing.tsx",
  "src/components/Reviews.tsx",
  "src/components/CTA.tsx",
  "src/components/Footer.tsx",
  "src/components/AuthModal.tsx",
  "src/components/SocialIcon.tsx",
  "src/components/NavLink.tsx",
  "src/components/dashboard/DashboardSidebar.tsx",
  "src/components/dashboard/DashboardTopbar.tsx",
  "src/components/dashboard/MobileBottomNav.tsx",
  "src/pages/Index.tsx",
  "src/pages/Dashboard.tsx",
  "src/pages/PublicProfile.tsx",
  "src/pages/NotFound.tsx",
  "src/pages/admin/AdminLayout.tsx",
  "src/pages/admin/AdminOverview.tsx",
  "src/pages/admin/AdminUsers.tsx",
  "src/pages/admin/AdminLinks.tsx",
  "src/pages/admin/AdminAnalytics.tsx",
  "src/pages/admin/AdminSourceCode.tsx",
  "src/pages/dashboard/DashboardOverview.tsx",
  "src/pages/dashboard/DashboardPage.tsx",
  "src/pages/dashboard/DashboardLinks.tsx",
  "src/pages/dashboard/DashboardAppearance.tsx",
  "src/pages/dashboard/DashboardAnalytics.tsx",
  "src/pages/dashboard/DashboardSettings.tsx",
  "src/pages/dashboard/DashboardTemplates.tsx",
  "src/pages/dashboard/DashboardIntegrations.tsx",
  "src/pages/dashboard/DashboardFormMessages.tsx",
  "src/pages/dashboard/DashboardAdvancedSettings.tsx",
  "supabase/functions/extract-metadata/index.ts",
];

// This component displays file tree and provides a note that the full code
// can be viewed in the Lovable code editor
export default function AdminSourceCode() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(["src", "src/components", "src/pages", "src/pages/admin", "src/pages/dashboard", "src/hooks", "src/lib"]));

  const filtered = useMemo(() => {
    if (!search) return FILE_TREE;
    return FILE_TREE.filter(f => f.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Build tree structure
  const tree = useMemo(() => {
    const dirs: Record<string, string[]> = {};
    filtered.forEach(f => {
      const parts = f.split("/");
      const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
      if (!dirs[dir]) dirs[dir] = [];
      dirs[dir].push(parts[parts.length - 1]);
    });
    return dirs;
  }, [filtered]);

  const toggleDir = (dir: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  };

  const handleCopyList = () => {
    const text = FILE_TREE.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "📋 Liste des fichiers copiée !" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStructure = () => {
    const content = [
      "╔════════════════════════════════════════════════════════════════════╗",
      "║           AVYLINK — STRUCTURE COMPLÈTE DU PROJET                  ║",
      "║           Généré le " + new Date().toLocaleDateString("fr-FR") + "                              ║",
      "╚════════════════════════════════════════════════════════════════════╝",
      "",
      "📊 STATISTIQUES DU PROJET",
      "─".repeat(60),
      `Total fichiers source : ${FILE_TREE.length}`,
      `Framework : React + TypeScript + Vite`,
      `CSS : Tailwind CSS + Design System custom`,
      `Backend : Lovable Cloud (Supabase)`,
      `Auth : Email/Password + Google OAuth + Apple OAuth`,
      `PWA : Oui (vite-plugin-pwa)`,
      "",
      "📁 ARBORESCENCE COMPLÈTE",
      "─".repeat(60),
      ...FILE_TREE.map(f => `  ${f}`),
      "",
      "─".repeat(60),
      "",
      "🏗️ ARCHITECTURE",
      "─".repeat(60),
      "",
      "PAGES PUBLIQUES :",
      "  / ........................ Landing page (Hero, Features, Pricing, Reviews, CTA, Footer)",
      "  /u/:username ............. Profil public utilisateur",
      "",
      "DASHBOARD UTILISATEUR (/dashboard/*) :",
      "  /dashboard ............... Vue d'ensemble + stats",
      "  /dashboard/page .......... Éditeur de page (profil, blocs)",
      "  /dashboard/liens ......... Gestion des liens",
      "  /dashboard/modeles ....... Templates de page",
      "  /dashboard/apparence ..... Thèmes, boutons, polices",
      "  /dashboard/integrations .. Connexion de services",
      "  /dashboard/analytics ..... Vues, clics, CTR",
      "  /dashboard/parametres .... Compte, SEO, notifications",
      "",
      "ADMIN (/admin/*) — accès restreint :",
      "  /admin ................... Vue d'ensemble plateforme",
      "  /admin/users ............. Gestion utilisateurs",
      "  /admin/links ............. Modération liens",
      "  /admin/analytics ......... Stats globales",
      "  /admin/source-code ....... Ce document",
      "",
      "📦 TABLES DE DONNÉES",
      "─".repeat(60),
      "  profiles ................. Données utilisateur (nom, bio, avatar, plan, thème...)",
      "  profile_links ............ Liens des utilisateurs",
      "  page_blocks .............. Blocs de contenu (vidéo, musique, formulaire...)",
      "  page_views ............... Vues de page",
      "  link_clicks .............. Clics sur les liens",
      "  form_submissions ......... Soumissions de formulaires",
      "  user_roles ............... Rôles (admin, moderator, user)",
      "",
      "🎨 DESIGN SYSTEM",
      "─".repeat(60),
      "  Couleurs primaires : Sky Blue (#0EAAF0) + Rose accent (#F2608A)",
      "  Polices : DM Sans (titres) + Inter (corps)",
      "  Composants : shadcn/ui personnalisés",
      "  Animations : framer-motion",
      "  Thèmes : Clair + Sombre",
      "",
      "🔐 SÉCURITÉ",
      "─".repeat(60),
      "  - RLS activé sur toutes les tables",
      "  - Rôles admin via table user_roles séparée",
      "  - Fonction has_role() en SECURITY DEFINER",
      "  - Auth OAuth via Lovable Cloud",
      "",
      "─".repeat(60),
      "  © 2026 AvyLink — Tous droits réservés",
      "─".repeat(60),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avylink-architecture-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 Document téléchargé !" });
  };

  const allDirs = [...new Set(FILE_TREE.map(f => {
    const parts = f.split("/");
    return parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
  }))].sort();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div>
          <h2 className="font-dm font-bold text-2xl text-foreground flex items-center gap-2">
            <FileCode className="w-6 h-6 text-primary" />
            Code Source du Projet
          </h2>
          <p className="text-sm text-muted-foreground">{FILE_TREE.length} fichiers · Architecture complète d'AvyLink</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCopyList} variant="outline" size="sm" className="rounded-xl gap-2">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "Copier la liste"}
          </Button>
          <Button onClick={handleDownloadStructure} size="sm" className="gradient-cta text-primary-foreground rounded-xl gap-2">
            <Download className="w-4 h-4" />
            Télécharger le document
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un fichier..."
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Fichiers", value: FILE_TREE.length, emoji: "📄" },
          { label: "Composants", value: FILE_TREE.filter(f => f.includes("/components/")).length, emoji: "🧩" },
          { label: "Pages", value: FILE_TREE.filter(f => f.includes("/pages/")).length, emoji: "📱" },
          { label: "Hooks & Libs", value: FILE_TREE.filter(f => f.includes("/hooks/") || f.includes("/lib/")).length, emoji: "⚙️" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 shadow-card p-4 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="font-dm font-bold text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* File tree */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            📁 Arborescence du projet
          </p>
          <span className="text-xs text-muted-foreground">{filtered.length} fichiers</span>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {allDirs.map(dir => {
            const filesInDir = filtered.filter(f => {
              const parts = f.split("/");
              const fDir = parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
              return fDir === dir;
            });
            if (filesInDir.length === 0) return null;
            const isExpanded = expandedDirs.has(dir);

            return (
              <div key={dir}>
                <button
                  onClick={() => toggleDir(dir)}
                  className="w-full flex items-center gap-2 px-5 py-2.5 hover:bg-secondary/40 transition-colors border-b border-border/20"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  <span className="text-xs font-bold text-foreground">{dir === "." ? "racine" : dir}/</span>
                  <span className="text-xs text-muted-foreground ml-auto">{filesInDir.length}</span>
                </button>
                {isExpanded && filesInDir.map(f => {
                  const fileName = f.split("/").pop()!;
                  const ext = fileName.split(".").pop();
                  const extColor = ext === "tsx" ? "text-primary" : ext === "ts" ? "text-emerald-500" : ext === "css" ? "text-violet-500" : ext === "html" ? "text-orange-500" : "text-muted-foreground";
                  return (
                    <div key={f} className="flex items-center gap-3 pl-10 pr-5 py-2 hover:bg-secondary/20 transition-colors border-b border-border/10">
                      <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${extColor}`} />
                      <span className="text-sm font-mono text-foreground">{fileName}</span>
                      <span className={`text-[10px] font-bold uppercase ml-auto ${extColor}`}>{ext}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="bg-foreground/95 rounded-2xl overflow-hidden border border-border/50 shadow-lg">
        <div className="px-5 py-3 flex items-center justify-between border-b border-white/10">
          <span className="text-xs text-white/50 font-mono">architecture.md</span>
        </div>
        <pre className="p-5 text-sm text-white/70 font-mono whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto selection:bg-primary/30">
{`┌─────────────────────────────────────────────────────┐
│                    AVYLINK                           │
│            Architecture de l'application             │
└─────────────────────────────────────────────────────┘

🌐 FRONTEND (React + TypeScript + Vite)
├── Landing Page (/)
│   ├── Navbar ........... Navigation fixe + auth
│   ├── Hero ............. Section héroïque animée
│   ├── Features ......... Bento grid des fonctionnalités
│   ├── ProfileDemo ...... Maquette téléphone interactive
│   ├── Pricing .......... Grille tarifaire FCFA/USD
│   ├── CTA .............. Témoignages + appel à l'action
│   ├── Reviews .......... Avis clients masonry
│   └── Footer ........... Newsletter + liens
│
├── Dashboard (/dashboard/*)
│   ├── Sidebar .......... Nav latérale collapsable
│   ├── Overview ......... Stats + graphiques
│   ├── Page Editor ...... Profil + blocs de contenu
│   ├── Links ............ Gestion des liens
│   ├── Templates ........ Modèles de page
│   ├── Appearance ....... Thème, boutons, polices
│   ├── Integrations ..... Services externes
│   ├── Analytics ........ Vues, clics, CTR
│   └── Settings ......... Compte, SEO, notifications
│
├── Admin (/admin/*) — Accès restreint
│   ├── Overview ......... Stats plateforme
│   ├── Users ............ Gestion utilisateurs
│   ├── Links ............ Modération liens
│   ├── Analytics ........ Graphiques globaux
│   └── Source Code ...... Ce document
│
└── Profil Public (/u/:username)
    ├── Cover + Avatar
    ├── Bio + Social
    ├── Blocs de contenu
    └── Liens enrichis (YouTube, Spotify, TikTok...)

☁️ BACKEND (Lovable Cloud)
├── Auth ................ Email + Google + Apple OAuth
├── Database ............ PostgreSQL avec RLS
├── Storage ............. Avatars + Covers
└── Edge Functions ...... extract-metadata

🔒 SÉCURITÉ
├── RLS sur toutes les tables
├── Rôles admin via user_roles séparé
├── has_role() SECURITY DEFINER
└── Pas de credentials côté client`}
        </pre>
      </div>

      {/* Info note */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <h3 className="font-dm font-semibold text-sm text-foreground mb-1">Accéder au code complet</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le code source complet est accessible via l'éditeur de code Lovable (bouton "Code" en haut à gauche de l'interface).
              Vous pouvez aussi connecter votre dépôt GitHub dans les paramètres pour obtenir une copie complète.
              Le bouton "Télécharger" ci-dessus génère un document d'architecture détaillé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
