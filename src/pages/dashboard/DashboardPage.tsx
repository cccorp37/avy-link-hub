import { useState } from "react";
import { Camera, Save, Loader2, Copy, Check, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile | null;
  onUpdate: (updates: Partial<Profile>) => Promise<void>;
}

export default function DashboardPage({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    display_name: profile?.display_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
  });

  const profileUrl = profile?.username ? `${window.location.origin}/u/${profile.username}` : null;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    toast({ title: "✅ Profil mis à jour !", description: "Tes informations ont bien été sauvegardées." });
  };

  const copyUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Profile URL */}
      {profileUrl && (
        <div className="glass-blue rounded-2xl p-4 flex items-center gap-3">
          <Globe className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm font-medium text-foreground flex-1 truncate">{profileUrl}</span>
          <Button size="sm" variant="ghost" className="text-primary gap-1 flex-shrink-0" onClick={copyUrl}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copié !" : "Copier"}
          </Button>
        </div>
      )}

      {/* Avatar section */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">Photo de profil</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-blue">
              {(form.display_name || form.username || "U")[0].toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Ajoute une photo de profil</p>
            <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 5MB.</p>
            <button className="text-xs text-primary hover:underline font-medium">
              Choisir une photo
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
        <h3 className="font-dm font-bold text-base text-foreground">Informations du profil</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nom affiché</label>
            <Input
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
              placeholder="Kofi Asante"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Nom d'utilisateur <span className="text-muted-foreground">(URL)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
              <Input
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                placeholder="kofi"
                className="pl-8 rounded-xl"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">avylink.app/u/{form.username || "..."}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Parle de toi en quelques mots..."
            rows={3}
            maxLength={160}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <p className="text-xs text-muted-foreground text-right">{form.bio.length}/160</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Site web</label>
          <Input
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            placeholder="https://tonsite.com"
            type="url"
            className="rounded-xl"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full gradient-cta text-primary-foreground rounded-xl font-semibold shadow-blue"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>

      {/* Preview card */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">Aperçu du profil</h3>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold shadow-blue">
            {(form.display_name || form.username || "?")[0].toUpperCase()}
          </div>
          <div className="text-center">
            <p className="font-dm font-bold text-lg text-foreground">{form.display_name || "Ton nom"}</p>
            {form.username && <p className="text-sm text-muted-foreground">@{form.username}</p>}
            {form.bio && <p className="text-sm text-foreground/70 mt-1 max-w-xs">{form.bio}</p>}
          </div>
        </div>
        {profile?.username && (
          <a
            href={`/u/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline"
          >
            Voir la page complète →
          </a>
        )}
      </div>
    </div>
  );
}
