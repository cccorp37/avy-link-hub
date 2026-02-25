import { useState } from "react";
import { Check, Loader2, Save, Palette, Type, MousePointer2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const THEMES = [
  { id: "default", name: "Classique", preview: "linear-gradient(135deg,#fff 60%,#e6f4fd)", emoji: "☀️" },
  { id: "dark", name: "Sombre", preview: "linear-gradient(135deg,#1a1a1a,#2d2d2d)", emoji: "🌙" },
  { id: "rose", name: "Rose", preview: "linear-gradient(135deg,#fff0f6,#ffccdd)", emoji: "🌸" },
  { id: "ocean", name: "Océan", preview: "linear-gradient(135deg,#f0f8ff,#cce5ff)", emoji: "🌊" },
  { id: "forest", name: "Forêt", preview: "linear-gradient(135deg,#f0fff4,#ccf0d4)", emoji: "🌲" },
  { id: "sunset", name: "Coucher", preview: "linear-gradient(135deg,#fff8f0,#ffddbb)", emoji: "🌅" },
];

const BUTTON_STYLES = [
  { id: "rounded", label: "Arrondi", cls: "rounded-xl" },
  { id: "pill", label: "Pilule", cls: "rounded-full" },
  { id: "square", label: "Carré", cls: "rounded-md" },
  { id: "sharp", label: "Sharp", cls: "rounded-none" },
];

const FONT_STYLES = [
  { id: "inter", label: "Inter", style: { fontFamily: "Inter, sans-serif" }, desc: "Moderne" },
  { id: "dm", label: "DM Sans", style: { fontFamily: "DM Sans, sans-serif" }, desc: "Élégant" },
  { id: "mono", label: "Mono", style: { fontFamily: "JetBrains Mono, monospace" }, desc: "Technique" },
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
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Themes */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-border/40 shadow-card p-5 relative overflow-hidden"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.03] -translate-y-1/2 translate-x-1/4"
          style={{ background: "var(--gradient-primary)" }} />
        <div className="flex items-center gap-2.5 mb-5 relative">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <Palette className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-dm font-bold text-base text-foreground">Thème de couleur</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((theme, i) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${
                selectedTheme === theme.id ? "border-primary shadow-blue ring-2 ring-primary/10" : "border-border/40 hover:border-primary/30"
              }`}
            >
              <div className="h-16 w-full relative" style={{ background: theme.preview }}>
                <span className="absolute top-2 left-2 text-lg">{theme.emoji}</span>
              </div>
              <div className="p-2.5 bg-card">
                <p className="text-xs font-semibold text-foreground text-center">{theme.name}</p>
              </div>
              {selectedTheme === theme.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-cta flex items-center justify-center shadow-sm"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Button style */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-border/40 shadow-card p-5"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl gradient-rose flex items-center justify-center shadow-sm">
            <MousePointer2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-dm font-bold text-base text-foreground">Style des boutons</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUTTON_STYLES.map((style, i) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.15 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedButton(style.id)}
              className={`flex flex-col items-center gap-2.5 p-4 border-2 rounded-2xl transition-all ${
                selectedButton === style.id ? "border-primary bg-primary/5 shadow-sm" : "border-border/40 hover:border-primary/30"
              }`}
            >
              <div className={`w-full py-2.5 px-3 gradient-cta text-primary-foreground text-xs font-semibold text-center shadow-sm ${style.cls}`}>
                Mon lien
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{style.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Font */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-border/40 shadow-card p-5"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg, hsl(43, 96%, 56%), hsl(43, 96%, 46%))" }}>
            <Type className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-dm font-bold text-base text-foreground">Police de caractères</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FONT_STYLES.map((font, i) => (
            <motion.button
              key={font.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFont(font.id)}
              className={`p-4 border-2 rounded-2xl text-center transition-all ${
                selectedFont === font.id ? "border-primary bg-primary/5 shadow-sm" : "border-border/40 hover:border-primary/30"
              }`}
            >
              <p className="text-2xl font-bold text-foreground mb-1" style={font.style}>Aa</p>
              <p className="text-xs font-semibold text-foreground">{font.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{font.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="rounded-2xl border border-border/40 shadow-card p-5"
        style={{ background: "hsl(var(--card))" }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl gradient-cta flex items-center justify-center shadow-sm">
            <Eye className="w-4 h-4 text-primary-foreground" />
          </div>
          <h3 className="font-dm font-bold text-base text-foreground">Aperçu en direct</h3>
        </div>
        <div
          className="rounded-2xl overflow-hidden border border-border/40 shadow-sm"
          style={{ background: THEMES.find(t => t.id === selectedTheme)?.preview || "#fff" }}
        >
          <div className="flex flex-col items-center gap-3 py-8 px-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-blue"
            >
              {(profile?.display_name || "A")[0].toUpperCase()}
            </motion.div>
            <div className="text-center">
              <p className="font-bold text-lg" style={FONT_STYLES.find(f => f.id === selectedFont)?.style}>
                {profile?.display_name || "Ton nom"}
              </p>
              <p className="text-sm text-muted-foreground">{profile?.bio || "Ta bio ici"}</p>
            </div>
            <div className="w-full space-y-2.5 mt-2 max-w-[280px]">
              {["Mon Instagram", "Ma chaîne YouTube", "Mon site"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  className={`w-full py-3 px-4 gradient-cta text-primary-foreground text-sm font-semibold text-center shadow-sm ${
                    BUTTON_STYLES.find(b => b.id === selectedButton)?.cls || "rounded-xl"
                  }`}
                  style={FONT_STYLES.find(f => f.id === selectedFont)?.style}
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button onClick={handleSave} disabled={saving}
            className="w-full gradient-cta text-primary-foreground rounded-xl font-semibold shadow-blue h-12 text-sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Sauvegarde..." : "Sauvegarder l'apparence"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
