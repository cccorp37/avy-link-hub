import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, GripVertical, Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { extractMetadata, getPlatformIcon, getPlatformLabel, getPlatformColor } from "@/lib/metadata";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type ProfileLink = Tables<"profile_links">;

interface Props { profile: Profile | null; }

export default function DashboardLinks({ profile }: Props) {
  const { toast } = useToast();
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!profile) return;
    supabase.from("profile_links").select("*").eq("profile_id", profile.id)
      .order("position", { ascending: true })
      .then(({ data }) => { setLinks(data || []); setLoading(false); });
  }, [profile]);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setIsExtracting(true);
    setPreview(null);
    try {
      const meta = await extractMetadata(url.trim());
      if (meta.success) setPreview(meta as unknown as Record<string, unknown>);
      else toast({ title: "Impossible d'extraire", description: meta.error || "URL invalide", variant: "destructive" });
    } catch {
      toast({ title: "Erreur", description: "Vérifie l'URL et réessaie", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddLink = async () => {
    if (!preview || !profile) return;
    const meta = preview as { url: string; title: string; platform: string };
    const { data, error } = await supabase.from("profile_links").insert({
      profile_id: profile.id, url: meta.url,
      title: meta.title || "Lien", icon: meta.platform || "website",
      position: links.length, is_active: true,
    }).select().single();
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    if (data) {
      setLinks((prev) => [...prev, data]);
      setUrl(""); setPreview(null);
      toast({ title: "✅ Lien ajouté !" });
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("profile_links").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
    toast({ title: "Lien supprimé" });
  };

  const handleToggle = async (link: ProfileLink) => {
    const updated = !link.is_active;
    await supabase.from("profile_links").update({ is_active: updated }).eq("id", link.id);
    setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, is_active: updated } : l));
  };

  const handleEditSave = async (id: string) => {
    await supabase.from("profile_links").update({ title: editTitle }).eq("id", id);
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, title: editTitle } : l));
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      {/* Add link */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <h3 className="font-dm font-bold text-base text-foreground mb-1 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Ajouter un lien
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Colle n'importe quel lien — YouTube, Spotify, Instagram, site web...
        </p>

        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleExtract()}
          />
          <Button
            onClick={handleExtract}
            disabled={isExtracting || !url.trim()}
            className="gradient-cta text-primary-foreground rounded-xl px-4 gap-1 flex-shrink-0"
          >
            {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {isExtracting ? "..." : "Analyser"}
          </Button>
        </div>

        {/* Preview */}
        {preview && (() => {
          const meta = preview as { url: string; title: string; description: string; image: string; platform: string; siteName: string };
          const platform = meta.platform || "website";
          const icon = getPlatformIcon(platform);
          const color = getPlatformColor(platform);
          const label = getPlatformLabel(platform);
          return (
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden animate-fade-up">
              {meta.image && (
                <img src={meta.image} alt={meta.title} className="w-full h-36 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{icon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                    {label}
                  </span>
                </div>
                <p className="font-dm font-bold text-sm text-foreground mb-1 line-clamp-2">{meta.title || "Sans titre"}</p>
                {meta.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{meta.description}</p>}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gradient-cta text-primary-foreground rounded-xl" onClick={handleAddLink}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => { setPreview(null); setUrl(""); }}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Links list */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-dm font-bold text-base text-foreground">
            Mes liens <span className="text-sm text-muted-foreground font-normal">({links.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-3">🔗</div>
            <p className="font-medium text-foreground">Aucun lien pour l'instant</p>
            <p className="text-sm mt-1">Ajoute ton premier lien en collant une URL ci-dessus</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const platform = link.icon || "website";
              const icon = getPlatformIcon(platform);
              const color = getPlatformColor(platform);
              const isEditing = editingId === link.id;

              return (
                <div
                  key={link.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${link.is_active ? "bg-secondary/40 border-border/50" : "bg-muted/20 border-border/30 opacity-60"}`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 cursor-grab" />
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: `${color}15` }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-7 text-xs rounded-lg"
                          onKeyDown={(e) => e.key === "Enter" && handleEditSave(link.id)}
                          autoFocus
                        />
                        <button onClick={() => handleEditSave(link.id)} className="p-1 text-primary">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p
                          className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-primary"
                          onClick={() => { setEditingId(link.id); setEditTitle(link.title); }}
                        >
                          {link.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Toggle */}
                    <button
                      onClick={() => handleToggle(link)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${link.is_active ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${link.is_active ? "left-4" : "left-0.5"}`} />
                    </button>
                    {/* Click count */}
                    <span className="text-xs text-muted-foreground min-w-[28px] text-right">{link.click_count}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => handleDelete(link.id)} disabled={deletingId === link.id}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      {deletingId === link.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
