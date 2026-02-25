import { useState } from "react";
import { Download, FileCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const FILE_LIST = [
  { path: "index.html", lines: 47 },
  { path: "vite.config.ts", lines: 60 },
  { path: "tailwind.config.ts", lines: 161 },
  { path: "src/main.tsx", lines: 5 },
  { path: "src/App.tsx", lines: 36 },
  { path: "src/index.css", lines: 234 },
  { path: "src/lib/utils.ts", lines: 6 },
  { path: "src/lib/supabase-auth.ts", lines: 30 },
  { path: "src/lib/metadata.ts", lines: 81 },
  { path: "src/hooks/useAuth.tsx", lines: 78 },
  { path: "src/hooks/useAdmin.tsx", lines: 27 },
  { path: "src/hooks/use-mobile.tsx", lines: 19 },
  { path: "src/components/Navbar.tsx", lines: 148 },
  { path: "src/components/Hero.tsx", lines: 261 },
  { path: "src/components/Features.tsx", lines: 163 },
  { path: "src/components/ProfileDemo.tsx", lines: 227 },
  { path: "src/components/Pricing.tsx", lines: 275 },
  { path: "src/components/Reviews.tsx", lines: 150 },
  { path: "src/components/CTA.tsx", lines: 146 },
  { path: "src/components/Footer.tsx", lines: 100 },
  { path: "src/components/AuthModal.tsx", lines: 331 },
  { path: "src/components/SocialIcon.tsx", lines: 204 },
  { path: "src/components/NavLink.tsx", lines: 28 },
  { path: "src/components/dashboard/DashboardSidebar.tsx", lines: 200 },
  { path: "src/components/dashboard/DashboardTopbar.tsx", lines: 56 },
  { path: "src/components/dashboard/MobileBottomNav.tsx", lines: 40 },
  { path: "src/pages/Index.tsx", lines: 27 },
  { path: "src/pages/Dashboard.tsx", lines: 185 },
  { path: "src/pages/PublicProfile.tsx", lines: 467 },
  { path: "src/pages/NotFound.tsx", lines: 24 },
  { path: "src/pages/admin/AdminLayout.tsx", lines: 152 },
  { path: "src/pages/admin/AdminOverview.tsx", lines: 98 },
  { path: "src/pages/admin/AdminUsers.tsx", lines: 198 },
  { path: "src/pages/admin/AdminLinks.tsx", lines: 102 },
  { path: "src/pages/admin/AdminAnalytics.tsx", lines: 134 },
  { path: "src/pages/admin/AdminSourceCode.tsx", lines: 100 },
  { path: "src/pages/dashboard/DashboardOverview.tsx", lines: 222 },
  { path: "src/pages/dashboard/DashboardPage.tsx", lines: 729 },
  { path: "src/pages/dashboard/DashboardLinks.tsx", lines: 238 },
  { path: "src/pages/dashboard/DashboardAppearance.tsx", lines: 159 },
  { path: "src/pages/dashboard/DashboardAnalytics.tsx", lines: 206 },
  { path: "src/pages/dashboard/DashboardSettings.tsx", lines: 221 },
  { path: "src/pages/dashboard/DashboardTemplates.tsx", lines: 284 },
  { path: "src/pages/dashboard/DashboardIntegrations.tsx", lines: 260 },
  { path: "src/pages/dashboard/DashboardFormMessages.tsx", lines: 91 },
  { path: "src/pages/dashboard/DashboardAdvancedSettings.tsx", lines: 276 },
  { path: "supabase/functions/extract-metadata/index.ts", lines: 266 },
];

// The full source code content is fetched from the Vite dev server at build time
// For the downloadable document, we use the raw source files via import.meta.glob
const modules = import.meta.glob(
  [
    "/index.html",
    "/vite.config.ts",
    "/tailwind.config.ts",
    "/src/**/*.{tsx,ts,css}",
    "/supabase/functions/**/*.ts",
  ],
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

export default function AdminSourceCode() {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    const sep = "\n" + "=".repeat(80) + "\n";
    const lines: string[] = [];

    lines.push("=".repeat(80));
    lines.push("  AVYLINK - CODE SOURCE COMPLET DE L'APPLICATION");
    lines.push("  Genere le " + new Date().toLocaleDateString("fr-FR"));
    lines.push("=".repeat(80));
    lines.push("");

    // Sort module keys for consistent ordering
    const sortedKeys = Object.keys(modules).sort((a, b) => {
      // Root files first, then src/, then supabase/
      const order = (p: string) => p.startsWith("/src/") ? 1 : p.startsWith("/supabase/") ? 2 : 0;
      return order(a) - order(b) || a.localeCompare(b);
    });

    lines.push("FICHIERS INCLUS : " + sortedKeys.length);
    lines.push("");
    sortedKeys.forEach((key, i) => {
      lines.push("  " + (i + 1) + ". " + key.replace(/^\//, ""));
    });
    lines.push("");
    lines.push("-".repeat(80));

    for (const key of sortedKeys) {
      const content = modules[key];
      if (typeof content !== "string") continue;

      const filePath = key.replace(/^\//, "");
      lines.push(sep);
      lines.push("FICHIER : " + filePath);
      lines.push("-".repeat(80));
      lines.push("");
      lines.push(content);
      lines.push("");
    }

    lines.push(sep);
    lines.push("(c) 2026 AvyLink - Tous droits reserves");
    lines.push("=".repeat(80));

    const fullContent = lines.join("\n");
    const blob = new Blob([fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avylink-code-source-complet-" + new Date().toISOString().split("T")[0] + ".txt";
    a.click();
    URL.revokeObjectURL(url);

    setDownloading(false);
    toast({ title: "Telecharge !", description: "Le code source complet a ete enregistre." });
  };

  const totalFiles = Object.keys(modules).length;
  const totalLines = Object.values(modules).reduce((acc, content) => {
    return acc + (typeof content === "string" ? content.split("\n").length : 0);
  }, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-dm font-bold text-2xl text-foreground flex items-center gap-2">
          <FileCode className="w-6 h-6 text-primary" />
          Code Source Complet
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tous les fichiers du projet dans un seul document telechargeable.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Fichiers", value: totalFiles, emoji: "📄" },
          { label: "Lignes de code", value: totalLines.toLocaleString(), emoji: "📝" },
          { label: "Format", value: ".TXT", emoji: "📦" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 shadow-card p-4 text-center">
            <div className="text-2xl mb-1">{s.emoji}</div>
            <div className="font-dm font-bold text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-8 text-center space-y-4">
        <div className="text-5xl">📥</div>
        <h3 className="font-dm font-bold text-xl text-foreground">
          Telecharger tout le code source
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Un seul fichier .txt contenant le code complet de tous les fichiers,
          separes par des lignes de traits.
        </p>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="lg"
          className="gradient-cta text-primary-foreground rounded-2xl font-bold text-base px-10 py-6 shadow-blue hover:shadow-blue-lg transition-all"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          Telecharger le document complet
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Fichiers inclus dans le document ({totalFiles})
          </p>
        </div>
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-border/20">
          {Object.keys(modules).sort().map((key) => {
            const filePath = key.replace(/^\//, "");
            const content = modules[key];
            const lineCount = typeof content === "string" ? content.split("\n").length : 0;
            const ext = filePath.split(".").pop();
            const extColor = ext === "tsx" ? "text-primary" : ext === "ts" ? "text-emerald-500" : ext === "css" ? "text-violet-500" : ext === "html" ? "text-orange-500" : "text-muted-foreground";
            return (
              <div key={key} className="flex items-center gap-3 px-5 py-2.5 hover:bg-secondary/20 transition-colors">
                <FileCode className={"w-4 h-4 flex-shrink-0 " + extColor} />
                <span className="text-sm font-mono text-foreground flex-1 truncate">{filePath}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{lineCount} lignes</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
