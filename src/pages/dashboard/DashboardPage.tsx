import { useState, useEffect, useRef } from "react";
import { Camera, Save, Loader2, Copy, Check, Globe, Plus, X, GripVertical, ChevronDown, ChevronUp, Trash2, Edit2, Heading, Video, Music, Link2, ClipboardList, Minus, Type, Mic, Clapperboard, Instagram, Youtube, LucideIcon } from "lucide-react";
import SocialIcon, { PLATFORM_COLORS } from "@/components/SocialIcon";
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

interface PageBlock {
  id: string;
  type: string;
  title: string | null;
  content: Record<string, unknown>;
  position: number;
  is_active: boolean;
}

const BLOCK_TYPES: { type: string; label: string; Icon: LucideIcon; iconColor: string; desc: string; preview: string }[] = [
  { type: "heading", label: "Entête", Icon: Heading, iconColor: "text-violet-500 bg-violet-100", desc: "Titre ou sous-titre de section", preview: "bg-purple-50 border-purple-200" },
  { type: "social_icons", label: "Icônes sociales", Icon: Globe, iconColor: "text-sky-500 bg-sky-100", desc: "Facebook, Instagram, Twitter, TikTok...", preview: "bg-blue-50 border-blue-200" },
  { type: "video", label: "Vidéo", Icon: Clapperboard, iconColor: "text-rose-500 bg-rose-100", desc: "YouTube, Vimeo, TikTok, Twitch", preview: "bg-red-50 border-red-200" },
  { type: "music", label: "La musique", Icon: Music, iconColor: "text-emerald-500 bg-emerald-100", desc: "Spotify, Apple Music, SoundCloud", preview: "bg-green-50 border-green-200" },
  { type: "group", label: "Groupe de liens", Icon: Link2, iconColor: "text-indigo-500 bg-indigo-100", desc: "Grouper plusieurs liens", preview: "bg-indigo-50 border-indigo-200" },
  { type: "form", label: "Formulaire", Icon: ClipboardList, iconColor: "text-amber-500 bg-amber-100", desc: "Collecte nom, email, message", preview: "bg-orange-50 border-orange-200" },
  { type: "divider", label: "Diviseur", Icon: Minus, iconColor: "text-gray-500 bg-gray-100", desc: "Ligne de séparation décorative", preview: "bg-gray-50 border-gray-200" },
  { type: "text", label: "Texte", Icon: Type, iconColor: "text-yellow-600 bg-yellow-100", desc: "Bloc de texte libre", preview: "bg-yellow-50 border-yellow-200" },
  { type: "podcast", label: "Podcast", Icon: Mic, iconColor: "text-pink-500 bg-pink-100", desc: "Intégrer un épisode de podcast", preview: "bg-pink-50 border-pink-200" },
  { type: "tiktok", label: "TikTok", Icon: Video, iconColor: "text-gray-800 bg-gray-200", desc: "Intégrer ta page TikTok", preview: "bg-gray-900/5 border-gray-300" },
  { type: "instagram", label: "Instagram", Icon: Instagram, iconColor: "text-fuchsia-500 bg-fuchsia-100", desc: "Grille de photos Instagram", preview: "bg-pink-50 border-pink-200" },
  { type: "youtube_sub", label: "YouTube abonné", Icon: Youtube, iconColor: "text-red-500 bg-red-100", desc: "Bouton d'abonnement YouTube", preview: "bg-red-50 border-red-200" },
];

function BlockPreviewIcon({ type }: { type: string }) {
  const b = BLOCK_TYPES.find(bt => bt.type === type);
  if (!b) return <span className="text-xl">📦</span>;
  const IconComp = b.Icon;
  return <IconComp className={`w-5 h-5 ${b.iconColor.split(" ")[0]}`} />;
}

function BlockEditor({ block, onSave, onClose }: { block: Partial<PageBlock>; onSave: (data: Partial<PageBlock>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...block });

  const updateContent = (key: string, value: unknown) => {
    setForm(f => ({ ...f, content: { ...(f.content || {}), [key]: value } }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-dm font-bold text-base">
            {BLOCK_TYPES.find(b => b.type === block.type)?.label || "Bloc"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Titre du bloc</label>
            <Input
              value={form.title || ""}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Mes réseaux sociaux"
              className="rounded-xl"
            />
          </div>

          {/* Type-specific fields */}
          {block.type === "heading" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Texte de l'entête</label>
              <Input
                value={(form.content?.text as string) || ""}
                onChange={e => updateContent("text", e.target.value)}
                placeholder="Titre principal"
                className="rounded-xl"
              />
              <div className="mt-2">
                <label className="text-sm font-medium text-foreground mb-1 block">Sous-titre</label>
                <Input
                  value={(form.content?.subtitle as string) || ""}
                  onChange={e => updateContent("subtitle", e.target.value)}
                  placeholder="Sous-titre optionnel"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {block.type === "video" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">URL de la vidéo</label>
              <Input
                value={(form.content?.url as string) || ""}
                onChange={e => updateContent("url", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground mt-1">YouTube, Vimeo, TikTok, Twitch supportés</p>
            </div>
          )}

          {block.type === "music" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">URL de la musique</label>
              <Input
                value={(form.content?.url as string) || ""}
                onChange={e => updateContent("url", e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground mt-1">Spotify, Apple Music, SoundCloud supportés</p>
            </div>
          )}

          {block.type === "podcast" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">URL du podcast</label>
              <Input
                value={(form.content?.url as string) || ""}
                onChange={e => updateContent("url", e.target.value)}
                placeholder="https://open.spotify.com/episode/..."
                className="rounded-xl"
              />
            </div>
          )}

          {block.type === "tiktok" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nom d'utilisateur TikTok</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  value={(form.content?.username as string) || ""}
                  onChange={e => updateContent("username", e.target.value)}
                  placeholder="tonpseudo"
                  className="pl-8 rounded-xl"
                />
              </div>
            </div>
          )}

          {block.type === "youtube_sub" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">ID de chaîne YouTube</label>
              <Input
                value={(form.content?.channelId as string) || ""}
                onChange={e => updateContent("channelId", e.target.value)}
                placeholder="UC..."
                className="rounded-xl"
              />
              <div className="mt-2">
                <label className="text-sm font-medium text-foreground mb-1 block">Nom de la chaîne</label>
                <Input
                  value={(form.content?.channelName as string) || ""}
                  onChange={e => updateContent("channelName", e.target.value)}
                  placeholder="Ma chaîne YouTube"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {block.type === "social_icons" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Remplis les liens de tes réseaux</p>
              {[
                { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
                { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
                { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/..." },
                { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
                { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
                { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
                { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/..." },
                { key: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/..." },
                { key: "discord", label: "Discord", placeholder: "https://discord.gg/..." },
                { key: "telegram", label: "Telegram", placeholder: "https://t.me/..." },
                { key: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/..." },
                { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
              ].map(sn => (
                <div key={sn.key} className="flex items-center gap-2">
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg" style={{ background: `${(PLATFORM_COLORS as Record<string,string>)[sn.key] || "#999"}18` }}>
                    <SocialIcon platform={sn.key} size={16} />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={((form.content as Record<string, unknown>)?.[sn.key] as string) || ""}
                      onChange={e => updateContent(sn.key, e.target.value)}
                      placeholder={sn.placeholder}
                      className="rounded-xl h-9 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}


          {block.type === "form" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Titre du formulaire</label>
                <Input
                  value={(form.content?.formTitle as string) || ""}
                  onChange={e => updateContent("formTitle", e.target.value)}
                  placeholder="Contactez-moi"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message de confirmation</label>
                <Input
                  value={(form.content?.successMessage as string) || ""}
                  onChange={e => updateContent("successMessage", e.target.value)}
                  placeholder="Merci, je vous réponds bientôt !"
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {block.type === "text" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Contenu</label>
              <textarea
                value={(form.content?.text as string) || ""}
                onChange={e => updateContent("text", e.target.value)}
                placeholder="Votre texte ici..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          )}

          {block.type === "divider" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Style du diviseur</label>
              <div className="grid grid-cols-3 gap-2">
                {["solid", "dashed", "dotted"].map(style => (
                  <button
                    key={style}
                    onClick={() => updateContent("style", style)}
                    className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all ${(form.content?.style as string) === style ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    <div className={`w-full h-0.5 bg-foreground/40 mb-1 border-t border-foreground/40 ${style === "dashed" ? "border-dashed" : style === "dotted" ? "border-dotted" : "border-solid"}`} />
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {block.type === "instagram" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Nom d'utilisateur Instagram</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  value={(form.content?.username as string) || ""}
                  onChange={e => updateContent("username", e.target.value)}
                  placeholder="tonpseudo"
                  className="pl-8 rounded-xl"
                />
              </div>
            </div>
          )}

          {block.type === "group" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description du groupe</label>
              <Input
                value={(form.content?.description as string) || ""}
                onChange={e => updateContent("description", e.target.value)}
                placeholder="Mes liens principaux"
                className="rounded-xl"
              />
            </div>
          )}
        </div>
        <div className="p-5 border-t border-border flex gap-3">
          <Button onClick={() => onSave(form)} className="flex-1 gradient-cta text-primary-foreground rounded-xl">
            <Check className="w-4 h-4 mr-2" /> Sauvegarder
          </Button>
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Annuler</Button>
        </div>
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: PageBlock }) {
  const def = BLOCK_TYPES.find(b => b.type === block.type);
  const c = block.content as Record<string, unknown>;

  if (block.type === "heading") {
    return (
      <div className="py-2">
        {c.text && <p className="font-dm font-bold text-base text-foreground">{c.text as string}</p>}
        {c.subtitle && <p className="text-sm text-muted-foreground">{c.subtitle as string}</p>}
      </div>
    );
  }
  if (block.type === "divider") {
    const style = (c.style as string) || "solid";
    return (
      <div className={`my-2 border-t border-border/50 ${style === "dashed" ? "border-dashed" : style === "dotted" ? "border-dotted" : ""}`} />
    );
  }
  if (block.type === "social_icons") {
    const networks = ["facebook","instagram","twitter","tiktok","youtube","linkedin","whatsapp","snapchat","discord","telegram","pinterest","github"];
    const filled = networks.filter(n => c[n]);
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {filled.length === 0
          ? <span className="text-xs text-muted-foreground">Aucun réseau configuré</span>
          : filled.map(n => (
            <div
              key={n}
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${PLATFORM_COLORS[n]}18` }}
            >
              <SocialIcon platform={n} size={20} />
            </div>
          ))}
      </div>
    );
  }
  if (block.type === "form") {
    return (
      <div className="space-y-2 py-1">
        <p className="text-xs font-semibold text-foreground">{(c.formTitle as string) || "Formulaire de contact"}</p>
        <div className="h-7 rounded-lg bg-muted/50 border border-border/50 text-xs px-3 flex items-center text-muted-foreground">Nom complet</div>
        <div className="h-7 rounded-lg bg-muted/50 border border-border/50 text-xs px-3 flex items-center text-muted-foreground">Email</div>
        <div className="h-7 rounded-lg bg-primary/10 border border-primary/20 text-xs px-3 flex items-center justify-center text-primary font-medium">Envoyer</div>
      </div>
    );
  }
  if (block.type === "video" || block.type === "music" || block.type === "podcast") {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${def?.iconColor.split(" ")[1] || "bg-muted"}`}>{def && <def.Icon className={`w-6 h-6 ${def.iconColor.split(" ")[0]}`} />}</div>
        <div>
          <p className="text-xs font-medium text-foreground">{block.title || def?.label}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{(c.url as string) || "URL non configurée"}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 py-1">
      {def && <def.Icon className={`w-4 h-4 ${def.iconColor.split(" ")[0]}`} />}
      <span className="text-xs text-muted-foreground">{def?.desc}</span>
    </div>
  );
}

export default function DashboardPage({ profile, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    display_name: profile?.display_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    avatar_url: profile?.avatar_url || "",
    cover_url: (profile as Record<string, unknown>)?.cover_url as string || "",
  });

  // Blocks state
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [blocksLoading, setBlocksLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Partial<PageBlock> | null>(null);
  const [deletingBlockId, setDeletingBlockId] = useState<string | null>(null);

  const profileUrl = profile?.username ? `${window.location.origin}/u/${profile.username}` : null;

  useEffect(() => {
    if (!profile) return;
    supabase.from("page_blocks").select("*").eq("profile_id", profile.id)
      .order("position", { ascending: true })
      .then(({ data }) => { setBlocks((data as PageBlock[]) || []); setBlocksLoading(false); });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({
      display_name: form.display_name,
      username: form.username,
      bio: form.bio,
      website: form.website,
      avatar_url: form.avatar_url,
      cover_url: form.cover_url,
    } as Partial<Profile>);
    setSaving(false);
    toast({ title: "✅ Profil mis à jour !" });
  };

  const copyUrl = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.user_id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erreur upload", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = data.publicUrl + `?t=${Date.now()}`;
    setForm(f => ({ ...f, avatar_url: avatarUrl }));
    await onUpdate({ avatar_url: avatarUrl });
    toast({ title: "✅ Photo de profil mise à jour !" });
    setUploading(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploadingCover(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.user_id}/cover.${ext}`;
    const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erreur upload", description: error.message, variant: "destructive" }); setUploadingCover(false); return; }
    const { data } = supabase.storage.from("covers").getPublicUrl(path);
    const coverUrl = data.publicUrl + `?t=${Date.now()}`;
    setForm(f => ({ ...f, cover_url: coverUrl }));
    await onUpdate({ cover_url: coverUrl } as Partial<Profile>);
    toast({ title: "✅ Photo de couverture mise à jour !" });
    setUploadingCover(false);
  };


  const addBlock = (type: string) => {
    setEditingBlock({ type, title: "", content: {}, position: blocks.length, is_active: true });
    setShowBlockModal(false);
  };

  const saveBlock = async (data: Partial<PageBlock>) => {
    if (!profile) return;
    if (data.id) {
      // Update existing
      const { data: updated } = await supabase.from("page_blocks").update({
        title: data.title,
        content: (data.content || {}) as Record<string, string | number | boolean | null>,
        is_active: data.is_active,
      }).eq("id", data.id).select().single();
      if (updated) setBlocks(prev => prev.map(b => b.id === data.id ? updated as PageBlock : b));
    } else {
      // Insert new
      const { data: created } = await supabase.from("page_blocks").insert([{
        profile_id: profile.id, type: data.type!, title: data.title || null,
        content: (data.content || {}) as Record<string, string | number | boolean | null>,
        position: blocks.length, is_active: true,
      }]).select().single();
      if (created) setBlocks(prev => [...prev, created as PageBlock]);
    }
    setEditingBlock(null);
    toast({ title: "✅ Bloc sauvegardé !" });
  };

  const deleteBlock = async (id: string) => {
    setDeletingBlockId(id);
    await supabase.from("page_blocks").delete().eq("id", id);
    setBlocks(prev => prev.filter(b => b.id !== id));
    setDeletingBlockId(null);
  };

  const toggleBlock = async (block: PageBlock) => {
    const newVal = !block.is_active;
    await supabase.from("page_blocks").update({ is_active: newVal }).eq("id", block.id);
    setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, is_active: newVal } : b));
  };

  const moveBlock = async (id: string, dir: "up" | "down") => {
    const idx = blocks.findIndex(b => b.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
    const updated = newBlocks.map((b, i) => ({ ...b, position: i }));
    setBlocks(updated);
    await Promise.all(updated.map(b => supabase.from("page_blocks").update({ position: b.position }).eq("id", b.id)));
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Block type modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <h3 className="font-dm font-bold text-lg">Ajouter un bloc</h3>
              <button onClick={() => setShowBlockModal(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {BLOCK_TYPES.map((bt, i) => (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 ${bt.preview} hover:border-primary/40 hover:scale-105 active:scale-95 transition-all duration-200 text-center group opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bt.iconColor.split(" ")[1]} group-hover:shadow-md transition-shadow duration-200`}><bt.Icon className={`w-5 h-5 ${bt.iconColor.split(" ")[0]}`} /></div>
                  <span className="text-[11px] font-semibold text-foreground leading-tight">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block editor */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock}
          onSave={saveBlock}
          onClose={() => setEditingBlock(null)}
        />
      )}

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

      {/* Cover photo + Avatar section */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
        {/* Cover photo */}
        <div className="relative h-36 bg-gradient-to-br from-primary/20 to-primary/5 group">
          {form.cover_url ? (
            <img src={form.cover_url} alt="Couverture" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Aucune photo de couverture</p>
            </div>
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow">
              {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {uploadingCover ? "Upload..." : "Modifier la couverture"}
            </div>
          </button>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative flex-shrink-0">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow-blue border-4 border-card" />
              ) : (
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-blue border-4 border-card">
                  {(form.display_name || form.username || "U")[0].toUpperCase()}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div className="pb-1">
              <p className="font-dm font-bold text-base text-foreground">{form.display_name || "Ton nom"}</p>
              {form.username && <p className="text-xs text-muted-foreground">@{form.username}</p>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Photo de profil : JPG, PNG. Max 5MB. &nbsp;|&nbsp; Couverture : recommandé 1200×400px.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6 space-y-4">
        <h3 className="font-dm font-bold text-base text-foreground">Informations du profil</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nom affiché</label>
            <Input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Kofi Asante" className="rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Nom d'utilisateur <span className="text-muted-foreground">(URL)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
              <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))} placeholder="kofi" className="pl-8 rounded-xl" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">avylink.app/u/{form.username || "..."}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Parle de toi en quelques mots..." rows={3} maxLength={160}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          <p className="text-xs text-muted-foreground text-right">{form.bio.length}/160</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Site web</label>
          <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://tonsite.com" type="url" className="rounded-xl" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full gradient-cta text-primary-foreground rounded-xl font-semibold shadow-blue">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>

      {/* Content Blocks */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-dm font-bold text-base text-foreground">🧩 Blocs de contenu</h3>
          <Button size="sm" onClick={() => setShowBlockModal(true)} className="gradient-cta text-primary-foreground rounded-xl gap-1">
            <Plus className="w-4 h-4" /> Ajouter
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Enrichis ta page avec des blocs multimédia : vidéos, musique, formulaires, réseaux sociaux...</p>

        {blocksLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : blocks.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-2xl">
            <div className="text-3xl mb-2">🧩</div>
            <p className="font-medium text-foreground text-sm">Aucun bloc pour l'instant</p>
            <p className="text-xs text-muted-foreground mt-1">Clique sur "Ajouter" pour enrichir ta page</p>
            <Button size="sm" onClick={() => setShowBlockModal(true)} className="mt-3 gradient-cta text-primary-foreground rounded-xl gap-1">
              <Plus className="w-4 h-4" /> Ajouter un bloc
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, idx) => {
              const def = BLOCK_TYPES.find(b => b.type === block.type);
              return (
                <div key={block.id} className={`rounded-2xl border transition-all ${block.is_active ? "bg-secondary/30 border-border/50" : "bg-muted/20 border-border/30 opacity-60"}`}>
                  <div className="flex items-center gap-3 p-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
                      <BlockPreviewIcon type={block.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{block.title || def?.label}</p>
                      <p className="text-xs text-muted-foreground">{def?.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => moveBlock(block.id, "up")} disabled={idx === 0} className="p-1 rounded hover:bg-secondary text-muted-foreground disabled:opacity-30">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => moveBlock(block.id, "down")} disabled={idx === blocks.length - 1} className="p-1 rounded hover:bg-secondary text-muted-foreground disabled:opacity-30">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleBlock(block)} className={`w-8 h-4.5 rounded-full transition-colors relative ${block.is_active ? "bg-primary" : "bg-muted"}`} style={{ width: 32, height: 18 }}>
                        <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${block.is_active ? "left-3.5" : "left-0.5"}`} style={{ left: block.is_active ? 13 : 2 }} />
                      </button>
                      <button onClick={() => setEditingBlock(block)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteBlock(block.id)} disabled={deletingBlockId === block.id} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                        {deletingBlockId === block.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  {/* Block preview */}
                  <div className="px-4 pb-3 border-t border-border/30 pt-2">
                    <BlockPreview block={block} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview card */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
        <h3 className="font-dm font-bold text-base text-foreground mb-4">👁️ Aperçu du profil</h3>
        <div className="flex flex-col items-center gap-3 py-4">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-blue" />
          ) : (
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold shadow-blue">
              {(form.display_name || form.username || "?")[0].toUpperCase()}
            </div>
          )}
          <div className="text-center">
            <p className="font-dm font-bold text-lg text-foreground">{form.display_name || "Ton nom"}</p>
            {form.username && <p className="text-sm text-muted-foreground">@{form.username}</p>}
            {form.bio && <p className="text-sm text-foreground/70 mt-1 max-w-xs">{form.bio}</p>}
          </div>
        </div>
        {profile?.username && (
          <a href={`/u/${profile.username}`} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:underline">
            Voir la page complète →
          </a>
        )}
      </div>
    </div>
  );
}
