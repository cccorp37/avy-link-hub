import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const THEMES = [
  { id: "default", name: "Classique", bg: "bg-white", accent: "bg-primary", preview: "linear-gradient(135deg,#fff 60%,#e6f4fd)" },
  { id: "dark", name: "Sombre", bg: "bg-gray-900", accent: "bg-primary", preview: "linear-gradient(135deg,#1a1a1a,#2d2d2d)" },
  { id: "rose", name: "Rose", bg: "bg-rose-50", accent: "bg-rose-500", preview: "linear-gradient(135deg,#fff0f6,#ffccdd)" },
  { id: "ocean", name: "Océan", bg: "bg-blue-50", accent: "bg-blue-600", preview: "linear-gradient(135deg,#f0f8ff,#cce5ff)" },
  { id: "forest", name: "Forêt", bg: "bg-green-50", accent: "bg-green-600", preview: "linear-gradient(135deg,#f0fff4,#ccf0d4)" },
  { id: "sunset", name: "Coucher", bg: "bg-orange-50", accent: "bg-orange-500", preview: "linear-gradient(135deg,#fff8f0,#ffddbb)" },
];

const BUTTON_STYLES = [
  { id: "rounded", label: "Arrondi", cls: "rounded-xl" },
  { id: "pill", label: "Pilule", cls: "rounded-full" },
  { id: "square", label: "Carré", cls: "rounded-md" },
  { id: "sharp", label: "Sharp", cls: "rounded-none" },
];

const FONT_STYLES = [
  { id: "inter", label: "Inter", style: { fontFamily: "Inter, sans-serif" } },
  { id: "dm", label: "DM Sans", style: { fontFamily: "DM Sans, sans-serif" } },
  { id: "mono", label: "Mono", style: { fontFamily: "JetBrains Mono, monospace" } },
];

export default function DashboardAppearance({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme || "default");
  const [selectedButton, setSelectedButton] = useState(profile?.button_style || "rounded");
  const [selectedFont, setSelectedFont] = useState(profile?.font_style || "inter");

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ theme: selectedTheme, button_style: selectedButton, font_style: selectedFont });
    setSaving(false);
    toast({ title: "✅ Apparence sauvegardée !" });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Themes */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">🎨 Thème de couleur</h3>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                selectedTheme === theme.id ? "border-primary shadow-blue" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="h-16 w-full" style={{ background: theme.preview }} />
              <div className="p-2 bg-card">
                <p className="text-xs font-medium text-foreground text-center">{theme.name}</p>
              </div>
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Button style */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">🔘 Style des boutons</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUTTON_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedButton(style.id)}
              className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${
                selectedButton === style.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`w-full py-2 px-3 gradient-cta text-primary-foreground text-xs font-semibold text-center ${style.cls}`}>
                Lien
              </div>
              <span className="text-xs text-muted-foreground">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">🔤 Police de caractères</h3>
        <div className="grid grid-cols-3 gap-3">
          {FONT_STYLES.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                selectedFont === font.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <p className="text-lg font-bold text-foreground mb-1" style={font.style}>Aa</p>
              <p className="text-xs text-muted-foreground">{font.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">👁️ Aperçu</h3>
        <div
          className="rounded-2xl overflow-hidden border border-border"
          style={{ background: THEMES.find(t => t.id === selectedTheme)?.preview || "#fff" }}
        >
          <div className="flex flex-col items-center gap-3 py-8 px-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {(profile?.display_name || "A")[0].toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={FONT_STYLES.find(f => f.id === selectedFont)?.style}>
                {profile?.display_name || "Ton nom"}
              </p>
              <p className="text-sm text-muted-foreground">{profile?.bio || "Ta bio ici"}</p>
            </div>
            <div className="w-full space-y-2 mt-2">
              {["Mon Instagram", "Ma chaîne YouTube", "Mon site"].map((label) => (
                <div
                  key={label}
                  className={`w-full py-3 px-4 gradient-cta text-primary-foreground text-sm font-semibold text-center ${
                    BUTTON_STYLES.find(b => b.id === selectedButton)?.cls || "rounded-xl"
                  }`}
                  style={FONT_STYLES.find(f => f.id === selectedFont)?.style}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}
        className="w-full gradient-cta text-primary-foreground rounded-xl font-semibold shadow-blue">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        {saving ? "Sauvegarde..." : "Sauvegarder l'apparence"}
      </Button>
    </div>
  );
}
