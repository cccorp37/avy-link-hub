import { useState } from "react";
import { Download, FileCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const modules = import.meta.glob(
  [
    "/index.html",
    "/vite.config.ts",
    "/tailwind.config.ts",
    "/tsconfig.json",
    "/tsconfig.app.json",
    "/tsconfig.node.json",
    "/components.json",
    "/postcss.config.js",
    "/eslint.config.js",
    "/vitest.config.ts",
    "/src/**/*.{tsx,ts,css}",
    "/supabase/**/*.{ts,json,toml}",
    "!**/node_modules/**",
  ],
  { query: "?raw", import: "default", eager: true }
) as Record<string, string>;

export default function AdminSourceCode() {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const sortedKeys = Object.keys(modules).sort((a, b) => {
    const order = (p: string) => p.startsWith("/src/") ? 1 : p.startsWith("/supabase/") ? 2 : 0;
    return order(a) - order(b) || a.localeCompare(b);
  });

  const totalFiles = sortedKeys.length;
  const totalLines = Object.values(modules).reduce((acc, content) =>
    acc + (typeof content === "string" ? content.split("\n").length : 0), 0);

  const handleDownload = () => {
    setDownloading(true);

    const lines: string[] = [];
    lines.push("=".repeat(80));
    lines.push("  AVYLINK - CODE SOURCE COMPLET DE L'APPLICATION");
    lines.push("  Généré le " + new Date().toLocaleDateString("fr-FR"));
    lines.push("  Fichiers : " + totalFiles + " | Lignes : " + totalLines.toLocaleString());
    lines.push("=".repeat(80));
    lines.push("");
    lines.push("TABLE DES FICHIERS :");
    lines.push("");
    sortedKeys.forEach((key, i) => lines.push("  " + (i + 1) + ". " + key.replace(/^\//, "")));
    lines.push("");
    lines.push("-".repeat(80));

    for (const key of sortedKeys) {
      const content = modules[key];
      if (typeof content !== "string") continue;
      lines.push("");
      lines.push("=".repeat(80));
      lines.push("FICHIER : " + key.replace(/^\//, ""));
      lines.push("=".repeat(80));
      lines.push("");
      lines.push(content);
    }

    lines.push("");
    lines.push("=".repeat(80));
    lines.push("(c) 2026 AvyLink — Tous droits réservés");
    lines.push("=".repeat(80));

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avylink-code-source-complet-" + new Date().toISOString().split("T")[0] + ".txt";
    a.click();
    URL.revokeObjectURL(url);

    setDownloading(false);
    toast({ title: "Téléchargé !", description: "Le code source complet a été enregistré." });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-dm font-bold text-2xl text-foreground flex items-center gap-2">
          <FileCode className="w-6 h-6 text-primary" />
          Code Source Complet
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tous les fichiers du projet dans un seul document téléchargeable.
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
          Télécharger tout le code source
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Un seul fichier .txt contenant le code complet de tous les fichiers, séparés par des lignes de démarcation.
        </p>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="lg"
          className="gradient-cta text-primary-foreground rounded-2xl font-bold text-base px-10 py-6 shadow-blue hover:shadow-blue-lg transition-all"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
          Télécharger le document complet
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Fichiers inclus dans le document ({totalFiles})
          </p>
        </div>
        <div className="max-h-[50vh] overflow-y-auto divide-y divide-border/20">
          {sortedKeys.map((key) => {
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
