import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ExternalLink, Eye, GripVertical, Loader2, Link2, LogOut, User, ArrowRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase-auth";
import { supabase } from "@/integrations/supabase/client";
import { extractMetadata, getPlatformIcon, getPlatformLabel, getPlatformColor } from "@/lib/metadata";
import { useToast } from "@/hooks/use-toast";
import avylinkLogo from "@/assets/avylink-logo.jpg";
import type { Tables } from "@/integrations/supabase/types";

type ProfileLink = Tables<"profile_links">;

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  // Load profile and links
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(profileData);

      // Load links
      const { data: linksData } = await supabase
        .from("profile_links")
        .select("*")
        .eq("profile_id", profileData?.id || "")
        .order("position", { ascending: true });
      setLinks(linksData || []);
      setLoadingLinks(false);
    };
    loadData();
  }, [user]);

  const handleExtract = async () => {
    if (!url.trim()) return;
    setIsExtracting(true);
    setPreview(null);
    try {
      const meta = await extractMetadata(url.trim());
      if (meta.success) {
        setPreview(meta as unknown as Record<string, unknown>);
      } else {
        toast({ title: "Impossible d'extraire", description: meta.error || "URL invalide", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Erreur", description: "Vérifie l'URL et réessaie", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddLink = async () => {
    if (!preview || !profile) return;
    const meta = preview as {
      url: string; title: string; description: string; image: string;
      platform: string; siteName: string; favicon: string;
      embed?: { embedUrl?: string };
    };

    const position = links.length;
    const icon = meta.platform || "website";

    const { data, error } = await supabase.from("profile_links").insert({
      profile_id: profile.id,
      url: meta.url,
      title: meta.title || meta.siteName || "Lien",
      icon,
      position,
      is_active: true,
    }).select().single();

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    if (data) {
      setLinks((prev) => [...prev, data]);
      setUrl("");
      setPreview(null);
      toast({ title: "✅ Lien ajouté !", description: `"${data.title}" a été ajouté à ton profil.` });
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

  const profileUrl = profile?.username
    ? `${window.location.origin}/u/${profile.username}`
    : null;

  const copyProfileUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-white/40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={avylinkLogo} alt="AvyLink" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-dm font-bold text-base text-foreground">
              Avy<span className="text-gradient">Link</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-2">/ Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                Voir mon profil
              </a>
            )}
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-foreground truncate max-w-[140px]">
              {user?.email?.split("@")[0]}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive p-1.5"
              onClick={async () => { await signOut(); navigate("/"); }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile URL banner */}
        {profileUrl && (
          <div className="glass-blue rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground flex-1 truncate font-medium">{profileUrl}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary/80 gap-1 flex-shrink-0"
              onClick={copyProfileUrl}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié !" : "Copier"}
            </Button>
          </div>
        )}

        {/* Add link section */}
        <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 mb-6">
          <h2 className="font-dm font-bold text-lg text-foreground mb-1 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Ajouter un lien
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Colle n'importe quel lien — YouTube, Spotify, Instagram, site web...
          </p>

          {/* URL input */}
          <div className="flex gap-2 mb-4">
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
              className="gradient-cta text-primary-foreground rounded-xl px-5 gap-2 flex-shrink-0"
            >
              {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isExtracting ? "Analyse..." : "Analyser"}
            </Button>
          </div>

          {/* Preview card */}
          {preview && (
            <LinkPreviewCard
              meta={preview as Record<string, unknown>}
              onAdd={handleAddLink}
              onCancel={() => { setPreview(null); setUrl(""); }}
            />
          )}
        </div>

        {/* Links list */}
        <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-dm font-bold text-lg text-foreground">
              Mes liens
              <span className="ml-2 text-sm text-muted-foreground font-normal">({links.length})</span>
            </h2>
            {profile?.username && (
              <a
                href={`/u/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                Prévisualiser
              </a>
            )}
          </div>

          {loadingLinks ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Link2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun lien pour l'instant</p>
              <p className="text-sm mt-1">Colle ton premier lien ci-dessus pour commencer !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <LinkRow
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  isDeleting={deletingId === link.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LinkPreviewCard({
  meta,
  onAdd,
  onCancel,
}: {
  meta: Record<string, unknown>;
  onAdd: () => void;
  onCancel: () => void;
}) {
  const platform = (meta.platform as string) || "website";
  const icon = getPlatformIcon(platform);
  const label = getPlatformLabel(platform);
  const color = getPlatformColor(platform);
  const isYoutube = platform === "youtube";
  const embedData = meta.embed as Record<string, string> | undefined;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden animate-fade-up">
      {/* Image / Embed preview */}
      {isYoutube && embedData?.videoId ? (
        <div className="relative aspect-video bg-black">
          <img
            src={`https://img.youtube.com/vi/${embedData.videoId}/maxresdefault.jpg`}
            alt={meta.title as string}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[18px] border-t-transparent border-b-transparent border-l-white ml-1" />
            </div>
          </div>
        </div>
      ) : meta.image ? (
        <img
          src={meta.image as string}
          alt={meta.title as string}
          className="w-full h-40 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : null}

      <div className="p-4">
        {/* Platform badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{icon}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {label}
          </span>
          {meta.siteName && (
            <span className="text-xs text-muted-foreground">{meta.siteName as string}</span>
          )}
        </div>

        <h3 className="font-dm font-bold text-sm text-foreground mb-1 line-clamp-2">
          {(meta.title as string) || "Sans titre"}
        </h3>
        {meta.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {meta.description as string}
          </p>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gradient-cta text-primary-foreground rounded-xl" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter ce lien
          </Button>
          <Button size="sm" variant="ghost" className="rounded-xl" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  link,
  onDelete,
  onToggle,
  isDeleting,
}: {
  link: ProfileLink;
  onDelete: (id: string) => void;
  onToggle: (link: ProfileLink) => void;
  isDeleting: boolean;
}) {
  const platform = link.icon || "website";
  const icon = getPlatformIcon(platform);
  const color = getPlatformColor(platform);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
        link.is_active ? "bg-secondary/50 border-border/50" : "bg-muted/30 border-border/30 opacity-60"
      }`}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 cursor-grab" />

      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onToggle(link)}
          className={`w-8 h-5 rounded-full transition-colors relative ${
            link.is_active ? "bg-primary" : "bg-muted"
          }`}
          title={link.is_active ? "Désactiver" : "Activer"}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
              link.is_active ? "left-3.5" : "left-0.5"
            }`}
          />
        </button>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => onDelete(link.id)}
          disabled={isDeleting}
          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
        >
          {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
