import { useState } from "react";
import { Save, Loader2, LogOut, Trash2, Shield, Bell, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase-auth";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

export default function DashboardSettings({ profile, onUpdate }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ newVisitor: true, weeklyReport: true, tips: false });
  const [lang, setLang] = useState("fr");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({ title: "À bientôt ! 👋" });
  };

  const handleSaveNotifs = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "✅ Préférences sauvegardées" });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Account */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-dm font-bold text-base text-foreground">Compte</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input value={user?.email || ""} readOnly className="rounded-xl bg-muted/30 text-muted-foreground cursor-not-allowed" />
            <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié ici.</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Plan actuel</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-muted/20">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${profile?.plan === "free" ? "bg-muted text-muted-foreground" : "gradient-cta text-primary-foreground"}`}>
                {profile?.plan || "free"}
              </span>
              <span className="text-sm text-muted-foreground">
                {profile?.plan === "free" ? "Plan gratuit — limité à 5 liens" : "Accès complet"}
              </span>
              {profile?.plan === "free" && (
                <button className="ml-auto text-xs font-semibold text-primary hover:underline">
                  Upgrader →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-dm font-bold text-base text-foreground">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "newVisitor", label: "Nouveau visiteur", desc: "Quand quelqu'un visite ton profil" },
            { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Résumé de tes stats chaque semaine" },
            { key: "tips", label: "Conseils & astuces", desc: "Recommandations pour booster ton profil" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  notifs[item.key as keyof typeof notifs] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  notifs[item.key as keyof typeof notifs] ? "left-5" : "left-1"
                }`} />
              </button>
            </div>
          ))}
        </div>
        <Button onClick={handleSaveNotifs} disabled={saving} size="sm"
          className="mt-4 gradient-cta text-primary-foreground rounded-xl">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
          Sauvegarder
        </Button>
      </div>

      {/* Language */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <h3 className="font-dm font-bold text-base text-foreground">Langue</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "fr", label: "🇫🇷 Français" },
            { id: "en", label: "🇬🇧 English" },
            { id: "ar", label: "🇲🇦 العربية" },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                lang === l.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card rounded-2xl border border-destructive/20 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-destructive mb-4">⚠️ Zone dangereuse</h3>
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            onClick={() => toast({ title: "Fonctionnalité bientôt disponible", variant: "destructive" })}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer mon compte
          </Button>
        </div>
      </div>
    </div>
  );
}
